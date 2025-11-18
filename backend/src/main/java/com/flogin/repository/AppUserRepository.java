package com.flogin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flogin.entity.AppUser;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    
    // Tìm user bằng username
    Optional<AppUser> findByUsername(String username);

    // Kiểm tra username đã tồn tại chưa (dùng cho đăng ký)
    Boolean existsByUsername(String username);
}