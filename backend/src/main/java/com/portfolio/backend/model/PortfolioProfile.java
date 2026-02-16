package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="portfolio_profile")
public class PortfolioProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;

    @Column(length = 2000)
    private String tagline;

    @Column(length = 8000)
    private String about;

    private String location;
    private String emailPublic;
    private String initials;

    public PortfolioProfile() {}

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEmailPublic() { return emailPublic; }
    public void setEmailPublic(String emailPublic) { this.emailPublic = emailPublic; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }
}
