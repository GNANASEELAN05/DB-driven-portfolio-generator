package com.portfolio.backend.repository;

import com.portfolio.backend.model.UpiQrImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UpiQrImageRepository extends JpaRepository<UpiQrImage, Long> {
    Optional<UpiQrImage> findByTier(String tier);
    void deleteByTier(String tier);
}