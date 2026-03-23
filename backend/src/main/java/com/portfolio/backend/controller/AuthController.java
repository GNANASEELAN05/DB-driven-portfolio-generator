package com.portfolio.backend.controller;

import com.portfolio.backend.dto.LoginRequest;
import com.portfolio.backend.dto.LoginResponse;
import com.portfolio.backend.dto.RegisterRequest;
import com.portfolio.backend.model.PortfolioProfile;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.PortfolioProfileRepository;
import com.portfolio.backend.repository.UserRepository;
import com.portfolio.backend.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PortfolioProfileRepository portfolioProfileRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          PortfolioProfileRepository portfolioProfileRepository) {
        this.authenticationManager      = authenticationManager;
        this.jwtService                 = jwtService;
        this.userRepository             = userRepository;
        this.passwordEncoder            = passwordEncoder;
        this.portfolioProfileRepository = portfolioProfileRepository;
    }

    // ================= PING (FOR UPTIMEROBOT) =================
    @GetMapping("/ping")
    public String ping() {
        return "awake";
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        String rawUsername   = req.getUsername() == null ? "" : req.getUsername().trim();
        String usernameLower = rawUsername.toLowerCase();
        String password      = req.getPassword() == null ? "" : req.getPassword();
        String email         = req.getEmail()    == null ? "" : req.getEmail().trim();
        String phone         = req.getPhone()    == null ? "" : req.getPhone().trim();

        // ── Basic validation ──────────────────────────────────────────────────
        if (rawUsername.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body("Username and password required");
        }
        if (email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (rawUsername.length() < 3 || rawUsername.length() > 40) {
            return ResponseEntity.badRequest().body("Username must be 3-40 characters");
        }
        if (!rawUsername.matches("^[A-Za-z0-9 ._-]+$")) {
            return ResponseEntity.badRequest().body("Username can contain letters, numbers, space, . _ -");
        }

        // ── Duplicate checks ──────────────────────────────────────────────────
        if (userRepository.findByUsernameIgnoreCase(usernameLower).isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(409).body("Email already registered");
        }

        // ── Save user ─────────────────────────────────────────────────────────
        User u = new User();
        u.setUsername(rawUsername);  // store ORIGINAL case for display
        u.setPassword(passwordEncoder.encode(password));
        u.setRole("ADMIN");
        u.setEmail(email);
        if (!phone.isEmpty()) u.setPhone(phone);
        u.setEnabled(true);
        userRepository.save(u);

        // ── Auto-seed PortfolioProfile with email ─────────────────────────────
        // This pre-fills the public email in the portfolio contact section.
        // Uses findFirstByOwnerUsername which is the correct method in your repo.
        try {
            PortfolioProfile profile = portfolioProfileRepository
                .findFirstByOwnerUsername(usernameLower)
                .orElse(new PortfolioProfile());
            profile.setOwnerUsername(usernameLower);

            // Only seed if not already set — don't overwrite user edits
            try {
                if (profile.getEmailPublic() == null || profile.getEmailPublic().isBlank()) {
                    profile.setEmailPublic(email);
                }
            } catch (Exception ignored) {
                // emailPublic field may not exist yet — safe to skip
            }

            portfolioProfileRepository.save(profile);
        } catch (Exception ignored) {
            // Never fail registration because of profile seed failure
        }

        String token = jwtService.generateToken(rawUsername, "ROLE_ADMIN");
        return ResponseEntity.ok(new LoginResponse(token, rawUsername));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        String inputUsername = req.getUsername() == null ? "" : req.getUsername().trim();
        String lower         = inputUsername.toLowerCase();

        if (inputUsername.isBlank() || req.getPassword() == null || req.getPassword().isBlank()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // ── Resolve: accept username OR email ─────────────────────────────────
        User user = userRepository.findByUsernameIgnoreCase(lower)
            .orElseGet(() -> userRepository.findByEmailIgnoreCase(inputUsername).orElse(null));

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    user.getUsername(),  // always use stored username
                    req.getPassword()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // ── Update last login timestamp ───────────────────────────────────────
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String role = user.getRole();
        if (!role.startsWith("ROLE_")) role = "ROLE_" + role;

        String token = jwtService.generateToken(user.getUsername(), role);
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername()));
    }

    // ================= USERNAME BY EMAIL =================
    // Used by AdminLogin.jsx to resolve email → username before calling /login
    @GetMapping("/username-by-email")
    public ResponseEntity<?> getUsernameByEmail(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email required"));
        }
        return userRepository.findByEmailIgnoreCase(email.trim())
            .map(u -> ResponseEntity.ok((Object) Map.of("username", u.getUsername())))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No account with that email")));
    }

    // ================= LOGIN TEST =================
    @GetMapping("/login-test")
    public String loginTest(@RequestParam String username,
                            @RequestParam String password) {

        User user = userRepository.findByUsernameIgnoreCase(username.trim().toLowerCase())
            .orElseGet(() -> userRepository.findByEmailIgnoreCase(username.trim()).orElse(null));

        if (user == null) return "LOGIN FAILED ❌";

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
            );
        } catch (Exception e) {
            return "LOGIN FAILED ❌";
        }

        String role = user.getRole();
        if (!role.startsWith("ROLE_")) role = "ROLE_" + role;

        String token = jwtService.generateToken(user.getUsername(), role);
        return "LOGIN SUCCESS ✅ TOKEN:\n" + token;
    }
}