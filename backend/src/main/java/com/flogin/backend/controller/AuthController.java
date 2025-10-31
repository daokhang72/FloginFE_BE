package com.flogin.backend.controller;

import com.flogin.backend.dto.AuthResponseDTO;
import com.flogin.backend.dto.LoginDTO;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody LoginDTO registerDTO) {
        User newUser = authService.registerUser(registerDTO);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        try {
            AuthResponseDTO response = authService.login(loginDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(new AuthResponseDTO(e.getMessage()));
        }
    }

}
