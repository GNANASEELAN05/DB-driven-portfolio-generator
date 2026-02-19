package com.portfolio.backend.dto;

public class LoginResponse {
    private String token;
    private String username; // original case stored in DB

    public LoginResponse() {}

    public LoginResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }

    public void setToken(String token) { this.token = token; }
    public void setUsername(String username) { this.username = username; }
}
