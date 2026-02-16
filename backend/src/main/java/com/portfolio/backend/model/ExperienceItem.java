package com.portfolio.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="experience_items")
public class ExperienceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;
    private String company;

    // 🔥 accept frontend "start"
    @JsonProperty("start")
    private String startDate;

    // 🔥 accept frontend "end"
    @JsonProperty("end")
    private String endDate;

    // 🔥 accept frontend "description"
    @Column(length = 5000)
    @JsonProperty("description")
    private String details;

    public ExperienceItem() {}

    public Long getId() { return id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
