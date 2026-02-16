package com.portfolio.backend.repository;

import com.portfolio.backend.model.ExperienceItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<ExperienceItem, Long> {
}
