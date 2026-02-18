package com.portfolio.backend.repository;

import com.portfolio.backend.model.EducationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<EducationItem, Long> {

    List<EducationItem> findAllByOwnerUsernameOrderByIdAsc(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
