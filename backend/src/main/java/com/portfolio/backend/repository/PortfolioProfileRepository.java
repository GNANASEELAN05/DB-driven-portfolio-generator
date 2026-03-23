package com.portfolio.backend.repository;

import com.portfolio.backend.model.PortfolioProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortfolioProfileRepository extends JpaRepository<PortfolioProfile, Long> {

    // Primary lookup — used everywhere in controllers
    Optional<PortfolioProfile> findFirstByOwnerUsername(String ownerUsername);

    // Alias so AuthController and any code using findByOwnerUsername still compiles
    default Optional<PortfolioProfile> findByOwnerUsername(String ownerUsername) {
        return findFirstByOwnerUsername(ownerUsername);
    }

    void deleteByOwnerUsername(String ownerUsername);
}