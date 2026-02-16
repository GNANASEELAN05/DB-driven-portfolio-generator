package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="social_links")
public class SocialLinks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String github;
    private String linkedin;

    // ⭐ ADD THESE TWO
    private String phone;
    private String website;

    private String ctaTitle;
    private String ctaSubtitle;

    public SocialLinks() {}

    public Long getId() { return id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    // ⭐ PHONE
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    // ⭐ WEBSITE
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getCtaTitle() { return ctaTitle; }
    public void setCtaTitle(String ctaTitle) { this.ctaTitle = ctaTitle; }

    public String getCtaSubtitle() { return ctaSubtitle; }
    public void setCtaSubtitle(String ctaSubtitle) { this.ctaSubtitle = ctaSubtitle; }
}
