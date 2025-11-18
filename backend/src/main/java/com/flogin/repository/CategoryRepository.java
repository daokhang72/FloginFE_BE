package com.flogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flogin.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Thêm hàm này để kiểm tra trùng tên khi tạo mới
    boolean existsByName(String name); 
}