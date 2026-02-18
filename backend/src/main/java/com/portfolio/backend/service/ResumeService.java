package com.portfolio.backend.service;

import com.portfolio.backend.model.ResumeFile;
import com.portfolio.backend.repository.ResumeFileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ResumeService {

    

    private final ResumeFileRepository repo;

    public ResumeService(ResumeFileRepository repo) {
        this.repo = repo;
    }

    private String norm(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    // =========================
    // UPLOAD RESUME (per user)
    // =========================
    public void uploadResume(String ownerUsername, MultipartFile file) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String u = norm(ownerUsername);

        ResumeFile r = new ResumeFile();
        r.setOwnerUsername(u);
        r.setFilename(file.getOriginalFilename());
        r.setContentType(file.getContentType());
        r.setData(file.getBytes());

        // if first resume for THIS user → make primary
        if (repo.countByOwnerUsername(u) == 0) {
            r.setPrimaryResume(true);
        }

        repo.save(r);
    }

    public List<ResumeFile> getAllResumes(String ownerUsername) {
        return repo.findAllByOwnerUsernameOrderByUploadedAtDesc(norm(ownerUsername));
    }

    public ResumeFile getResumeById(String ownerUsername, Long id) {
        String u = norm(ownerUsername);
        return repo.findById(id)
                .filter(r -> u.equals(r.getOwnerUsername()))
                .orElse(null);
    }

    // =========================
    // GET PRIMARY FOR VIEWER (per user)
    // =========================
    public ResumeFile getLatestResume(String ownerUsername) {

        String u = norm(ownerUsername);

        ResumeFile primary = repo.findFirstByOwnerUsernameAndPrimaryResumeTrue(u).orElse(null);
        if (primary != null) return primary;

        List<ResumeFile> all = repo.findAllByOwnerUsernameOrderByUploadedAtDesc(u);
        if (all.isEmpty()) return null;

        return all.get(0);
    }

    // =========================
    // DELETE (per user)
    // =========================
    public void deleteResume(String ownerUsername, Long id) {
        String u = norm(ownerUsername);
        repo.findById(id).ifPresent(r -> {
            if (u.equals(r.getOwnerUsername())) {
                repo.deleteById(id);
            }
        });
    }

    // =========================
    // SET PRIMARY (per user)
    // =========================
    public void setPrimary(String ownerUsername, Long id) {

        String u = norm(ownerUsername);

        List<ResumeFile> all = repo.findAllByOwnerUsernameOrderByUploadedAtDesc(u);

        // remove all primary
        for (ResumeFile r : all) {
            r.setPrimaryResume(false);
        }
        repo.saveAll(all);

        // set selected primary (only if owned)
        ResumeFile selected = repo.findById(id)
                .filter(r -> u.equals(r.getOwnerUsername()))
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        selected.setPrimaryResume(true);
        repo.save(selected);
    }
}
