package com.flogin.integration;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Login API Integration Tests")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    // ===================================================================
    // a) Test POST /api/auth/login endpoint 
    // ===================================================================
    
    @Test
    @DisplayName("Test POST /api/auth/login endpoint thanh cong")
    void testLoginEndpoint_Success() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("Test123");
        
        LoginResponse mockResponse = new LoginResponse(
            "Đăng nhập thành công!", 
            "mock-jwt-token"
        );
        
        when(authService.loginUser(any(LoginRequest.class)))
            .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công!"))
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));
    }

    // ===================================================================
    // b) Test response structure và status codes 
    // ===================================================================
    
    @Test
    @DisplayName("Test response structure va status code 200")
    void testLoginResponse_Structure() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("Test123");
        
        LoginResponse mockResponse = new LoginResponse(
            "Đăng nhập thành công!", 
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        );
        
        when(authService.loginUser(any(LoginRequest.class)))
            .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    // ===================================================================
    // c) Test CORS và headers 
    // ===================================================================
    
    @Test
    @DisplayName("Test CORS va content-type headers")
    void testLoginEndpoint_CorsAndHeaders() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("Test123");
        
        LoginResponse mockResponse = new LoginResponse(
            "Đăng nhập thành công!", 
            "mock-jwt-token"
        );
        
        when(authService.loginUser(any(LoginRequest.class)))
            .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.token").exists());
    }
}
