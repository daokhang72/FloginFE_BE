package com.flogin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.flogin.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // 1. Kiểm tra trùng tên khi Thêm mới (Create)
    boolean existsByName(String name);

    // 2. Kiểm tra trùng tên khi Cập nhật (Update)
    // (Tên trùng, nhưng ID phải KHÁC ID hiện tại)
    boolean existsByNameAndIdNot(String name, Integer id);
    
    // 3. Lấy tất cả products với category (JOIN FETCH để tránh N+1 query)
    @Query("SELECT p FROM Product p JOIN FETCH p.category")
    List<Product> findAllWithCategory();
    
    // 4. Lấy 1 product với category (JOIN FETCH)
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.id = :id")
    Optional<Product> findByIdWithCategory(@Param("id") Integer id);
}