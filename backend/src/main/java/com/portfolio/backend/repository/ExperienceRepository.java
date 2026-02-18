package com.portfolio.backend.repository;

import com.portfolio.backend.model.ExperienceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<ExperienceItem, Long> {

    List<ExperienceItem> findAllByOwnerUsernameOrderByIdAsc(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
