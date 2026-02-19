package com.portfolio.backend.controller;

import com.portfolio.backend.dto.LoginRequest;
import com.portfolio.backend.dto.LoginResponse;
import com.portfolio.backend.dto.RegisterRequest;
import com.portfolio.backend.model.User;
import com.portfolio.backend.repository.UserRepository;
import com.portfolio.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= PING (FOR UPTIMEROBOT) =================
    // This endpoint is SAFE and fast. Use it to keep Render awake.
    @GetMapping("/ping")
    public String ping() {
        return "awake";
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        String rawUsername = req.getUsername() == null ? "" : req.getUsername().trim();
        String usernameLower = rawUsername.toLowerCase();
        String password = req.getPassword() == null ? "" : req.getPassword();

        if (rawUsername.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body("Username and password required");
        }

        if (rawUsername.length() < 3 || rawUsername.length() > 40) {
            return ResponseEntity.badRequest().body("Username must be 3-40 characters");
        }

        // ✔ allow spaces + capital + small letters
        if (!rawUsername.matches("^[A-Za-z0-9 ._-]+$")) {
            return ResponseEntity.badRequest().body("Username can contain letters, numbers, space, . _ -");
        }

        // check duplicate (case insensitive)
        if (userRepository.findByUsernameIgnoreCase(usernameLower).isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }

        User u = new User();
        u.setUsername(rawUsername); // store ORIGINAL
        u.setPassword(passwordEncoder.encode(password));
        u.setRole("ADMIN");
        userRepository.save(u);

        String token = jwtService.generateToken(rawUsername, "ROLE_ADMIN");
        return ResponseEntity.ok(new LoginResponse(token, rawUsername));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        String inputUsername = req.getUsername() == null ? "" : req.getUsername().trim();
        String lower = inputUsername.toLowerCase();

        if (inputUsername.isBlank() || req.getPassword() == null || req.getPassword().isBlank()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userRepository.findByUsernameIgnoreCase(lower).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),   // use stored username (original case)
                            req.getPassword()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String role = user.getRole();
        if (!role.startsWith("ROLE_")) role = "ROLE_" + role;

        String token = jwtService.generateToken(user.getUsername(), role);

        // ✅ return stored username so UI always shows correct case
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername()));
    }

    // ================= LOGIN TEST =================
    @GetMapping("/login-test")
    public String loginTest(@RequestParam String username,
                            @RequestParam String password) {

        User user = userRepository.findByUsernameIgnoreCase(username.trim().toLowerCase()).orElse(null);

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
