package com.portfolio.backend.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Run this class once locally to generate a BCrypt hash of your password.
 * Copy the printed hash → paste into your Railway environment variable.
 *
 * HOW TO RUN:
 *   Right-click this file in IntelliJ → "Run GenerateHash.main()"
 *   OR from terminal: mvn exec:java -Dexec.mainClass="com.portfolio.backend.util.GenerateHash"
 */
public class GenerateHash {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // ── Change this to your desired password ──────────────────────────
        String rawPassword = "Controller_GnanaV@3791";
        // ─────────────────────────────────────────────────────────────────

        String hash = encoder.encode(rawPassword);

        System.out.println("===========================================");
        System.out.println("Raw Password : " + rawPassword);
        System.out.println("BCrypt Hash  : " + hash);
        System.out.println("===========================================");
        System.out.println("Copy the hash above → set as environment variable:");
        System.out.println("CONTROLLER_PASSWORD_HASH=" + hash);
        System.out.println("===========================================");
    }
}