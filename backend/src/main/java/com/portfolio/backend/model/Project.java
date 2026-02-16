package com.portfolio.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String description;

    // frontend: repoUrl
    private String repoUrl;

    // frontend: liveUrl
    private String liveUrl;

    // frontend: tech (comma separated)
    @Column(length = 2000)
    private String tech;

    // frontend: status (Live / Draft / In Progress)
    private String status;

    private Boolean featured = true;

    private Instant updatedAt = Instant.now();

    public Project() {}

    @PrePersist
    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
        if (this.featured == null) this.featured = true;
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRepoUrl() { return repoUrl; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getTech() { return tech; }
    public void setTech(String tech) { this.tech = tech; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
