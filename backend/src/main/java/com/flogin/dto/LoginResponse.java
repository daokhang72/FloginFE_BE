package com.flogin.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String message;
    private String token;
    private String tokenType = "Bearer";

    public LoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }
}