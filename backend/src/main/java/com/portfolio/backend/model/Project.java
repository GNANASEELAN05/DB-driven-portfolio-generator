package com.portfolio.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "projects",
        indexes = {
                @Index(name = "idx_project_owner", columnList = "ownerUsername"),
                @Index(name = "idx_project_featured", columnList = "ownerUsername,featured,updatedAt")
        }
)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String title;

    @Column(length = 5000)
    private String description;

    // frontend: repoUrl
    private String repoUrl;

    // frontend: liveUrl
    private String liveUrl;

    // tech stack (string list)
    @Column(length = 2000)
    private String tech;

    private String status; // e.g., "Completed", "In Progress"

    private Boolean featured = false;

    private Instant updatedAt = Instant.now();

    @PrePersist
    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRepoUrl() { return repoUrl; }
    public String getLiveUrl() { return liveUrl; }
    public String getTech() { return tech; }
    public String getStatus() { return status; }
    public Boolean getFeatured() { return featured; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }
    public void setTech(String tech) { this.tech = tech; }
    public void setStatus(String status) { this.status = status; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
}
