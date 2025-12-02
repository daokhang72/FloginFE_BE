package com.flogin.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.ProductDto;
import com.flogin.security.JwtTokenProvider;
import com.flogin.service.CustomUserDetailsService;
import com.flogin.service.ProductService;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // mock cac bean phu thuoc
    @MockBean
    private ProductService productService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private ProductDto sampleProduct;
    private ProductDto updatedProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new ProductDto();
        sampleProduct.setId(1);
        sampleProduct.setName("Laptop Dell");
        sampleProduct.setDescription("Demo product");
        sampleProduct.setPrice(new BigDecimal("15000000"));
        sampleProduct.setQuantity(10);
        sampleProduct.setCategoryId(1);
        sampleProduct.setCategoryName("Laptop");
        sampleProduct.setImage("test.jpg");

        updatedProduct = new ProductDto();
        updatedProduct.setId(1);
        updatedProduct.setName("Laptop Dell Updated");
        updatedProduct.setDescription("Updated product");
        updatedProduct.setPrice(new BigDecimal("15500000"));
        updatedProduct.setQuantity(8);
        updatedProduct.setCategoryId(1);
        updatedProduct.setCategoryName("Laptop");
        updatedProduct.setImage("test-updated.jpg");
    }

    // a) Test POST /api/products (Create)
    @Test
    @DisplayName("TC_PROD_BE_A1 - POST /api/products - create product success")
    void createProduct_success() throws Exception {
        given(productService.createProduct(any(ProductDto.class)))
                .willReturn(sampleProduct);

        MockMultipartFile imageFile = new MockMultipartFile(
                "imageFile",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake-image-content".getBytes(StandardCharsets.UTF_8)
        );

        mockMvc.perform(
                        multipart("/api/products")
                                .file(imageFile)
                                .param("name", "Laptop Dell")
                                .param("description", "Demo product")
                                .param("price", "15000000")
                                .param("quantity", "10")
                                .param("categoryId", "1")
                                .contentType(MediaType.MULTIPART_FORM_DATA)
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop Dell"));
    }

    // b) Test GET /api/products (Read all)
    @Test
    @DisplayName("TC_PROD_BE_B1 - GET /api/products - read all products")
    void getAllProducts_success() throws Exception {
        given(productService.getAllProducts())
                .willReturn(List.of(sampleProduct));

        mockMvc.perform(
                        get("/api/products")
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Laptop Dell"));
    }

    // c) Test GET /api/products/{id} (Read one)
    @Test
    @DisplayName("TC_PROD_BE_C1 - GET /api/products/{id} - read one product")
    void getProductById_success() throws Exception {
        given(productService.getProductById(1))
                .willReturn(sampleProduct);

        mockMvc.perform(
                        get("/api/products/{id}", 1)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop Dell"));
    }

    // d) Test PUT /api/products/{id} (Update)
    @Test
    @DisplayName("TC_PROD_BE_D1 - PUT /api/products/{id} - update product")
    void updateProduct_success() throws Exception {
        given(productService.updateProduct(eq(1), any(ProductDto.class)))
                .willReturn(updatedProduct);

        MockMultipartFile imageFile = new MockMultipartFile(
                "imageFile",
                "test-updated.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "updated-image".getBytes(StandardCharsets.UTF_8)
        );

        mockMvc.perform(
                        multipart("/api/products/{id}", 1)
                                .file(imageFile)
                                .param("name", "Laptop Dell Updated")
                                .param("description", "Updated product")
                                .param("price", "15500000")
                                .param("quantity", "8")
                                .param("categoryId", "1")
                                .contentType(MediaType.MULTIPART_FORM_DATA)
                                // multipart mac dinh la POST, can override thanh PUT
                                .with(request -> {
                                    request.setMethod("PUT");
                                    return request;
                                })
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop Dell Updated"));
    }

    // e) Test DELETE /api/products/{id} (Delete)
    @Test
    @DisplayName("TC_PROD_BE_E1 - DELETE /api/products/{id} - delete product")
    void deleteProduct_success() throws Exception {
        doNothing().when(productService).deleteProduct(ArgumentMatchers.eq(1));

        mockMvc.perform(
                        delete("/api/products/{id}", 1)
                )
                .andExpect(status().isOk());

        // verify service duoc goi
        verify(productService).deleteProduct(1);
    }
}
