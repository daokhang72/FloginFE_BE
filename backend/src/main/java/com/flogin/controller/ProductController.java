package com.flogin.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Định nghĩa thư mục lưu ảnh (Nằm ngay thư mục gốc dự án)
    public static String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/uploads";


    // 1. API Tạo Sản phẩm (Create) - CÓ LOG DEBUG
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(
            @ModelAttribute ProductDto productDto,
            @RequestParam(value = "imageFile", required = false) MultipartFile file) throws IOException {
        
        // --- LOG DEBUG ---
        System.out.println("=== DEBUG CREATE PRODUCT ===");
        System.out.println("Ten SP: " + productDto.getName());
        if (file == null) {
            System.out.println("LOI: File nhan duoc la NULL");
        } else {
            System.out.println("File nhan duoc: " + file.getOriginalFilename());
            System.out.println("Kich thuoc file: " + file.getSize());
            System.out.println("Co rong khong?: " + file.isEmpty());
        }
        // -----------------

        // 1. Lưu file ảnh nếu có
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, fileName);
            
            if (!Files.exists(Paths.get(UPLOAD_DIRECTORY))) {
                Files.createDirectories(Paths.get(UPLOAD_DIRECTORY));
            }
            
            Files.write(fileNameAndPath, file.getBytes());
            productDto.setImage(fileName);
            System.out.println("Da luu file thanh cong: " + fileName);
        } else {
            System.out.println("Khong luu file vi file null hoac rong.");
        }

        ProductDto savedProduct = productService.createProduct(productDto);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // 2. API Lấy tất cả Sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    // 3. API Lấy 1 Sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Integer id) {
        ProductDto productDto = productService.getProductById(id);
        return ResponseEntity.ok(productDto);
    }

    // 4. API Cập nhật Sản phẩm - Có upload ảnh
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Integer id,
            @ModelAttribute ProductDto productDto,
            @RequestParam(value = "imageFile", required = false) MultipartFile file) throws IOException {
        
        // Logic lưu file (tương tự create)
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, fileName);
            
            if (!Files.exists(Paths.get(UPLOAD_DIRECTORY))) {
                Files.createDirectories(Paths.get(UPLOAD_DIRECTORY));
            }
            
            Files.write(fileNameAndPath, file.getBytes());
            productDto.setImage(fileName);
        } else {
            // Giữ nguyên ảnh cũ nếu không upload ảnh mới
            ProductDto existingProduct = productService.getProductById(id);
            productDto.setImage(existingProduct.getImage());
        }
        
        ProductDto updatedProduct = productService.updateProduct(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }

    // 5. API Xóa Sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Đã xóa thành công sản phẩm ID: " + id);
    }
}