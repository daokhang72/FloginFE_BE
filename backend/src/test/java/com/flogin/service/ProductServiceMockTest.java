package com.flogin.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

/**
 * Unit Tests cho ProductService sử dụng Mockito
 * Test các chức năng CRUD và business logic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Mock Tests")
public class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private Category testCategory;
    private ProductDto testProductDto;

    @BeforeEach
    void setUp() {
        // Setup test data
        testCategory = new Category();
        testCategory.setId(1);
        testCategory.setName("Electronics");
        testCategory.setDescription("Electronic items");

        testProduct = new Product();
        testProduct.setId(1);
        testProduct.setName("Laptop");
        testProduct.setDescription("Gaming laptop");
        testProduct.setPrice(BigDecimal.valueOf(1500.00));
        testProduct.setQuantity(10);
        testProduct.setCategory(testCategory);
        testProduct.setImage("laptop.jpg");

        testProductDto = new ProductDto();
        testProductDto.setId(1);
        testProductDto.setName("Laptop");
        testProductDto.setDescription("Gaming laptop");
        testProductDto.setPrice(BigDecimal.valueOf(1500.00));
        testProductDto.setQuantity(10);
        testProductDto.setCategoryId(1);
        testProductDto.setCategoryName("Electronics");
        testProductDto.setImage("laptop.jpg");
    }

    @Test
    @DisplayName("Test getAllProducts - Success")
    void testGetAllProducts() {
        // Arrange
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAllWithCategory()).thenReturn(products);

        // Act
        List<ProductDto> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());
        verify(productRepository, times(1)).findAllWithCategory();
    }

    @Test
    @DisplayName("Test getProductById - Success")
    void testGetProductByIdSuccess() {
        // Arrange
        when(productRepository.findByIdWithCategory(1)).thenReturn(Optional.of(testProduct));

        // Act
        ProductDto result = productService.getProductById(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Laptop", result.getName());
        assertEquals(BigDecimal.valueOf(1500.00), result.getPrice());
        verify(productRepository, times(1)).findByIdWithCategory(1);
    }

    @Test
    @DisplayName("Test getProductById - Not Found")
    void testGetProductByIdNotFound() {
        // Arrange
        when(productRepository.findByIdWithCategory(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> {
            productService.getProductById(1);
        });
        verify(productRepository, times(1)).findByIdWithCategory(1);
    }

    @Test
    @DisplayName("Test createProduct - Success")
    void testCreateProductSuccess() {
        // Arrange
        when(productRepository.existsByName("Laptop")).thenReturn(false);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        ProductDto result = productService.createProduct(testProductDto);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).existsByName("Laptop");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Test createProduct - Duplicate Name")
    void testCreateProductDuplicateName() {
        // Arrange
        when(productRepository.existsByName("Laptop")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            productService.createProduct(testProductDto);
        });
        verify(productRepository, times(1)).existsByName("Laptop");
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Test updateProduct - Success")
    void testUpdateProductSuccess() {
        // Arrange
        ProductDto updateDto = new ProductDto();
        updateDto.setName("Updated Laptop");
        updateDto.setDescription("Updated description");
        updateDto.setPrice(BigDecimal.valueOf(1600.00));
        updateDto.setQuantity(15);
        updateDto.setCategoryId(1);

        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(productRepository.existsByNameAndIdNot("Updated Laptop", 1)).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        ProductDto result = productService.updateProduct(1, updateDto);

        // Assert
        assertNotNull(result);
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Test updateProduct - Not Found")
    void testUpdateProductNotFound() {
        // Arrange
        when(productRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> {
            productService.updateProduct(1, testProductDto);
        });
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Test deleteProduct - Success")
    void testDeleteProductSuccess() {
        // Arrange
        when(productRepository.findById(1)).thenReturn(Optional.of(testProduct));
        doNothing().when(productRepository).delete(testProduct);

        // Act
        assertDoesNotThrow(() -> productService.deleteProduct(1));

        // Assert
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).delete(testProduct);
    }

    @Test
    @DisplayName("Test deleteProduct - Not Found")
    void testDeleteProductNotFound() {
        // Arrange
        when(productRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> {
            productService.deleteProduct(1);
        });
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, never()).delete(any(Product.class));
    }

}
