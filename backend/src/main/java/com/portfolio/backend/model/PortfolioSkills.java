package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="portfolio_skills")
public class PortfolioSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // store comma-separated lists for simplicity
    @Column(length = 2000)
    private String frontend;

    @Column(length = 2000)
    private String backend;

    @Column(length = 2000)
    private String database;

    @Column(length = 2000)
    private String tools;

    public PortfolioSkills() {}

    public Long getId() { return id; }

    public String getFrontend() { return frontend; }
    public void setFrontend(String frontend) { this.frontend = frontend; }

    public String getBackend() { return backend; }
    public void setBackend(String backend) { this.backend = backend; }

    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }

    public String getTools() { return tools; }
    public void setTools(String tools) { this.tools = tools; }
}
