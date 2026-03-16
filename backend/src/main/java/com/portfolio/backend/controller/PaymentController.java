package com.portfolio.backend.controller;

import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Razorpay payment flow:
 *  1. POST /api/payment/create-order  -> returns { orderId, amount, currency, keyId }
 *  2. Frontend opens Razorpay checkout with those params
 *  3. On success, frontend calls POST /api/payment/verify  -> unlocks version
 *
 * Test / dev flow:
 *  POST /api/payment/skip-unlock  { "version": 1|2 }
 *  -> skips Razorpay, directly sets hasPremium1/hasPremium2 = true
 *
 * RENDER SETUP:
 *  Add these two Environment Variables in Render dashboard:
 *    RAZORPAY_KEY_ID      -> rzp_test_xxx or rzp_live_xxx
 *    RAZORPAY_KEY_SECRET  -> your Razorpay key secret
 *
 *  In application.properties add:
 *    razorpay.key.id=${RAZORPAY_KEY_ID:placeholder_key_id}
 *    razorpay.key.secret=${RAZORPAY_KEY_SECRET:placeholder_key_secret}
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    private final UserRepository userRepository;

    // #{null} default prevents BeanCreationException if env vars are not set.
    // App boots fine; create-order and verify return 503 until keys are configured.
    @Value("${razorpay.key.id:#{null}}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:#{null}}")
    private String razorpayKeySecret;

    public PaymentController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Check both keys are actually set before calling Razorpay API
    private boolean razorpayConfigured() {
        return razorpayKeyId     != null && !razorpayKeyId.isBlank() &&
               razorpayKeySecret != null && !razorpayKeySecret.isBlank();
    }

    // ─── CREATE ORDER ────────────────────────────────────────────────────────
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (!razorpayConfigured()) {
            return ResponseEntity.status(503).body(
                "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET " +
                "in your Render environment variables.");
        }

        int version     = ((Number) body.getOrDefault("version", 1)).intValue();
        int amountPaise = version == 2 ? 10000 : 5000;

        try {
            String credentials = razorpayKeyId + ":" + razorpayKeySecret;
            String basicAuth   = Base64.getEncoder()
                    .encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",   amountPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt",  "portfolio_v" + version + "_" + System.currentTimeMillis());

            java.net.http.HttpClient  client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest req    = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", "Basic " + basicAuth)
                    .header("Content-Type",  "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(orderRequest.toString()))
                    .build();

            java.net.http.HttpResponse<String> resp =
                    client.send(req, java.net.http.HttpResponse.BodyHandlers.ofString());

            JSONObject rzpOrder = new JSONObject(resp.body());

            if (rzpOrder.has("error")) {
                return ResponseEntity.status(502).body(
                    "Razorpay error: " + rzpOrder.getJSONObject("error").optString("description"));
            }

            Map<String, Object> result = new HashMap<>();
            result.put("orderId",  rzpOrder.getString("id"));
            result.put("amount",   amountPaise);
            result.put("currency", "INR");
            result.put("keyId",    razorpayKeyId);
            result.put("version",  version);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Order creation failed: " + e.getMessage());
        }
    }

    // ─── VERIFY PAYMENT ──────────────────────────────────────────────────────
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (!razorpayConfigured()) {
            return ResponseEntity.status(503).body("Razorpay is not configured on the server.");
        }

        String orderId   = body.get("razorpay_order_id");
        String paymentId = body.get("razorpay_payment_id");
        String signature = body.get("razorpay_signature");
        int    version   = Integer.parseInt(body.getOrDefault("version", "1"));

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest().body("Missing payment fields");
        }

        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexHash = new StringBuilder();
            for (byte b : hash) hexHash.append(String.format("%02x", b));

            if (!hexHash.toString().equals(signature)) {
                return ResponseEntity.status(400).body("Payment verification failed");
            }

            return unlockVersion(auth.getName(), version);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Verification error: " + e.getMessage());
        }
    }

    // ─── SKIP UNLOCK (TEST ONLY) ─────────────────────────────────────────────
    // Razorpay keys NOT required — safe to call even before keys are configured.
    @PostMapping("/skip-unlock")
    public ResponseEntity<?> skipUnlock(@RequestBody Map<String, Object> body) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        int version = ((Number) body.getOrDefault("version", 1)).intValue();
        return unlockVersion(auth.getName(), version);
    }

    // ─── CHECK STATUS ─────────────────────────────────────────────────────────
    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository
                .findByUsernameIgnoreCase(auth.getName().toLowerCase())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("hasPremium1", user.isHasPremium1());
        result.put("hasPremium2", user.isHasPremium2());
        return ResponseEntity.ok(result);
    }

    // ─── SHARED HELPER ────────────────────────────────────────────────────────
    private ResponseEntity<?> unlockVersion(String authName, int version) {
        User user = userRepository
                .findByUsernameIgnoreCase(authName.toLowerCase())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (version == 1) {
            user.setHasPremium1(true);
        } else if (version == 2) {
            user.setHasPremium2(true);
        } else {
            return ResponseEntity.badRequest().body("Unknown version: " + version);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("success",     true);
        result.put("version",     version);
        result.put("hasPremium1", user.isHasPremium1());
        result.put("hasPremium2", user.isHasPremium2());
        return ResponseEntity.ok(result);
    }
}