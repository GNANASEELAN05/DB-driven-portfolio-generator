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

    // =========================
    // UPLOAD RESUME
    // =========================
    public void uploadResume(MultipartFile file) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        ResumeFile r = new ResumeFile();
        r.setFilename(file.getOriginalFilename());
        r.setContentType(file.getContentType());
        r.setData(file.getBytes());

        // if first resume → make primary
        if (repo.count() == 0) {
            r.setPrimaryResume(true);
        }

        repo.save(r);
    }

    // =========================
    public List<ResumeFile> getAllResumes() {
        return repo.findAll();
    }

    // =========================
    public ResumeFile getResumeById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // =========================
    // GET PRIMARY FOR VIEWER
    // =========================
    public ResumeFile getLatestResume() {

        ResumeFile primary = repo.findFirstByPrimaryResumeTrue().orElse(null);
        if (primary != null) return primary;

        List<ResumeFile> all = repo.findAll();
        if (all.isEmpty()) return null;

        return all.get(all.size() - 1);
    }

    // =========================
    // DELETE
    // =========================
    public void deleteResume(Long id) {
        repo.deleteById(id);
    }

    // =========================
    // SET PRIMARY (push to viewer)
    // =========================
    public void setPrimary(Long id) {

        List<ResumeFile> all = repo.findAll();

        // remove all primary
        for (ResumeFile r : all) {
            r.setPrimaryResume(false);
        }
        repo.saveAll(all);

        // set selected primary
        ResumeFile selected = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        selected.setPrimaryResume(true);
        repo.save(selected);
    }
}
