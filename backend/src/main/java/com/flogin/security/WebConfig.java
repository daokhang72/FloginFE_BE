package com.flogin.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Chỉ cho phép các API dưới /api/
            .allowedOrigins("http://localhost:3000") // Cho phép React App gọi
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Lấy đường dẫn gốc của dự án (Ví dụ: C:\DoAn\FloginFE_BE\backend)
        String dirName = System.getProperty("user.dir");
        
        // 2. Tạo đường dẫn chuẩn cho Windows (Thêm "file:///" ở đầu)
        // Ví dụ kết quả: file:///C:/DoAn/FloginFE_BE/backend/uploads/
        String uploadPath = "file:///" + dirName.replace("\\", "/") + "/uploads/";

        // 3. Đăng ký đường dẫn
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}