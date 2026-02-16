package com.portfolio.backend.repository;

import com.portfolio.backend.model.ResumeFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResumeFileRepository extends JpaRepository<ResumeFile, Long> {

    // ⭐ gets primary resume
    Optional<ResumeFile> findFirstByPrimaryResumeTrue();

}
