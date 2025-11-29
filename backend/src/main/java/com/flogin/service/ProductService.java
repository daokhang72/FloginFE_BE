package com.flogin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả sản phẩm với cache
    @Cacheable(value = "products", key = "'all'")
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAllWithCategory().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    // Lấy 1 sản phẩm theo ID với cache
    @Cacheable(value = "products", key = "#id")
    @Transactional(readOnly = true)
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return mapToDto(product);
    }

    // Tạo sản phẩm mới và clear cache
    @CacheEvict(value = "products", allEntries = true)
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        // 1. Kiểm tra trùng tên
        if (productRepository.existsByName(productDto.getName())) {
            throw new RuntimeException("Lỗi: Tên sản phẩm '" + productDto.getName() + "' đã tồn tại!");
        }

        Product product = mapToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    // Cập nhật sản phẩm và clear cache
    @CacheEvict(value = "products", allEntries = true)
    @Transactional
    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        // 1. Kiểm tra sản phẩm tồn tại
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // 1. Kiểm tra trùng tên
        if (productRepository.existsByNameAndIdNot(productDto.getName(), id)) {
            throw new RuntimeException("Lỗi: Tên sản phẩm '" + productDto.getName() + "' đã tồn tại!");
        }
        
        // 2. Cập nhật thông tin
        existingProduct.setName(productDto.getName());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setPrice(productDto.getPrice());
        existingProduct.setQuantity(productDto.getQuantity());
        
        // --- CẬP NHẬT ẢNH ---
        if (productDto.getImage() != null) {
            existingProduct.setImage(productDto.getImage());
        }
        // --------------------

        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục"));
        existingProduct.setCategory(category);
        
        Product updatedProduct = productRepository.save(existingProduct);
        return mapToDto(updatedProduct);
    }
    
    // Xóa sản phẩm và clear cache
    @CacheEvict(value = "products", allEntries = true)
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        productRepository.delete(product);
    }

    // --- Helper Methods (QUAN TRỌNG: Cập nhật mapping ở đây) ---

    // Chuyển Entity (CSDL) -> DTO (API)
    private ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        
        // --- MAP ẢNH ---
        dto.setImage(product.getImage()); 
        // ----------------
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        return dto;
    }

    // Chuyển DTO (API) -> Entity (CSDL)
    private Product mapToEntity(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        
        // --- MAP ẢNH ---
        product.setImage(dto.getImage());
        // ----------------

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + dto.getCategoryId()));
        product.setCategory(category);
        
        return product;
    }
}