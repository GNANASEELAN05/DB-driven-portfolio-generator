package com.portfolio.backend.controller;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/u/{username}/projects")
public class ProjectController {

    private final ProjectRepository repo;

    public ProjectController(ProjectRepository repo) {
        this.repo = repo;
    }

    private String norm(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    private void assertOwner(String username) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        String current = auth.getName().trim().toLowerCase();
        if (!current.equals(norm(username))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }
    }

    // ================= PUBLIC =================

    @GetMapping
    public List<Project> getAll(@PathVariable String username) {
        return repo.findAllByOwnerUsernameOrderByUpdatedAtDesc(norm(username));
    }

    @GetMapping("/featured")
    public List<Project> featured(@PathVariable String username) {
        return repo.findByOwnerUsernameAndFeaturedTrueOrderByUpdatedAtDesc(norm(username));
    }

    // ================= ADMIN =================

    @PostMapping
    public Project add(@PathVariable String username, @RequestBody Project p) {
        assertOwner(username);
        p.setId(null);
        p.setOwnerUsername(norm(username));
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable String username,
                                          @PathVariable Long id,
                                          @RequestBody Project req) {

        assertOwner(username);
        String u = norm(username);

        Optional<Project> optional = repo.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Project existing = optional.get();

        if (!u.equals(existing.getOwnerUsername())) {
            return ResponseEntity.notFound().build();
        }

        existing.setTitle(req.getTitle());
        existing.setDescription(req.getDescription());
        existing.setRepoUrl(req.getRepoUrl());
        existing.setLiveUrl(req.getLiveUrl());
        existing.setTech(req.getTech());
        existing.setStatus(req.getStatus());
        existing.setFeatured(req.getFeatured());

        repo.save(existing);

        return ResponseEntity.ok(existing);
    }

    // ================= DELETE (FIXED ERROR HERE) =================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String username,
                                       @PathVariable Long id) {

        assertOwner(username);
        String u = norm(username);

        Optional<Project> optional = repo.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Project existing = optional.get();

        if (!u.equals(existing.getOwnerUsername())) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
