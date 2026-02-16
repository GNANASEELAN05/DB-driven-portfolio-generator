package com.portfolio.backend.repository;

import com.portfolio.backend.model.AchievementItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<AchievementItem, Long> {}
