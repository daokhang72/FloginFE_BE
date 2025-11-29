# Kiểm Thử Bảo Mật cho Ứng Dụng Flogin

## Giới Thiệu

Kiểm thử bảo mật được thực hiện để phát hiện các lỗ hổng bảo mật phổ biến và đảm bảo ứng dụng tuân thủ các tiêu chuẩn bảo mật tốt nhất.

## Các Loại Kiểm Thử

### 1. Kiểm Thử Lỗ Hổng Phổ Biến

- **SQL Injection**: Tấn công chèn mã SQL độc hại
- **XSS (Cross-Site Scripting)**: Chèn script độc hại vào trang web
- **CSRF (Cross-Site Request Forgery)**: Giả mạo yêu cầu từ người dùng
- **Authentication Bypass**: Thử vượt qua xác thực

### 2. Kiểm Tra Validation và Sanitization

- Kiểm thử input độc hại
- Kiểm tra giới hạn dữ liệu
- Xử lý ký tự đặc biệt

### 3. Thực Hành Bảo Mật Tốt Nhất

- Mã hóa mật khẩu (BCrypt)
- Bắt buộc HTTPS
- Cấu hình CORS đúng cách
- Cài đặt Security headers

## Cấu Trúc Thư Mục Test

```
security-testing/
├── README.md
├── SecurityTest.java (JUnit tests - 23+ test cases)
├── vulnerability-tests/
│   ├── sql-injection-tests.http
│   ├── xss-tests.http
│   ├── csrf-tests.http
│   └── auth-bypass-tests.http
└── SECURITY_BEST_PRACTICES.md
```

## Cách Chạy Tests

### 1. Chạy JUnit Security Tests (Khuyên dùng)

```bash
cd backend
mvn test -Dtest=SecurityTest
```

Lệnh này sẽ chạy 23+ test cases bao gồm:

- SQL Injection tests
- XSS tests
- CSRF tests
- Authentication bypass tests
- Input validation tests

### 2. Kiểm Thử Thủ Công với HTTP Files

Sử dụng **VS Code REST Client extension** hoặc **Postman** để test các file `.http`

1. Mở file trong `vulnerability-tests/`
2. Click "Send Request" để gửi từng test case
3. Kiểm tra kết quả trả về

## Kết Quả Mong Đợi

### ✓ PASS (Đạt yêu cầu):

- ✅ SQL Injection bị chặn (trả về 400/401)
- ✅ XSS payload bị làm sạch (sanitize)
- ✅ CSRF token được kiểm tra
- ✅ Truy cập không xác thực bị chặn (401/403)
- ✅ Mật khẩu được mã hóa (không lưu plaintext)

### ✗ FAIL (Không đạt):

- ❌ Input độc hại được xử lý thành công
- ❌ Dữ liệu nhạy cảm bị lộ ra ngoài
- ❌ Có thể vượt qua xác thực
- ❌ Mật khẩu không được mã hóa
