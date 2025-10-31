package com.flogin.backend.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private String name;
    private double price;
    private int quantity;
    private String category;
    private String description; 
}
