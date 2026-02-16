package com.portfolio.backend.repository;

import com.portfolio.backend.model.EducationItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<EducationItem, Long> {
}
