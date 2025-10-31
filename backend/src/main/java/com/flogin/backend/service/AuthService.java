package com.flogin.backend.service;

import com.flogin.backend.dto.AuthResponseDTO;
import com.flogin.backend.dto.LoginDTO;
import com.flogin.backend.entity.User;

public interface AuthService {
    User registerUser(LoginDTO registerDTO);
    AuthResponseDTO login(LoginDTO loginDTO);
}   
