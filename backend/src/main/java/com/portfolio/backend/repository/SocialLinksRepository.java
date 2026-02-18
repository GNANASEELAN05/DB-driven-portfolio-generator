package com.portfolio.backend.repository;

import com.portfolio.backend.model.SocialLinks;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SocialLinksRepository extends JpaRepository<SocialLinks, Long> {

    Optional<SocialLinks> findFirstByOwnerUsername(String ownerUsername);

    void deleteByOwnerUsername(String ownerUsername);
}
