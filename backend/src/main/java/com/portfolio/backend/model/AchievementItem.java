package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "achievements",
        indexes = {
                @Index(name = "idx_ach_owner", columnList = "ownerUsername")
        }
)
public class AchievementItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String title;         // e.g., "AWS Cloud Practitioner"
    private String issuer;        // e.g., "Amazon"
    private String date;          // e.g., "2025"

    @Column(length = 4000)
    private String description;   // details

    private String link;          // optional cert link

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getTitle() { return title; }
    public String getIssuer() { return issuer; }
    public String getDate() { return date; }
    public String getDescription() { return description; }
    public String getLink() { return link; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public void setDate(String date) { this.date = date; }
    public void setDescription(String description) { this.description = description; }
    public void setLink(String link) { this.link = link; }
}
