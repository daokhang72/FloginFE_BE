package com.flogin.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder; // Cần thêm

import com.flogin.dto.LoginRequest;
import com.flogin.dto.RegisterRequest; // Cần thêm
import com.flogin.entity.AppUser; // Cần thêm
import com.flogin.repository.AppUserRepository;
import com.flogin.security.JwtTokenProvider; // Cần thêm

@DisplayName("Login Service Unit Tests")
class AuthServiceTest {
    
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private AppUserRepository appUserRepository; // Mock thêm Repository
    @Mock
    private PasswordEncoder passwordEncoder;     // Mock thêm Encoder
    
    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); 
    }

    // TC1: Login thành công
    @Test
    @DisplayName("TC1: Login thanh cong voi credentials hop le")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("Test123");
        
        when(authenticationManager.authenticate(any())).thenReturn(mock(org.springframework.security.core.Authentication.class));
        when(jwtTokenProvider.generateToken(any())).thenReturn("mock-jwt-token");
        
        String token = authService.loginUser(request).getToken();
        
        assertNotNull(token);
        assertEquals("mock-jwt-token", token);
        
        verify(authenticationManager, times(1)).authenticate(any());
        verify(jwtTokenProvider, times(1)).generateToken(any());
    }

    // TC2: Login thất bại
    @Test
    @DisplayName("TC2: Login that bai do sai thong tin")
    void testLoginFailure() {
        LoginRequest request = new LoginRequest();
        request.setUsername("wronguser");
        request.setPassword("wrongpassword");
        
        when(authenticationManager.authenticate(any())).thenThrow(mock(AuthenticationException.class));
        
        assertThrows(AuthenticationException.class, () -> {
            authService.loginUser(request);
        });
        
        verify(jwtTokenProvider, never()).generateToken(any());
    }

    // --- CÁC TEST CASE BỔ SUNG CHO REGISTER ---

    // TC3: Đăng ký thành công
    @Test
    @DisplayName("TC3: Dang ky thanh cong")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("Password123");
        request.setEmail("new@test.com");

        // Giả lập username chưa tồn tại
        when(appUserRepository.existsByUsername("newuser")).thenReturn(false);
        // Giả lập mã hóa mật khẩu
        when(passwordEncoder.encode("Password123")).thenReturn("encodedPass");

        String result = authService.registerUser(request);

        assertEquals("Đăng ký user thành công!", result);
        // Kiểm tra repository đã lưu user mới chưa
        verify(appUserRepository, times(1)).save(any(AppUser.class));
    }

    // TC4: Đăng ký thất bại do trùng tên
    @Test
    @DisplayName("TC4: Dang ky that bai do username da ton tai")
    void testRegisterFailureDuplicate() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existingUser");

        // Giả lập username ĐÃ tồn tại
        when(appUserRepository.existsByUsername("existingUser")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            authService.registerUser(request);
        }, "Lỗi: Username đã được sử dụng!");

        // Kiểm tra repository KHÔNG được gọi lưu
        verify(appUserRepository, never()).save(any());
    }
}