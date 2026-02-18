package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "social_links",
        indexes = {
                @Index(name = "idx_social_owner", columnList = "ownerUsername")
        }
)
public class SocialLinks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Multi-tenant key
     */
    @Column(nullable = false)
    private String ownerUsername;

    private String email;
    private String github;
    private String linkedin;

    private String phone;
    private String website;

    private String contactTitle;

    public Long getId() { return id; }

    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }

    public String getEmail() { return email; }
    public String getGithub() { return github; }
    public String getLinkedin() { return linkedin; }
    public String getPhone() { return phone; }
    public String getWebsite() { return website; }
    public String getContactTitle() { return contactTitle; }

    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setGithub(String github) { this.github = github; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setWebsite(String website) { this.website = website; }
    public void setContactTitle(String contactTitle) { this.contactTitle = contactTitle; }
}
