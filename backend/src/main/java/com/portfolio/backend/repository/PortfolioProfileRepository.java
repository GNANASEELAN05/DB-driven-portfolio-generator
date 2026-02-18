package com.portfolio.backend.repository;

import com.portfolio.backend.model.PortfolioProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortfolioProfileRepository extends JpaRepository<PortfolioProfile, Long> {

    Optional<PortfolioProfile> findFirstByOwnerUsername(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
