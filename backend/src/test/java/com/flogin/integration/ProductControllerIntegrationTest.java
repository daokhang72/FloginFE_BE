package com.flogin.integration;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Product API Integration Tests")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    // ===================================================================
    // a) Test POST /api/products (Create) 
    // ===================================================================
    
    @Test
    @DisplayName("Test POST /api/products - tao san pham moi")
    void testCreateProduct_Success() throws Exception {
        // Arrange
        ProductDto mockProduct = new ProductDto();
        mockProduct.setId(1);
        mockProduct.setName("Laptop Dell");
        mockProduct.setPrice(new BigDecimal("15000000.00"));
        mockProduct.setQuantity(10);
        mockProduct.setCategoryId(1);
        mockProduct.setImage("laptop.jpg");

        when(productService.createProduct(any(ProductDto.class)))
            .thenReturn(mockProduct);

        MockMultipartFile imageFile = new MockMultipartFile(
            "imageFile",
            "laptop.jpg",
            MediaType.IMAGE_JPEG_VALUE,
            "test image content".getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/products")
                .file(imageFile)
                .param("name", "Laptop Dell")
                .param("price", "15000000")
                .param("quantity", "10")
                .param("categoryId", "1"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Laptop Dell"))
                .andExpect(jsonPath("$.price").value(15000000.0));
    }

    // ===================================================================
    // b) Test GET /api/products (Read all) 
    // ===================================================================
    
    @Test
    @DisplayName("Test GET /api/products - lay tat ca san pham")
    void testGetAllProducts_Success() throws Exception {
        // Arrange
        ProductDto product1 = new ProductDto();
        product1.setId(1);
        product1.setName("Laptop Dell");
        product1.setPrice(new BigDecimal("15000000.00"));
        product1.setQuantity(10);
        product1.setCategoryId(1);

        ProductDto product2 = new ProductDto();
        product2.setId(2);
        product2.setName("iPhone 15");
        product2.setPrice(new BigDecimal("25000000.00"));
        product2.setQuantity(5);
        product2.setCategoryId(2);

        List<ProductDto> mockProducts = Arrays.asList(product1, product2);
        when(productService.getAllProducts()).thenReturn(mockProducts);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Laptop Dell"))
                .andExpect(jsonPath("$[1].name").value("iPhone 15"));
    }

    // ===================================================================
    // c) Test GET /api/products/{id} (Read one) 
    // ===================================================================
    
    @Test
    @DisplayName("Test GET /api/products/{id} - lay mot san pham")
    void testGetProductById_Success() throws Exception {
        // Arrange
        Integer productId = 1;
        ProductDto mockProduct = new ProductDto();
        mockProduct.setId(productId);
        mockProduct.setName("Laptop Dell");
        mockProduct.setPrice(new BigDecimal("15000000.00"));
        mockProduct.setQuantity(10);
        mockProduct.setCategoryId(1);

        when(productService.getProductById(productId)).thenReturn(mockProduct);

        // Act & Assert
        mockMvc.perform(get("/api/products/{id}", productId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop Dell"))
                .andExpect(jsonPath("$.price").value(15000000.0));
    }

    // ===================================================================
    // d) Test PUT /api/products/{id} (Update) 
    // ===================================================================
    
    @Test
    @DisplayName("Test PUT /api/products/{id} - cap nhat san pham")
    void testUpdateProduct_Success() throws Exception {
        // Arrange
        Integer productId = 1;
        
        // Mock existing product (for getting old image)
        ProductDto existingProduct = new ProductDto();
        existingProduct.setId(productId);
        existingProduct.setImage("old-image.jpg");
        when(productService.getProductById(productId)).thenReturn(existingProduct);
        
        ProductDto updatedProduct = new ProductDto();
        updatedProduct.setId(productId);
        updatedProduct.setName("Laptop Dell Updated");
        updatedProduct.setPrice(new BigDecimal("16000000.00"));
        updatedProduct.setQuantity(15);
        updatedProduct.setCategoryId(1);

        when(productService.updateProduct(any(Integer.class), any(ProductDto.class)))
            .thenReturn(updatedProduct);

        // Act & Assert
        mockMvc.perform(multipart("/api/products/{id}", productId)
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .param("name", "Laptop Dell Updated")
                .param("price", "16000000")
                .param("quantity", "15")
                .param("categoryId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop Dell Updated"))
                .andExpect(jsonPath("$.price").value(16000000.0));
    }

    // ===================================================================
    // e) Test DELETE /api/products/{id} (Delete)
    // ===================================================================
    
    @Test
    @DisplayName("Test DELETE /api/products/{id} - xoa san pham")
    void testDeleteProduct_Success() throws Exception {
        // Arrange
        Integer productId = 1;
        doNothing().when(productService).deleteProduct(productId);

        // Act & Assert
        mockMvc.perform(delete("/api/products/{id}", productId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Đã xóa thành công")));
    }
}
