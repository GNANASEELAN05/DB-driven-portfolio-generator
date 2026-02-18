package com.portfolio.backend.repository;

import com.portfolio.backend.model.User;   // ⭐ IMPORTANT IMPORT
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    // case-insensitive login + register check
    Optional<User> findByUsernameIgnoreCase(String username);
}
