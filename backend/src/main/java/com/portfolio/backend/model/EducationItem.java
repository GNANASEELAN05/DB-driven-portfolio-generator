package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="education_items")
public class EducationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String degree;

    // ⭐ changed from school → institution
    private String institution;

    // ⭐ changed from period → year
    private String year;

    @Column(length = 2000)
    private String details;

    public EducationItem() {}

    public Long getId() { return id; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
