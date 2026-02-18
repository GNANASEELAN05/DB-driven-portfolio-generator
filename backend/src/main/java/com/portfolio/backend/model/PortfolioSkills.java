package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "portfolio_skills",
        indexes = {
                @Index(name = "idx_skills_owner", columnList = "ownerUsername")
        }
)
public class PortfolioSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    // store comma-separated lists for simplicity
    @Column(length = 2000)
    private String frontend;

    @Column(length = 2000)
    private String backend;

    @Column(length = 2000)
    private String database;

    @Column(length = 2000)
    private String tools;

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getFrontend() { return frontend; }
    public String getBackend() { return backend; }
    public String getDatabase() { return database; }
    public String getTools() { return tools; }

    public void setId(Long id) { this.id = id; }
    public void setFrontend(String frontend) { this.frontend = frontend; }
    public void setBackend(String backend) { this.backend = backend; }
    public void setDatabase(String database) { this.database = database; }
    public void setTools(String tools) { this.tools = tools; }
}
