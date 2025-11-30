package com.flogin.controller;

import com.flogin.controller.AuthController;
import com.flogin.dto.LoginResponse;
import com.flogin.security.JwtTokenProvider;
import com.flogin.service.AuthService;
import com.flogin.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private AuthenticationManager authenticationManager;
    @MockBean
    private AppUserRepository appUserRepository;
    @MockBean
    private JwtTokenProvider tokenProvider;
    @MockBean
    private com.flogin.service.CustomUserDetailsService customUserDetailsService;
    @MockBean
    private com.flogin.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    // Login
    @Test
    void login_success() throws Exception {
        LoginResponse loginResponse = new LoginResponse("Đăng nhập thành công!", "fake-token");
        when(authService.loginUser(org.mockito.ArgumentMatchers.any())).thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"user01\",\"password\":\"User12345\"}"))
               .andExpect(status().isOk())
               .andExpect(content().json("{\"message\":\"Đăng nhập thành công!\",\"token\":\"fake-token\"}"));
    }


    // Register
    @Test
    void register_success() throws Exception {
        when(authService.registerUser(org.mockito.ArgumentMatchers.any())).thenReturn("Đăng ký user thành công!");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"newuser01\",\"password\":\"Newuser123\",\"email\":\"user111@example.com\"}"))
               .andExpect(status().isOk())
               .andExpect(content().string("Đăng ký user thành công!"));
    }
}
