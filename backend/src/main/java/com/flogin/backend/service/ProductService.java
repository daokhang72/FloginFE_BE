package com.flogin.backend.service;

import java.util.ArrayList;
import java.util.List;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;

public interface ProductService {
    List<Product> getAllProducts();
    Product addProduct(ProductDTO productDTO);
    void deleteProduct(Long id);
    Product updateProduct(Long id, ProductDTO productDTO);
}
