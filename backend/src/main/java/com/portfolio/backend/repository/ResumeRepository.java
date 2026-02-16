package com.portfolio.backend.repository;

import com.portfolio.backend.model.ResumeFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<ResumeFile, Long> {}
