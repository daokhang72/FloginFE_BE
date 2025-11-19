package com.flogin.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @NotNull(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    private String username;

    @NotNull(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 100, message = "Password phải từ 6-100 ký tự")
    private String password;
    
    // Lưu ý: Validation "phải có cả chữ và số" [cite: 88]
    // nên được xử lý ở logic nghiệp vụ (AuthService) 
    // hoặc một custom validator, ở đây ta dùng @Size
}