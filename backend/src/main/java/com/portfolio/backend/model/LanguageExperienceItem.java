package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "language_experience",
        indexes = {
                @Index(name = "idx_lang_owner", columnList = "ownerUsername")
        }
)
public class LanguageExperienceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String language;
    private String experience; // e.g., "2 years"

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getLanguage() { return language; }
    public String getExperience() { return experience; }

    public void setId(Long id) { this.id = id; }
    public void setLanguage(String language) { this.language = language; }
    public void setExperience(String experience) { this.experience = experience; }
}
