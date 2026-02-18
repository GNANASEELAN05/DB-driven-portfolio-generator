package com.portfolio.backend.controller;

import com.portfolio.backend.model.*;
import com.portfolio.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/u/{username}/portfolio")
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

    // ====================== helpers ======================

    private String norm(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    private void assertOwner(String username) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String current = auth.getName().trim().toLowerCase();
        if (!current.equals(norm(username))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your portfolio");
        }
    }

    // ====================== PUBLIC GETs ======================

    @GetMapping("/profile")
    public PortfolioProfile getProfile(@PathVariable String username) {
        return profileRepo.findFirstByOwnerUsername(norm(username)).orElse(null);
    }

    @GetMapping("/skills")
    public PortfolioSkills getSkills(@PathVariable String username) {
        return skillsRepo.findFirstByOwnerUsername(norm(username)).orElse(null);
    }

    @GetMapping("/socials")
    public SocialLinks getSocials(@PathVariable String username) {
        return socialsRepo.findFirstByOwnerUsername(norm(username)).orElse(null);
    }

    @GetMapping("/achievements")
    public List<AchievementItem> getAchievements(@PathVariable String username) {
        return achievementRepo.findAllByOwnerUsernameOrderByIdAsc(norm(username));
    }

    @GetMapping("/languages")
    public List<LanguageExperienceItem> getLanguages(@PathVariable String username) {
        return languageRepo.findAllByOwnerUsernameOrderByIdAsc(norm(username));
    }

    @GetMapping("/education")
    public List<EducationItem> getEducation(@PathVariable String username) {
        return eduRepo.findAllByOwnerUsernameOrderByIdAsc(norm(username));
    }

    @GetMapping("/experience")
    public List<ExperienceItem> getExperience(@PathVariable String username) {
        return expRepo.findAllByOwnerUsernameOrderByIdAsc(norm(username));
    }

    // ====================== ADMIN PUTs (must match JWT user) ======================

    @PutMapping("/profile")
    @Transactional
    public PortfolioProfile updateProfile(@PathVariable String username,
                                         @RequestBody PortfolioProfile body) {
        assertOwner(username);

        String u = norm(username);

        // overwrite strategy (1 row per user)
        profileRepo.deleteByOwnerUsername(u);

        body.setId(null);
        body.setOwnerUsername(u);
        return profileRepo.save(body);
    }

    @PutMapping("/skills")
    @Transactional
    public PortfolioSkills updateSkills(@PathVariable String username,
                                        @RequestBody PortfolioSkills body) {
        assertOwner(username);

        String u = norm(username);
        skillsRepo.deleteByOwnerUsername(u);

        body.setId(null);
        body.setOwnerUsername(u);
        return skillsRepo.save(body);
    }

    @PutMapping("/socials")
    @Transactional
    public SocialLinks updateSocials(@PathVariable String username,
                                     @RequestBody SocialLinks body) {
        assertOwner(username);

        String u = norm(username);
        socialsRepo.deleteByOwnerUsername(u);

        body.setId(null);
        body.setOwnerUsername(u);
        return socialsRepo.save(body);
    }

    @PutMapping("/achievements")
    @Transactional
    public List<AchievementItem> saveAchievements(@PathVariable String username,
                                                 @RequestBody List<AchievementItem> items) {
        assertOwner(username);
        String u = norm(username);

        achievementRepo.deleteByOwnerUsername(u);

        for (AchievementItem a : items) {
            a.setId(null);
            a.setOwnerUsername(u);
        }
        return achievementRepo.saveAll(items);
    }

    @PutMapping("/languages")
    @Transactional
    public List<LanguageExperienceItem> saveLanguages(@PathVariable String username,
                                                     @RequestBody List<LanguageExperienceItem> items) {
        assertOwner(username);
        String u = norm(username);

        languageRepo.deleteByOwnerUsername(u);

        for (LanguageExperienceItem l : items) {
            l.setId(null);
            l.setOwnerUsername(u);
        }
        return languageRepo.saveAll(items);
    }

    @PutMapping("/education")
    @Transactional
    public List<EducationItem> saveEducation(@PathVariable String username,
                                            @RequestBody List<EducationItem> items) {
        assertOwner(username);
        String u = norm(username);

        eduRepo.deleteByOwnerUsername(u);

        for (EducationItem e : items) {
            e.setId(null);
            e.setOwnerUsername(u);
        }
        return eduRepo.saveAll(items);
    }

    @PutMapping("/experience")
    @Transactional
    public List<ExperienceItem> saveExperience(@PathVariable String username,
                                               @RequestBody List<ExperienceItem> items) {
        assertOwner(username);
        String u = norm(username);

        expRepo.deleteByOwnerUsername(u);

        for (ExperienceItem e : items) {
            e.setId(null);
            e.setOwnerUsername(u);
        }
        return expRepo.saveAll(items);
    }
}
