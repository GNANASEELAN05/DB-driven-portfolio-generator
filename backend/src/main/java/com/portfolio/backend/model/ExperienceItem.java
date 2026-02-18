package com.portfolio.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(
        name = "experience_items",
        indexes = {
                @Index(name = "idx_experience_owner", columnList = "owner_username")
        }
)
public class ExperienceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // MULTI USER OWNER
    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;

    private String role;
    private String company;

    // 🔥 FIX RESERVED WORD
    @Column(name = "start_date")
    private String start;

    // 🔥 FIX RESERVED WORD
    @Column(name = "end_date")
    private String end;

    @Column(length = 4000)
    private String description;

    // ===== GETTERS =====

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }

    @JsonProperty("role")
    public String getRole() { return role; }

    public String getCompany() { return company; }

    public String getStart() { return start; }

    public String getEnd() { return end; }

    public String getDescription() { return description; }

    // ===== SETTERS =====

    public void setId(Long id) { this.id = id; }

    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public void setRole(String role) { this.role = role; }

    public void setCompany(String company) { this.company = company; }

    public void setStart(String start) { this.start = start; }

    public void setEnd(String end) { this.end = end; }

    public void setDescription(String description) { this.description = description; }
}
