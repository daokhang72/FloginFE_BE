package com.flogin.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

/**
 * Enhanced Security Configuration with Security Headers
 * 
 * Adds additional security headers to protect against common web vulnerabilities
 */
@Configuration
public class SecurityHeadersConfig {

    /**
     * Configure security headers
     * This should be integrated into the main SecurityConfig
     */
    public void configureSecurityHeaders(HttpSecurity http) throws Exception {
        http.headers(headers -> headers
            // Prevent MIME-sniffing
            .contentTypeOptions(contentType -> contentType.disable())
            
            // XSS Protection
            .xssProtection(xss -> xss
                .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
            
            // Clickjacking protection
            .frameOptions(frame -> frame.deny())
            
            // HTTPS Strict Transport Security (for production)
            .httpStrictTransportSecurity(hsts -> hsts
                .includeSubDomains(true)
                .maxAgeInSeconds(31536000)) // 1 year
            
            // Content Security Policy
            .contentSecurityPolicy(csp -> csp
                .policyDirectives("default-src 'self'; " +
                                 "script-src 'self'; " +
                                 "style-src 'self' 'unsafe-inline'; " +
                                 "img-src 'self' data:; " +
                                 "font-src 'self'; " +
                                 "connect-src 'self'; " +
                                 "frame-ancestors 'none';"))
        );
    }
}
