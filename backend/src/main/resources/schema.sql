-- -----------------------------------------------------
-- Tạo Schema (Cơ sở dữ liệu)
-- Bạn có thể đổi 'flogin_project_db' thành tên bạn muốn
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `flogin_project_db` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `flogin_project_db`;

-- -----------------------------------------------------
-- Bảng 1: `users`
-- Lưu trữ thông tin tài khoản người dùng để đăng nhập.
-- Cấu trúc dựa trên các validation rules cho Login.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flogin_project_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT 'Từ 3-50 ký tự, theo yêu cầu ',
  `password` VARCHAR(255) NOT NULL COMMENT 'Nên lưu mật khẩu đã được băm (hashed), không lưu mật khẩu gốc',
  `email` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
COMMENT = 'Bảng lưu trữ thông tin người dùng để đăng nhập';


-- -----------------------------------------------------
-- Bảng 2: `categories`
-- Lưu trữ các danh mục sản phẩm.
-- Cần thiết vì yêu cầu "Category: Phải thuộc danh sách categories có sẵn".
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flogin_project_db`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên danh mục, ví dụ: Electronics',
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
COMMENT = 'Bảng lưu trữ danh mục cho sản phẩm';


-- -----------------------------------------------------
-- Bảng 3: `products`
-- Lưu trữ thông tin chi tiết của sản phẩm.
-- Cấu trúc dựa trên các validation rules cho Product.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `flogin_project_db`.`products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT 'Từ 3-100 ký tự, không rỗng ',
  `description` VARCHAR(500) NULL COMMENT 'Tối đa 500 ký tự ',
  `price` DECIMAL(12, 2) NOT NULL COMMENT 'Giá <= 999,999,999.00 [cite: 114, 115]',
  `quantity` INT NOT NULL DEFAULT 0 COMMENT 'Số lượng >= 0, <= 99,999 ',
  `category_id` INT NOT NULL COMMENT 'Khóa ngoại liên kết đến bảng categories ',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_products_categories_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `fk_products_categories`
    FOREIGN KEY (`category_id`)
    REFERENCES `flogin_project_db`.`categories` (`id`)
    ON DELETE RESTRICT -- Ngăn xóa danh mục nếu vẫn còn sản phẩm
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = 'Bảng lưu trữ thông tin các sản phẩm';

-- -----------------------------------------------------
-- Thêm cột image vào bảng products (nếu chưa có)
-- -----------------------------------------------------
ALTER TABLE products ADD COLUMN image VARCHAR(255) NULL;

-- -----------------------------------------------------
-- Thêm dữ liệu mẫu cho categories và products
-- -----------------------------------------------------
INSERT INTO categories (id, name, description) VALUES 
(1, 'Electronics', 'Thiết bị điện tử'),
(2, 'Books', 'Sách và văn phòng phẩm'),
(3, 'Clothing', 'Thời trang nam nữ'),
(4, 'Home & Garden', 'Nhà cửa đời sống');

-- C. Products (Dữ liệu phong phú)
INSERT INTO products (name, price, quantity, description, category_id, image) VALUES 
-- Electronics
('MacBook Pro M3', 45000000, 15, 'Laptop hiệu năng cao cho lập trình viên.', 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=500&q=60'),
('Sony Alpha A7III', 38500000, 5, 'Máy ảnh Mirrorless Full-frame chuyên nghiệp.', 1, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60'),
('Tai nghe Sony WH-1000XM5', 8500000, 20, 'Tai nghe chống ồn chủ động tốt nhất.', 1, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=60'),
('Apple Watch Series 9', 10900000, 30, 'Đồng hồ thông minh hỗ trợ sức khỏe.', 1, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=60'),
('Gaming Mouse Logitech', 1200000, 50, 'Chuột chơi game độ trễ thấp.', 1, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=60'),

-- Clothing
('Áo Khoác Denim Vintage', 850000, 25, 'Áo khoác bò phong cách cổ điển.', 3, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&q=60'),
('Giày Sneaker Nike Air', 3200000, 12, 'Giày thể thao năng động.', 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60'),
('Kính Mát RayBan', 4500000, 18, 'Kính mát thời trang chống tia UV.', 3, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=60'),
('Túi Xách Da Cao Cấp', 15000000, 8, 'Túi da thật thủ công.', 3, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=60'),

-- Books
('Clean Code', 450000, 100, 'Sách gối đầu giường cho lập trình viên.', 2, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=60'),
('Atomic Habits', 300000, 80, 'Xây dựng thói quen tốt.', 2, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=60'),
('Harry Potter Boxset', 2500000, 10, 'Trọn bộ 7 tập Harry Potter.', 2, 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&w=500&q=60'),

-- Home
('Đèn Bàn Minimalist', 650000, 40, 'Đèn bàn học chống cận.', 4, 'https://images.unsplash.com/photo-1507473888900-52e1adad5481?auto=format&fit=crop&w=500&q=60'),
('Cây Xương Rồng Decor', 150000, 60, 'Cây cảnh để bàn.', 4, 'https://images.unsplash.com/photo-1459416417445-b3724ba89841?auto=format&fit=crop&w=500&q=60'),
('Ghế Sofa Thư Giãn', 5500000, 5, 'Ghế sofa đơn êm ái.', 4, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=60');