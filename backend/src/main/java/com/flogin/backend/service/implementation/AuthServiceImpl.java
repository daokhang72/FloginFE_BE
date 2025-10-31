package com.flogin.backend.service.implementation;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flogin.backend.dto.AuthResponseDTO;
import com.flogin.backend.dto.LoginDTO;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(LoginDTO registerDTO) {
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã tồn tại");
        }
        User newUser = new User();
        newUser.setUsername(registerDTO.getUsername());
        newUser.setPassword(registerDTO.getPassword());
        return userRepository.save(newUser);
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {

        String usernameInput = loginDTO.getUsername().trim();
        String passwordInput = loginDTO.getPassword().trim();
        Optional<User> userOptional = userRepository.findByUsername(usernameInput);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Sai username hoặc password");
        }

        User user = userOptional.get();

        if (!user.getPassword().trim().equals(passwordInput)) {
            throw new RuntimeException("Sai username hoặc password");
        }

        String token = "fake-jwt-token-for-" + user.getUsername();
        return new AuthResponseDTO(token);
    }
}
