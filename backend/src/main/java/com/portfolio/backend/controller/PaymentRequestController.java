package com.portfolio.backend.controller;

import com.portfolio.backend.model.PaymentRequest;
import com.portfolio.backend.model.UpiQrImage;
import com.portfolio.backend.repository.PaymentRequestRepository;
import com.portfolio.backend.repository.UpiQrImageRepository;
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
    private JwtService jwtService;

    // ── Helper: check controller token using existing JwtService methods ─────
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

    // POST /api/payment-requests — submit a new request (public, user submits)
    @PostMapping("/payment-requests")
    public ResponseEntity<?> submitRequest(@RequestBody Map<String, Object> body) {
        try {
            PaymentRequest req = new PaymentRequest();
            req.setUsername(String.valueOf(body.get("username")));
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

    // GET /api/master-admin/payment-requests — controller views all requests
    @GetMapping("/master-admin/payment-requests")
    public ResponseEntity<?> getAllRequests(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        return ResponseEntity.ok(paymentRequestRepository.findAllByOrderByCreatedAtDesc());
    }

    // PATCH /api/master-admin/payment-requests/{id}/approve
    @PatchMapping("/master-admin/payment-requests/{id}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        return paymentRequestRepository.findById(id).map(req -> {
            req.setStatus("APPROVED");
            paymentRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("message", "Approved"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/master-admin/payment-requests/{id}/reject
    @PatchMapping("/master-admin/payment-requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        return paymentRequestRepository.findById(id).map(req -> {
            req.setStatus("REJECTED");
            paymentRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("message", "Rejected"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/payment-requests/status?username=X&version=1
    @GetMapping("/payment-requests/status")
    public ResponseEntity<?> getStatus(
            @RequestParam String username,
            @RequestParam Integer version) {
        List<PaymentRequest> list = paymentRequestRepository
                .findByUsernameOrderByCreatedAtDesc(username);
        return list.stream()
                .filter(r -> r.getVersion().equals(version))
                .findFirst()
                .map(r -> ResponseEntity.ok(Map.of("status", r.getStatus())))
                .orElse(ResponseEntity.ok(Map.of("status", "NONE")));
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

    // GET /api/master-admin/upi-qr — list metadata (no image bytes)
    @GetMapping("/master-admin/upi-qr")
    public ResponseEntity<?> listQr(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        if (!isController(auth)) return ResponseEntity.status(403).body("Forbidden");
        List<Map<String, Object>> result = new ArrayList<>();
        for (UpiQrImage qr : upiQrImageRepository.findAll()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", qr.getId());
            m.put("tier", qr.getTier());
            m.put("fileName", qr.getFileName());
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