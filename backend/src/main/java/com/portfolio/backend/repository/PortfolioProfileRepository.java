package com.portfolio.backend.repository;

import com.portfolio.backend.model.PortfolioProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProfileRepository extends JpaRepository<PortfolioProfile, Long> {}
