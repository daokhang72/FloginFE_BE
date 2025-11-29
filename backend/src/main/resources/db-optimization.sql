-- ===================================
-- Script tối ưu Database cho Performance Testing
-- ===================================

-- 1. Thêm index cho trường name trong bảng products
-- Giúp tăng tốc query existsByName() và existsByNameAndIdNot()
ALTER TABLE products ADD INDEX idx_products_name (name);

-- 2. Thêm index cho category_id
-- Giúp tăng tốc JOIN query giữa products và categories
ALTER TABLE products ADD INDEX idx_products_category_id (category_id);

-- 3. Kiểm tra index hiện có
SHOW INDEX FROM products;
SHOW INDEX FROM categories;

-- ===================================
-- Lưu ý: 
-- - Nếu index đã tồn tại, sẽ báo lỗi "Duplicate key name" - BỎ QUA lỗi này
-- - Hoặc chạy từng câu lệnh một
-- ===================================
