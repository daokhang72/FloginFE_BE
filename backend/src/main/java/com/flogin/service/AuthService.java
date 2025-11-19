package com.flogin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.dto.RegisterRequest;
import com.flogin.entity.AppUser;
import com.flogin.repository.AppUserRepository;
import com.flogin.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AppUserRepository appUserRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider tokenProvider;

    // Logic Đăng nhập
    public LoginResponse loginUser(LoginRequest loginRequest) {
        // 1. Xác thực user (username + password)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 2. Lưu thông tin xác thực vào Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Tạo Token
        String token = tokenProvider.generateToken(authentication);

        return new LoginResponse("Đăng nhập thành công!", token);
    }

    // Logic Đăng ký
    public String registerUser(RegisterRequest registerRequest) {
        // 1. Kiểm tra username tồn tại
        if (appUserRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Lỗi: Username đã được sử dụng!");
        }

        // 2. Tạo user mới
        AppUser user = new AppUser(
                registerRequest.getUsername(),
                // 3. Băm mật khẩu
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail()
        );

        appUserRepository.save(user);
        return "Đăng ký user thành công!";
    }
}