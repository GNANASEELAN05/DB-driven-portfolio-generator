package com.portfolio.backend.repository;

import com.portfolio.backend.model.PortfolioSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortfolioSkillsRepository extends JpaRepository<PortfolioSkills, Long> {

    Optional<PortfolioSkills> findFirstByOwnerUsername(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
