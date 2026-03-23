package com.portfolio.backend.controller;

import com.portfolio.backend.model.PaymentRequest;
import com.portfolio.backend.model.UpiQrImage;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.PaymentRequestRepository;
import com.portfolio.backend.repository.UpiQrImageRepository;
import com.portfolio.backend.repository.UserRepository;
import com.portfolio.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api")
public class PaymentRequestController {

    @Autowired
    private PaymentRequestRepository paymentRequestRepository;

    @Autowired
    private UpiQrImageRepository upiQrImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // ── Helper: check controller token ─────────────────────────────────────
    private boolean isController(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        try {
            String token = authHeader.substring(7);
            if (!jwtService.isTokenValid(token)) return false;
            return "CONTROLLER".equals(jwtService.extractRole(token));
        } catch (Exception e) {
            return false;
        }
    }

    // ════════════════════════════════════════
    // PAYMENT REQUESTS
    // ════════════════════════════════════════

    // POST /api/payment-requests — submit a new request (public)
    @PostMapping("/payment-requests")
    public ResponseEntity<?> submitRequest(@RequestBody Map<String, Object> body) {
        try {
            PaymentRequest req = new PaymentRequest();
            // Always store username in lowercase for consistent lookups
            req.setUsername(String.valueOf(body.get("username")).trim().toLowerCase());
            req.setFullName(String.valueOf(body.get("fullName")));
            req.setPhone(String.valueOf(body.get("phone")));
            req.setPaymentId(String.valueOf(body.get("paymentId")));
            req.setPaidVia(String.valueOf(body.get("paidVia")));
            req.setPaidFromMobile(String.valueOf(body.get("paidFromMobile")));
            req.setVersion(Integer.parseInt(String.valueOf(body.get("version"))));
            paymentRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("message", "Request submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/master-admin/payment-requests — controller views all
    @GetMapping("/master-admin/payment-requests")
    public ResponseEntity<?> getAllRequests(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        return ResponseEntity.ok(paymentRequestRepository.findAllByOrderByCreatedAtDesc());
    }

    // PATCH /api/master-admin/payment-requests/{id}/approve
    // Also updates User.hasPremium1 / hasPremium2 so the flag is persisted
    @PatchMapping("/master-admin/payment-requests/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");

        return paymentRequestRepository.findById(id).map(req -> {
            req.setStatus("APPROVED");
            paymentRequestRepository.save(req);

            // ── KEY FIX: use case-insensitive lookup so "Dheena"/"dheena" both match ──
            String uLower = req.getUsername() == null ? "" : req.getUsername().trim().toLowerCase();
            userRepository.findByUsernameIgnoreCase(uLower).ifPresent(user -> {
                if (req.getVersion() == 1) user.setHasPremium1(true);
                if (req.getVersion() == 2) user.setHasPremium2(true);
                userRepository.save(user);
            });

            return ResponseEntity.ok(Map.of(
                    "message", "Approved and premium unlocked for @" + req.getUsername()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/master-admin/payment-requests/{id}/reject
    // Accepts optional { "rejectionReason": "..." } in request body
    @PatchMapping("/master-admin/payment-requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody(required = false) Map<String, Object> body) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        return paymentRequestRepository.findById(id).map(req -> {
            req.setStatus("REJECTED");
            if (body != null && body.get("rejectionReason") != null) {
                String reason = String.valueOf(body.get("rejectionReason")).trim();
                if (!reason.isEmpty()) {
                    req.setRejectionReason(reason);
                }
            }
            paymentRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("message", "Rejected"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/payment-requests/status?username=X
    // Returns { hasPremium1: bool, hasPremium2: bool, requests: [...] }
    @GetMapping("/payment-requests/status")
    public ResponseEntity<?> getStatus(@RequestParam String username) {
        // Normalize username for all lookups
        String uLower = username == null ? "" : username.trim().toLowerCase();

        // Fetch all requests for this user (newest first)
        List<PaymentRequest> userRequests = paymentRequestRepository
                .findByUsernameOrderByCreatedAtDesc(uLower);

        // Primary source: User table flags (set during approve)
        // Use case-insensitive lookup so it always finds the user regardless of stored casing
        Optional<User> userOpt = userRepository.findByUsernameIgnoreCase(uLower);
        boolean p1 = userOpt.map(User::isHasPremium1).orElse(false);
        boolean p2 = userOpt.map(User::isHasPremium2).orElse(false);

        // Fallback: scan approved payment_requests if User flags somehow not set yet
        if (!p1 || !p2) {
            for (PaymentRequest r : userRequests) {
                if ("APPROVED".equals(r.getStatus())) {
                    if (r.getVersion() == 1) p1 = true;
                    if (r.getVersion() == 2) p2 = true;
                }
            }
            // If fallback kicked in, sync the User row so it won't happen again
            if (p1 || p2) {
                boolean finalP1 = p1;
                boolean finalP2 = p2;
                userOpt.ifPresent(user -> {
                    if (finalP1) user.setHasPremium1(true);
                    if (finalP2) user.setHasPremium2(true);
                    userRepository.save(user);
                });
            }
        }

        // Build safe DTO list for each request (no sensitive internal fields)
        List<Map<String, Object>> requestDtos = new ArrayList<>();
        for (PaymentRequest r : userRequests) {
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("id",              r.getId());
            dto.put("username",        r.getUsername());
            dto.put("fullName",        r.getFullName());
            dto.put("phone",           r.getPhone());
            dto.put("paymentId",       r.getPaymentId());
            dto.put("paidVia",         r.getPaidVia());
            dto.put("paidFromMobile",  r.getPaidFromMobile());
            dto.put("version",         r.getVersion());
            dto.put("status",          r.getStatus());
            dto.put("rejectionReason", r.getRejectionReason());
            dto.put("createdAt",       r.getCreatedAt());
            dto.put("updatedAt",       r.getUpdatedAt());
            requestDtos.add(dto);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("hasPremium1", p1);
        result.put("hasPremium2", p2);
        result.put("requests",    requestDtos);

        return ResponseEntity.ok(result);
    }

    // ════════════════════════════════════════
    // UPI QR IMAGES
    // ════════════════════════════════════════

    // POST /api/master-admin/upi-qr/upload
    @PostMapping("/master-admin/upi-qr/upload")
    public ResponseEntity<?> uploadQr(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tier") String tier,
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        if (!tier.equals("premium1") && !tier.equals("premium2"))
            return ResponseEntity.badRequest().body("Invalid tier");
        try {
            UpiQrImage qr = upiQrImageRepository.findByTier(tier).orElse(new UpiQrImage());
            qr.setTier(tier);
            qr.setFileName(file.getOriginalFilename());
            qr.setContentType(file.getContentType());
            qr.setData(file.getBytes());
            upiQrImageRepository.save(qr);
            return ResponseEntity.ok(Map.of("message", "QR uploaded"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/upi-qr/{tier}/view — public
    @GetMapping("/upi-qr/{tier}/view")
    public ResponseEntity<byte[]> viewQr(@PathVariable String tier) {
        return upiQrImageRepository.findByTier(tier).map(qr -> {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(qr.getContentType()));
            headers.setCacheControl("no-cache");
            return new ResponseEntity<>(qr.getData(), headers, HttpStatus.OK);
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/master-admin/upi-qr — list metadata
    @GetMapping("/master-admin/upi-qr")
    public ResponseEntity<?> listQr(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        List<Map<String, Object>> result = new ArrayList<>();
        for (UpiQrImage qr : upiQrImageRepository.findAll()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id",         qr.getId());
            m.put("tier",       qr.getTier());
            m.put("fileName",   qr.getFileName());
            m.put("uploadedAt", qr.getUploadedAt());
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }

    // DELETE /api/master-admin/upi-qr/{tier}
    @DeleteMapping("/master-admin/upi-qr/{tier}")
    public ResponseEntity<?> deleteQr(
            @PathVariable String tier,
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        upiQrImageRepository.findByTier(tier).ifPresent(upiQrImageRepository::delete);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}