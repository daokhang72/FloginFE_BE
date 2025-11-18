# Ứng dụng Quản Lý Sản Phẩm & Đăng Nhập (Flogin App)

Đây là ứng dụng Fullstack Web phục vụ cho bài tập lớn môn Kiểm Thử Phần Mềm. Ứng dụng bao gồm chức năng Đăng nhập (JWT), Quản lý sản phẩm (CRUD), và Upload hình ảnh.

## 🛠️ Công nghệ sử dụng

* **Frontend:** ReactJS (v18), Axios, CSS3.
* **Backend:** Spring Boot (v3.x), Spring Security, Spring Data JPA, JWT.
* **Database:** MySQL.
* **Tools:** Maven, npm, Postman.

---

## 📋 Yêu cầu cài đặt (Prerequisites)

Trước khi chạy dự án, đảm bảo máy tính của bạn đã cài đặt:

1.  **Java JDK 17** hoặc mới hơn (Dự án dùng Java 21).
2.  **Node.js** (v16 trở lên).
3.  **MySQL Server** (và MySQL Workbench).
4.  **Git** (để chạy lệnh Git Bash nếu dùng Windows).

---

## 🚀 Hướng dẫn Cài đặt & Chạy (Step-by-Step)

### Bước 1: Cấu hình Cơ sở dữ liệu (Database)

1.  Mở **MySQL Workbench**.
2.  Chạy đoạn script SQL sau để tạo Database và Bảng dữ liệu:

**File:** `backend/src/main/java/com/flogin/sql/imprort_databse.sql`

### Bước 2: Cấu hình & Chạy Backend

1. Mở thư mục backend/src/main/resources/application.properties.
2. Cập nhật thông tin MySQL của bạn (đặc biệt là password):
3. Mở Terminal (hoặc CMD/Git Bash) tại thư mục backend.
4. Chạy lệnh khởi động:

```bash
cd backend
./mvnw spring-boot:run
```
5. Chờ đến khi thấy dòng chữ: Tomcat started on port(s): 8080.

### Bước 3: Cài đặt & Chạy Frontend

1. Mở một Terminal mới tại thư mục frontend.
2. Chạy lệnh:

``` bash
cd frontend
npm install
npm start
```

4. Trình duyệt sẽ tự động mở tại: http://localhost:3000.

## Hướng dẫn Sử dụng (User Guide)

1. Đăng ký tài khoản (Lần đầu)
**Mục đích**: Vì mật khẩu trong Database được mã hóa (Hashing), bạn không thể thêm tay vào SQL. Hãy dùng Postman để tạo tài khoản: 
- Method: POST
- URL: http://localhost:8080/api/auth/register
- Body (JSON):

``` json
    {
    "username": "Do bạn tự chọn",
    "password": "Do bạn tự chọn",
    "email": "admin@example.com"
    }
```
**Hoặc**
## 👤 Hướng dẫn Đăng nhập (Tài khoản có sẵn)

Hệ thống đã được nạp sẵn tài khoản Admin để phục vụ kiểm thử. Không cần đăng ký mới.

* **Username:** `testuser`
* **Password:** `Test123`

2. Đăng nhập
- Truy cập http://localhost:3000
- Tài khoản: testuser / Test123 (hoặc tài khoản bạn vừa tạo)

3. Quản lý sản phẩm
- Sau khi đăng nhập, bạn sẽ được chuyển đến trang Quản lý Sản phẩm.
- Có thể Thêm, Sửa (kèm ảnh), Xóa và Xem chi tiết sản phẩm.