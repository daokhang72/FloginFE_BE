package com.flogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Đây là file Main của ứng dụng Spring Boot.
 * Annotation @SpringBootApplication sẽ tự động cấu hình mọi thứ.
 */
@SpringBootApplication
public class BackendApplication {

    /**
     * Đây là điểm khởi đầu (entry point) của ứng dụng backend.
     * Khi bạn nhấn "Run", phương thức 'main' này sẽ được gọi.
     * @param args
     */
    public static void main(String[] args) {
        // Lệnh này sẽ khởi động toàn bộ máy chủ Spring
        SpringApplication.run(BackendApplication.class, args);
    }

}