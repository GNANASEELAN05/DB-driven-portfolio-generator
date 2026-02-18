package com.portfolio.backend.repository;

import com.portfolio.backend.model.LanguageExperienceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LanguageExperienceRepository extends JpaRepository<LanguageExperienceItem, Long> {

    List<LanguageExperienceItem> findAllByOwnerUsernameOrderByIdAsc(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
