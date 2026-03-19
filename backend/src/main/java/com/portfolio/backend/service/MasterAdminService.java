package com.portfolio.backend.service;

import com.portfolio.backend.model.MasterAdmin;
import com.portfolio.backend.repository.MasterAdminRepository;
import com.portfolio.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class MasterAdminService implements ApplicationRunner {

    @Autowired
    private MasterAdminRepository masterAdminRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ── Read credentials from environment variables (never hardcoded) ─────
    @Value("${controller.username}")
    private String controllerUsername;

    // This must already be a BCrypt hash — generate using GenerateHash.java
    @Value("${controller.password.hash}")
    private String controllerPasswordHash;

    @Value("${controller.display.name}")
    private String controllerDisplayName;

    // ── Seed controller account on first startup using env vars ───────────
    // Stores username EXACTLY as typed in env var — no case conversion, spaces allowed
    @Override
    public void run(ApplicationArguments args) {
        String uExact = controllerUsername.trim(); // no toLowerCase — keep exactly as typed
        if (!masterAdminRepository.existsByUsername(uExact)) {
            MasterAdmin master = new MasterAdmin();
            master.setUsername(uExact);
            master.setPassword(controllerPasswordHash); // already a BCrypt hash from env
            master.setDisplayName(controllerDisplayName);
            masterAdminRepository.save(master);
            System.out.println("✅ Controller account seeded → username: " + uExact);
        }
    }

    // ── Authenticate and return JWT token ─────────────────────────────────
    // Exact match — type username exactly as stored (case-sensitive, spaces matter)
    public Map<String, String> login(String username, String password) {
        Optional<MasterAdmin> opt = masterAdminRepository.findByUsername(username.trim());

        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid controller credentials");
        }

        MasterAdmin master = opt.get();

        if (!passwordEncoder.matches(password, master.getPassword())) {
            throw new RuntimeException("Invalid controller credentials");
        }

        String token = jwtService.generateControllerToken(master.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", master.getDisplayName() != null ? master.getDisplayName() : master.getUsername());
        response.put("role", "CONTROLLER");
        return response;
    }

    // ── Create a new controller account (optional utility) ────────────────
    // Stores username exactly as provided — no case conversion, spaces allowed
    public MasterAdmin createController(String username, String password, String displayName) {
        String uExact = username.trim();
        if (masterAdminRepository.existsByUsername(uExact)) {
            throw new RuntimeException("Username already exists");
        }
        MasterAdmin master = new MasterAdmin();
        master.setUsername(uExact);
        master.setPassword(passwordEncoder.encode(password));
        master.setDisplayName(displayName);
        return masterAdminRepository.save(master);
    }
}