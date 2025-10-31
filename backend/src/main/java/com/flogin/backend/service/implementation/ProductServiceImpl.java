package com.flogin.backend.service.implementation;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flogin.backend.dto.ProductDTO;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.ProductService;

@Service
public class ProductServiceImpl  implements ProductService{
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
    @Override
    public Product addProduct(ProductDTO productDTO){
        Product p = new Product();
        p.setName(productDTO.getName());
        p.setPrice(productDTO.getPrice());
        p.setQuantity(productDTO.getQuantity());
        p.setCategory(productDTO.getCategory());
        p.setDescription(productDTO.getDescription());
        return productRepository.save(p);
    }
    @Override
    public void deleteProduct(Long id){
        if(!productRepository.existsById(id)){
            throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepository.deleteById(id);
    }
    @Override
    public Product updateProduct(Long id, ProductDTO productDTO){
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        existingProduct.setName(productDTO.getName());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setCategory(productDTO.getCategory());
        existingProduct.setDescription(productDTO.getDescription());
        return productRepository.save(existingProduct);
    }
}
