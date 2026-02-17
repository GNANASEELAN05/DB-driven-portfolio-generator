package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class AchievementItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;         
    private String issuer;        

    // 🔥 FIX: rename date → year
    private String year;          

    @Column(length = 4000)
    private String description;   

    private String link;          

    // ===== GETTERS =====
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getIssuer() { return issuer; }
    public String getYear() { return year; }
    public String getDescription() { return description; }
    public String getLink() { return link; }

    // ===== SETTERS =====
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public void setYear(String year) { this.year = year; }
    public void setDescription(String description) { this.description = description; }
    public void setLink(String link) { this.link = link; }
}
