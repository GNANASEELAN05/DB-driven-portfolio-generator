package com.portfolio.backend.repository;

import com.portfolio.backend.model.AchievementItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AchievementRepository extends JpaRepository<AchievementItem, Long> {

    List<AchievementItem> findAllByOwnerUsernameOrderByIdAsc(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
