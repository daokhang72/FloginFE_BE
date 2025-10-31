package com.flogin.backend;

import org.springframework.boot.CommandLineRunner; // 1. Import
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // 2. Import

import com.flogin.backend.entity.User; // 3. Import
import com.flogin.backend.repository.UserRepository; // 4. Import

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword("password123"); 
                
                userRepository.save(adminUser);
                System.out.println(">>> Đã tạo user 'admin' với pass 'khangdao123' <<<");
            }
        };
    }
}