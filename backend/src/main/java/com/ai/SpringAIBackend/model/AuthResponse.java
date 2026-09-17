package com.ai.SpringAIBackend.model;

public class AuthResponse {
    private String username;
    private String token;
    private String message;

    public AuthResponse(String username, String token, String message) {
        this.username = username;
        this.token = token;
        this.message = message;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
