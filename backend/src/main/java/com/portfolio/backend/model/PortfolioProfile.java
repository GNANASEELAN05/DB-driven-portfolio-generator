package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "portfolio_profile",
        indexes = {
                @Index(name = "idx_profile_owner", columnList = "ownerUsername")
        }
)
public class PortfolioProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key (each user has their own portfolio)
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String name;
    private String title;

    @Column(length = 2000)
    private String tagline;

    @Column(length = 8000)
    private String about;

    private String location;
    private String emailPublic;
    private String initials;

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getName() { return name; }
    public String getTitle() { return title; }
    public String getTagline() { return tagline; }
    public String getAbout() { return about; }
    public String getLocation() { return location; }
    public String getEmailPublic() { return emailPublic; }
    public String getInitials() { return initials; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setTitle(String title) { this.title = title; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public void setAbout(String about) { this.about = about; }
    public void setLocation(String location) { this.location = location; }
    public void setEmailPublic(String emailPublic) { this.emailPublic = emailPublic; }
    public void setInitials(String initials) { this.initials = initials; }
}
