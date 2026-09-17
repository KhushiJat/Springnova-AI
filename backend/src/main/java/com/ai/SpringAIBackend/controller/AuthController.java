package com.ai.SpringAIBackend.controller;

import com.ai.SpringAIBackend.model.AuthResponse;
import com.ai.SpringAIBackend.model.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Simple authentication check (You can connect this to a database service later)
        if ("admin".equals(request.getUsername()) && "password123".equals(request.getPassword())) {
            String dummyToken = "jwt-springnova-secure-token-xyz987";
            return ResponseEntity.ok(new AuthResponse(request.getUsername(), dummyToken, "Login Successful"));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
