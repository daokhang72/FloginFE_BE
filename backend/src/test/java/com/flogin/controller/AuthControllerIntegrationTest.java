package com.flogin.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.security.JwtTokenProvider;
import com.flogin.service.AuthService;
import com.flogin.service.CustomUserDetailsService;

/**
 * Login API Integration Tests
 * a) Test POST /api/auth/login endpoint
 * b) Test response structure và status codes
 * c) Test CORS và headers
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @BeforeEach
    void setUp() {
        given(jwtTokenProvider.validateToken(any(String.class))).willReturn(true);
        given(jwtTokenProvider.getUsernameFromToken(any(String.class))).willReturn("testuser");
    }

    // ===== (a + b) POST /api/auth/login - THÀNH CÔNG =====
    @Test
    @DisplayName("TC_LOGIN_BE_A1 - POST /api/auth/login - Dang nhap thanh cong")
    void testLoginSuccess() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("Test123");

        LoginResponse mockResponse = new LoginResponse(
                "Đăng nhập thành công!",
                "fake-jwt-token"
        );

        given(authService.loginUser(any(LoginRequest.class)))
                .willReturn(mockResponse);

        // Act + Assert
        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                // (b) status code + content type
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

                // (b) response structure: message, token, tokenType
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công!"))
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    // ===== (a + b) POST /api/auth/login - SAI TÀI KHOẢN / MẬT KHẨU =====
    @Test
    @DisplayName("TC_LOGIN_BE_A2 - POST /api/auth/login - Sai username/password")
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("wrongUser");
        request.setPassword("WrongPass1");

        // giả lập AuthService ném lỗi (ví dụ đăng nhập sai)
        willThrow(new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng."))
                .given(authService)
                .loginUser(any(LoginRequest.class));

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                // (b) GlobalExceptionHandler map RuntimeException -> 400
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Tên đăng nhập hoặc mật khẩu không đúng."));
    }

    // ===== (c) Test CORS và headers cho /api/auth/login =====
    @Test
    @DisplayName("TC_LOGIN_BE_C1 - CORS preflight cho POST /api/auth/login")
    void testLoginCorsPreflight() throws Exception {
        String origin = "http://localhost:3000";

        mockMvc.perform(
                        options("/api/auth/login")
                                .header(HttpHeaders.ORIGIN, origin)
                                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type, Authorization")
                )
                .andExpect(status().isOk())
                // allowedOrigins("http://localhost:3000")
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin))
                // allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
                        containsString("POST")))
                // allowedHeaders("*")
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS,
                        containsString("Content-Type")));
    }
}
