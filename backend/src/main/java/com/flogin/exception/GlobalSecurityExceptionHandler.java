package com.flogin.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global Exception Handler for Security and Validation
 * Ensures that error messages don't leak sensitive information
 */
@RestControllerAdvice
public class GlobalSecurityExceptionHandler {

    /**
     * Handle authentication failures
     * Generic message to prevent user enumeration
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        ErrorResponse error = new ErrorResponse(
            "Invalid credentials",
            HttpStatus.UNAUTHORIZED.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handle bad credentials (wrong password)
     * Don't reveal if username exists or not
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponse error = new ErrorResponse(
            "Invalid username or password",
            HttpStatus.UNAUTHORIZED.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handle validation errors
     * Return field-specific errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ValidationErrorResponse response = new ValidationErrorResponse(
            "Validation failed",
            HttpStatus.BAD_REQUEST.value(),
            LocalDateTime.now(),
            errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle generic exceptions
     * Don't expose stack traces in production
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        // Log the full exception server-side
        System.err.println("Server error: " + ex.getMessage());
        ex.printStackTrace();

        // Return generic message to client
        ErrorResponse error = new ErrorResponse(
            "An error occurred. Please try again later.",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Standard error response
     */
    public static class ErrorResponse {
        private String message;
        private int status;
        private LocalDateTime timestamp;

        public ErrorResponse(String message, int status, LocalDateTime timestamp) {
            this.message = message;
            this.status = status;
            this.timestamp = timestamp;
        }

        // Getters
        public String getMessage() { return message; }
        public int getStatus() { return status; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }

    /**
     * Validation error response with field details
     */
    public static class ValidationErrorResponse extends ErrorResponse {
        private Map<String, String> fieldErrors;

        public ValidationErrorResponse(String message, int status, LocalDateTime timestamp, 
                                       Map<String, String> fieldErrors) {
            super(message, status, timestamp);
            this.fieldErrors = fieldErrors;
        }

        public Map<String, String> getFieldErrors() { return fieldErrors; }
    }
}
