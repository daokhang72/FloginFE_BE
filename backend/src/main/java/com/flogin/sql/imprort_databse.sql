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
-- Thêm một số dữ liệu mẫu (Tùy chọn)
-- -----------------------------------------------------
INSERT INTO `categories` (`name`, `description`) 
VALUES 
('Electronics', 'Đồ điện tử'),
('Books', 'Sách và truyện'),
('Clothing', 'Quần áo thời trang');

-- Mật khẩu 'Test123' đã được mã hóa bằng Bcrypt
-- Hash: $2a$10$N.zmdr9k7uOcQb376Vy.HOILkmckkbEy8i7960P1eNAshJp3S0wWW
INSERT INTO users (username, password, email) 
VALUES 
('testuser', '$2a$10$N.zmdr9k7uOcQb376Vy.HOILkmckkbEy8i7960P1eNAshJp3S0wWW', 'admin@flogin.com');

INSERT INTO `products` (`name`, `description`, `price`, `quantity`, `category_id`) 
VALUES 
('Laptop Dell', 'Laptop Dell XPS 15 mới', 15000000.00, 10, 1),
('Chuột máy tính', 'Chuột không dây Logitech', 200000.00, 50, 1);

USE flogin_project_db;
ALTER TABLE products ADD COLUMN image VARCHAR(255) NULL;