package com.flogin.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    // 1. API Đọc Danh mục (GET)
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // 2. API Tạo Danh mục (POST)
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Lỗi: Danh mục '" + category.getName() + "' đã tồn tại.");
        }
        Category savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
    
    // 3. API Sửa (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Integer id, @RequestBody Category categoryDetails) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            throw new RuntimeException("Lỗi: Không tìm thấy danh mục với ID: " + id);
        }

        Category category = optionalCategory.get();
        
        // Kiểm tra tên trùng lặp (trừ tên của chính nó)
        if (categoryRepository.existsByName(categoryDetails.getName()) && 
            !category.getName().equals(categoryDetails.getName())) {
            throw new RuntimeException("Lỗi: Danh mục '" + categoryDetails.getName() + "' đã tồn tại.");
        }

        category.setName(categoryDetails.getName());
        
        // --- SỬA LỖI BẠN BÁO: Dùng Setter cho Description ---
        // Nếu description được gửi lên, cập nhật nó. (Nhờ Lombok @Data)
        if (categoryDetails.getDescription() != null) {
            category.setDescription(categoryDetails.getDescription());
        }
        // --- KẾT THÚC SỬA LỖI ---

        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    // 4. API Xóa (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Lỗi: Không tìm thấy danh mục với ID: " + id);
        }
        
        // [CẦN LƯU Ý: Vẫn cần xóa sản phẩm trước khi xóa danh mục để tránh lỗi Foreign Key]
        categoryRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa thành công danh mục ID: " + id);
    }
}