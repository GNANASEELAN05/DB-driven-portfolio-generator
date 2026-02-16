package com.portfolio.backend.controller;

import com.portfolio.backend.model.ResumeFile;
import com.portfolio.backend.service.ResumeService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService service;

    public ResumeController(ResumeService service) {
        this.service = service;
    }

    // =========================================================
    // ADMIN: Upload PDF resume
    // =========================================================
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestPart("file") MultipartFile file) {

        System.out.println("====== UPLOAD API CALLED ======");
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("Size: " + file.getSize());

        try {
            service.uploadResume(file);
            System.out.println("====== UPLOAD SUCCESS ======");
            return ResponseEntity.ok("Resume uploaded successfully");

        } catch (Exception e) {

            System.out.println("====== UPLOAD FAILED ======");
            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body("Upload failed: " + e.getMessage());
        }
    }

    // =========================================================
    // ADMIN: Get all resumes list (WITH UPLOAD DATE)
    // =========================================================
    @GetMapping("/list")
    public ResponseEntity<?> getAll() {
        try {
            List<ResumeFile> list = service.getAllResumes();

            List<Map<String, Object>> response = new ArrayList<>();
            int i = 1;

            for (ResumeFile r : list) {
                Map<String, Object> map = new HashMap<>();

                map.put("id", r.getId());
                map.put("fileName", r.getFilename());
                map.put("serial", i++);
                map.put("primary", r.isPrimaryResume());

                // ⭐⭐⭐ SEND UPLOAD DATE TO FRONTEND
                map.put("uploadedAt", r.getUploadedAt());

                response.add(map);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch resumes");
        }
    }

    // =========================================================
    // ADMIN: Preview resume
    // =========================================================
    @GetMapping("/{id}/view")
    public ResponseEntity<byte[]> viewResume(@PathVariable Long id) {
        try {
            ResumeFile file = service.getResumeById(id);

            if (file == null || file.getData() == null)
                return ResponseEntity.notFound().build();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename(file.getFilename() != null ? file.getFilename() : "resume.pdf")
                            .build()
            );

            return new ResponseEntity<>(file.getData(), headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // =========================================================
    // VIEWER: Download primary resume
    // =========================================================
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadLatest() {
        try {
            ResumeFile latest = service.getLatestResume();

            if (latest == null || latest.getData() == null) {
                return ResponseEntity.notFound().build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename(latest.getFilename() != null ? latest.getFilename() : "resume.pdf")
                            .build()
            );

            return new ResponseEntity<>(latest.getData(), headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // =========================================================
    // ADMIN: Delete resume
    // =========================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteResume(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Delete failed");
        }
    }

    // =========================================================
    // ADMIN: Set primary
    // =========================================================
    @PutMapping("/{id}/primary")
    public ResponseEntity<?> setPrimary(@PathVariable Long id) {
        try {
            service.setPrimary(id);
            return ResponseEntity.ok("Primary updated");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Primary update failed");
        }
    }
}
