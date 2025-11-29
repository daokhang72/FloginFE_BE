package com.flogin.dto;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class LoginRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("DTO Validation: Username rong se bao loi")
    void testUsernameBlank() {
        LoginRequest request = new LoginRequest();
        request.setUsername(""); // Rỗng
        request.setPassword("ValidPass123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "Phải có lỗi khi username rỗng");
    }

    @Test
    @DisplayName("DTO Validation: Password qua ngan se bao loi")
    void testPasswordShort() {
        LoginRequest request = new LoginRequest();
        request.setUsername("validUser");
        request.setPassword("123"); // Quá ngắn

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "Phải có lỗi khi password quá ngắn");
    }
    
    @Test
    @DisplayName("DTO Validation: Hop le")
    void testValidRequest() {
        LoginRequest request = new LoginRequest();
        request.setUsername("validUser");
        request.setPassword("ValidPass123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Không được có lỗi khi data hợp lệ");
    }
}