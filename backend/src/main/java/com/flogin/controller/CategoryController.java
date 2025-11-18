package com.flogin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.entity.Category;
import com.flogin.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // API: GET /api/categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        // Lấy toàn bộ danh mục từ Database trả về cho Frontend
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        // Kiểm tra logic trùng tên
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Lỗi: Danh mục '" + category.getName() + "' đã tồn tại.");
        }
        
        Category savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
}