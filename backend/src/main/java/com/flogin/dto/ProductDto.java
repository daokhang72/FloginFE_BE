package com.flogin.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductDto {
    private Integer id;

    @NotNull(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3-100 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    private String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMax(value = "999999999.99", message = "Giá sản phẩm quá lớn")
    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được nhỏ hơn 0")
    @Max(value = 99999, message = "Số lượng quá lớn (tối đa 99,999)")
    private Integer quantity;

    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId; // Chúng ta sẽ dùng ID để tạo/cập nhật
    
    private String categoryName; // Dùng để hiển thị khi đọc
    private String image; // Lưu tên file ảnh
}