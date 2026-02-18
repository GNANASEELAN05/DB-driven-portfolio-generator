package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "education_items",
        indexes = {
                @Index(name = "idx_education_owner", columnList = "ownerUsername")
        }
)
public class EducationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String degree;
    private String institution;
    private String year;

    @Column(length = 4000)
    private String details;

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getDegree() { return degree; }
    public String getInstitution() { return institution; }
    public String getYear() { return year; }
    public String getDetails() { return details; }

    public void setId(Long id) { this.id = id; }
    public void setDegree(String degree) { this.degree = degree; }
    public void setInstitution(String institution) { this.institution = institution; }
    public void setYear(String year) { this.year = year; }
    public void setDetails(String details) { this.details = details; }
}
