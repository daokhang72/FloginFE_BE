package com.flogin.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals; // Import Exception
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

@DisplayName("Product Service Unit Tests")
class ProductServiceTest {
    
    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;
    
    @InjectMocks
    private ProductService productService;

    private ProductDto productDto;
    private Product product;
    private Category category;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        
        category = new Category();
        category.setId(1);
        category.setName("Electronics");
        
        productDto = new ProductDto();
        productDto.setName("Laptop Dell");
        productDto.setPrice(new BigDecimal("15000000.00"));
        productDto.setQuantity(10);
        productDto.setCategoryId(1);
        
        product = new Product();
        product.setId(1);
        product.setName("Laptop Dell");
        product.setPrice(new BigDecimal("15000000.00"));
        product.setQuantity(10);
        product.setCategory(category);
        
        when(categoryRepository.findById(any(Integer.class))).thenReturn(Optional.of(category));
    }

    // TC1: Create Success
    @Test
    @DisplayName("TC1: Tao san pham moi thanh cong")
    void testCreateProduct() {
        when(productRepository.existsByName(anyString())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product); 

        ProductDto result = productService.createProduct(productDto);
        
        assertNotNull(result);
        assertEquals("Laptop Dell", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    // TC2: Update Success
    @Test
    @DisplayName("TC2: Cap nhat san pham thanh cong")
    void testUpdateProduct() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.existsByNameAndIdNot(anyString(), anyInt())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto result = productService.updateProduct(1, productDto);
        
        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    // TC3: Delete Success
    @Test
    @DisplayName("TC3: Xoa san pham thanh cong")
    void testDeleteProduct() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        assertDoesNotThrow(() -> productService.deleteProduct(1));
        verify(productRepository, times(1)).delete(any(Product.class));
    }

    // TC4: Create Fail Duplicate Name
    @Test
    @DisplayName("TC4: Tao san pham that bai do trung ten")
    void testCreateProductFailureDuplicateName() {
        when(productRepository.existsByName(anyString())).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> {
            productService.createProduct(productDto);
        });
        verify(productRepository, never()).save(any());
    }

    // --- CÁC TEST CASE BỔ SUNG ---

    // TC5: Get All Products
    @Test
    @DisplayName("TC5: Lay danh sach san pham")
    void testGetAllProducts() {
        // Giả lập trả về list chứa 1 sản phẩm
        when(productRepository.findAllWithCategory()).thenReturn(Arrays.asList(product));

        List<ProductDto> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop Dell", result.get(0).getName());
        verify(productRepository, times(1)).findAllWithCategory();
    }

    // TC6: Get By ID Success
    @Test
    @DisplayName("TC6: Lay san pham theo ID thanh cong")
    void testGetProductById() {
        when(productRepository.findByIdWithCategory(1)).thenReturn(Optional.of(product));

        ProductDto result = productService.getProductById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(productRepository, times(1)).findByIdWithCategory(1);
    }

    // TC7: Get By ID Not Found
    @Test
    @DisplayName("TC7: Lay san pham that bai do khong ton tai")
    void testGetProductByIdNotFound() {
        when(productRepository.findByIdWithCategory(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            productService.getProductById(99);
        });
    }

    // TC8: Delete Not Found
    @Test
    @DisplayName("TC8: Xoa san pham that bai do khong ton tai")
    void testDeleteProductNotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            productService.deleteProduct(99);
        });
        // Đảm bảo hàm delete không bao giờ được gọi
        verify(productRepository, never()).delete(any());
    }

    // TC9: Update thất bại do ID không tồn tại
    @Test
    @DisplayName("TC9: Update that bai do ID khong ton tai")
    void testUpdateProductNotFound() {
        // Giả lập tìm không thấy ID
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            productService.updateProduct(99, productDto);
        });
        
        verify(productRepository, never()).save(any());
    }

    // TC10: Update thất bại do trùng tên (Duplicate Name)
    @Test
    @DisplayName("TC10: Update that bai do trung ten voi san pham khac")
    void testUpdateProductDuplicateName() {
        // Tìm thấy sản phẩm cũ
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        // NHƯNG tên mới bị trùng với sản phẩm khác
        when(productRepository.existsByNameAndIdNot(anyString(), anyInt())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(1, productDto);
        });
        
        verify(productRepository, never()).save(any());
    }

    // TC11: Update thành công CÓ cập nhật ảnh (Image != null)
    @Test
    @DisplayName("TC11: Update thanh cong kem theo hinh anh")
    void testUpdateProductWithImage() {
        // Set ảnh cho DTO
        productDto.setImage("new-image.jpg");
        
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.existsByNameAndIdNot(anyString(), anyInt())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto result = productService.updateProduct(1, productDto);
        
        assertNotNull(result);
        // Kiểm tra xem logic set ảnh có được gọi không (Dù mock trả về object cũ, nhưng logic đã chạy qua)
        verify(productRepository, times(1)).save(any(Product.class));
    }
}

