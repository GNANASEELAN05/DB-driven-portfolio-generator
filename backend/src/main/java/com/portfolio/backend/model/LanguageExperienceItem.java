package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "language_experience")
public class LanguageExperienceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String language;     // Java, JS, Python...
    private String level;        // Beginner/Intermediate/Advanced
    private String years;        // e.g. "2 years"
    @Column(length = 2000)
    private String notes;        // optional short info

    public Long getId() { return id; }
    public String getLanguage() { return language; }
    public String getLevel() { return level; }
    public String getYears() { return years; }
    public String getNotes() { return notes; }

    public void setId(Long id) { this.id = id; }
    public void setLanguage(String language) { this.language = language; }
    public void setLevel(String level) { this.level = level; }
    public void setYears(String years) { this.years = years; }
    public void setNotes(String notes) { this.notes = notes; }
}
