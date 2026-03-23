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

    @Column(nullable = false)
    private String ownerUsername;

private String language;

    private String level;   // e.g., "Beginner" / "Intermediate" / "Advanced"

    private String years;   // e.g., "3"

    private String experience; // combined legacy field — kept for backward compat

    @Column(columnDefinition = "TEXT")
    private String notes;

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getYears() { return years; }
    public void setYears(String years) { this.years = years; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public void setId(Long id) { this.id = id; }
}