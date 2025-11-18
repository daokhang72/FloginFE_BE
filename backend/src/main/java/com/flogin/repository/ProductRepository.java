package com.flogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flogin.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // 1. Kiểm tra trùng tên khi Thêm mới (Create)
    boolean existsByName(String name);

    // 2. Kiểm tra trùng tên khi Cập nhật (Update)
    // (Tên trùng, nhưng ID phải KHÁC ID hiện tại)
    boolean existsByNameAndIdNot(String name, Integer id);
}