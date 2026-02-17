package com.portfolio.backend.controller;

import com.portfolio.backend.model.*;
import com.portfolio.backend.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioProfileRepository profileRepo;
    private final PortfolioSkillsRepository skillsRepo;
    private final ExperienceRepository expRepo;
    private final EducationRepository eduRepo;
    private final SocialLinksRepository socialsRepo;
    private final AchievementRepository achievementRepo;
    private final LanguageExperienceRepository languageRepo;

    public PortfolioController(
            PortfolioProfileRepository profileRepo,
            PortfolioSkillsRepository skillsRepo,
            ExperienceRepository expRepo,
            EducationRepository eduRepo,
            SocialLinksRepository socialsRepo,
            AchievementRepository achievementRepo,
            LanguageExperienceRepository languageRepo
    ) {
        this.profileRepo = profileRepo;
        this.skillsRepo = skillsRepo;
        this.expRepo = expRepo;
        this.eduRepo = eduRepo;
        this.socialsRepo = socialsRepo;
        this.achievementRepo = achievementRepo;
        this.languageRepo = languageRepo;
    }

    // ====================== GET ======================

    @GetMapping("/profile")
    public PortfolioProfile getProfile() {
        return profileRepo.findAll().stream().findFirst().orElse(new PortfolioProfile());
    }

    @GetMapping("/skills")
    public PortfolioSkills getSkills() {
        return skillsRepo.findAll().stream().findFirst().orElse(new PortfolioSkills());
    }

    @GetMapping("/experience")
    public List<ExperienceItem> getExperience() {
        return expRepo.findAll();
    }

    @GetMapping("/education")
    public List<EducationItem> getEducation() {
        return eduRepo.findAll();
    }

    @GetMapping("/socials")
    public SocialLinks getSocials() {
        return socialsRepo.findAll().stream().findFirst().orElse(new SocialLinks());
    }

    @GetMapping("/achievements")
    public List<AchievementItem> getAchievements() {
        return achievementRepo.findAll();
    }

    @GetMapping("/languages")
    public List<LanguageExperienceItem> getLanguages() {
        return languageRepo.findAll();
    }

    // ====================== PROFILE SAVE ======================

    @PutMapping("/profile")
    @Transactional
    public PortfolioProfile saveProfile(@RequestBody PortfolioProfile req) {

        Optional<PortfolioProfile> existingOpt = profileRepo.findAll().stream().findFirst();
        PortfolioProfile profile;

        if (existingOpt.isPresent()) {
            profile = existingOpt.get();
            profile.setName(req.getName());
            profile.setTitle(req.getTitle());
            profile.setTagline(req.getTagline());
            profile.setAbout(req.getAbout());
            profile.setLocation(req.getLocation());
            profile.setEmailPublic(req.getEmailPublic());
            profile.setInitials(req.getInitials());
        } else {
            profile = req;
        }

        return profileRepo.save(profile);
    }

    // ====================== SKILLS ======================

    @PutMapping("/skills")
    @Transactional
    public PortfolioSkills saveSkills(@RequestBody PortfolioSkills req) {

        skillsRepo.deleteAll();
        skillsRepo.flush(); // ⭐ IMPORTANT

        if (req == null) return new PortfolioSkills();

        return skillsRepo.save(req);
    }

    // ====================== SOCIALS ======================

    @PutMapping("/socials")
    @Transactional
    public SocialLinks saveSocials(@RequestBody SocialLinks req) {

        socialsRepo.deleteAll();
        socialsRepo.flush();

        if (req == null) return new SocialLinks();

        return socialsRepo.save(req);
    }

    // ====================== EDUCATION ======================

    @PutMapping("/education")
    @Transactional
    public List<EducationItem> saveEducation(@RequestBody List<EducationItem> items) {

        eduRepo.deleteAll();
        eduRepo.flush();

        if (items == null || items.isEmpty()) return List.of();

        return eduRepo.saveAll(items);
    }

    // ====================== EXPERIENCE ======================

    @PutMapping("/experience")
    @Transactional
    public List<ExperienceItem> saveExperience(@RequestBody List<ExperienceItem> items) {

        expRepo.deleteAll();
        expRepo.flush();

        if (items == null || items.isEmpty()) return List.of();

        return expRepo.saveAll(items);
    }

    // ====================== ACHIEVEMENTS ======================

    @PutMapping("/achievements")
    @Transactional
    public List<AchievementItem> saveAchievements(@RequestBody List<AchievementItem> items) {

        achievementRepo.deleteAll();
        achievementRepo.flush();

        if (items == null || items.isEmpty()) return List.of();

        return achievementRepo.saveAll(items);
    }

    // ====================== LANGUAGES ======================

    @PutMapping("/languages")
    @Transactional
    public List<LanguageExperienceItem> saveLanguages(@RequestBody List<LanguageExperienceItem> items) {

        languageRepo.deleteAll();
        languageRepo.flush();

        if (items == null || items.isEmpty()) return List.of();

        return languageRepo.saveAll(items);
    }
}
