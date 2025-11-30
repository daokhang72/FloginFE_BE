package com.flogin;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.repository.CategoryRepository;
import com.flogin.service.ProductService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ProductServiceMockTest {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;
    @InjectMocks
    private ProductService productService;
    private ProductDto dto;
    private Product mockProduct;
    private Category category;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // MockCategory
        category = new Category();
        category.setId(1);
        category.setName("Electronics");

        // Product DTO
        dto = new ProductDto();
        dto.setName("Laptop");
        dto.setPrice(BigDecimal.valueOf(15000000));
        dto.setQuantity(5);
        dto.setDescription("Test laptop");
        dto.setCategoryId(1);
        dto.setImage("laptop.jpg");

        // MockProduct
        mockProduct = new Product();
        mockProduct.setId(1);
        mockProduct.setName(dto.getName());
        mockProduct.setPrice(dto.getPrice());
        mockProduct.setQuantity(dto.getQuantity());
        mockProduct.setDescription(dto.getDescription());
        mockProduct.setImage(dto.getImage());
        mockProduct.setCategory(category);
    }

    //  Create 
    @Test
    void testCreateProductSuccess() {
        when(productRepository.existsByName(dto.getName())).thenReturn(false);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        ProductDto saved = productService.createProduct(dto);

        assertNotNull(saved);
        assertEquals("Laptop", saved.getName());

        verify(productRepository).existsByName("Laptop");
        verify(categoryRepository).findById(1);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testCreateProductDuplicateName() {
        when(productRepository.existsByName(dto.getName())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.createProduct(dto);
        });

        assertTrue(exception.getMessage().contains("đã tồn tại"));
        verify(productRepository).existsByName("Laptop");
        verify(productRepository, never()).save(any(Product.class));
    }

    //  Read 
    @Test
    void testGetProductByIdSuccess() {
        when(productRepository.findById(1)).thenReturn(Optional.of(mockProduct));

        ProductDto result = productService.getProductById(1);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(1, result.getCategoryId());

        verify(productRepository).findById(1);
    }

    @Test
    void testGetProductByIdNotFound() {
        when(productRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(jakarta.persistence.EntityNotFoundException.class, () -> {
            productService.getProductById(1);
        });

        verify(productRepository).findById(1);
    }

    //  Update 
    @Test
    void testUpdateProductSuccess() {
        ProductDto updateDto = new ProductDto();
        updateDto.setName("Laptop Updated");
        updateDto.setPrice(BigDecimal.valueOf(16000000));
        updateDto.setQuantity(10);
        updateDto.setDescription("Updated laptop");
        updateDto.setCategoryId(1);
        updateDto.setImage("laptop-updated.jpg");

        when(productRepository.findById(1)).thenReturn(Optional.of(mockProduct));
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(productRepository.existsByNameAndIdNot("Laptop Updated", 1)).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        ProductDto updated = productService.updateProduct(1, updateDto);

        assertNotNull(updated);
        assertEquals("Laptop Updated", updated.getName());

        verify(productRepository).findById(1);
        verify(productRepository).existsByNameAndIdNot("Laptop Updated", 1);
        verify(categoryRepository).findById(1);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testUpdateProductNotFound() {
        when(productRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(jakarta.persistence.EntityNotFoundException.class, () -> {
            productService.updateProduct(1, dto);
        });

        verify(productRepository).findById(1);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testUpdateProductDuplicateName() {
        when(productRepository.findById(1)).thenReturn(Optional.of(mockProduct));
        when(productRepository.existsByNameAndIdNot("Laptop", 1)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(1, dto);
        });

        assertTrue(exception.getMessage().contains("đã tồn tại"));
        verify(productRepository).findById(1);
        verify(productRepository).existsByNameAndIdNot("Laptop", 1);
        verify(productRepository, never()).save(any(Product.class));
    }

    //  Delete 
    @Test
    void testDeleteProductSuccess() {
        when(productRepository.findById(1)).thenReturn(Optional.of(mockProduct));
        doNothing().when(productRepository).delete(mockProduct);

        productService.deleteProduct(1);

        verify(productRepository).findById(1);
        verify(productRepository).delete(mockProduct);
    }

    @Test
    void testDeleteProductNotFound() {
        when(productRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(jakarta.persistence.EntityNotFoundException.class, () -> {
            productService.deleteProduct(1);
        });

        verify(productRepository).findById(1);
        verify(productRepository, never()).delete(any());
    }

    //  Get All 
    @Test
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(mockProduct));

        List<ProductDto> products = productService.getAllProducts();
        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Laptop", products.get(0).getName());

        verify(productRepository).findAll();
    }
}
