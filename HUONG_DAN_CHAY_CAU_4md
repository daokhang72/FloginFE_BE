# Hướng dẫn chạy Unit Tests - Mock Testing

---

## 📋 Tổng quan

Hướng dẫn này mô tả cách chạy các Unit Tests (Mock Tests) cho cả Frontend (JavaScript/React) và Backend (Java/Spring Boot).

---

## 🎨 Frontend Tests

### Yêu cầu

- Node.js >= 16.x
- npm >= 8.x
- React Testing Library
- Jest

### Cài đặt dependencies

```bash
cd frontend
npm install
```

### Chạy tất cả tests

**Chạy tất cả tests với watch mode tắt:**

```bash
npm test -- --watchAll=false
```

**Chạy với watch mode (tự động chạy lại khi có thay đổi):**

```bash
npm test
```

### Chạy test cụ thể

**Mock Test Login:**

```bash
npm test src/tests/MockTest_login.test.js -- --watchAll=false
```

Tests bao gồm:

- ✅ Successful login - mock API
- ✅ Failed login - mock API

**Mock Test Product:**

```bash
npm test src/tests/MockTest_product.test.js -- --watchAll=false
```

Tests bao gồm:

- ✅ Mock: Create product thành công
- ✅ Mock: Create product thất bại
- ✅ Mock: Get products thành công
- ✅ Mock: Get products thất bại
- ✅ Mock: Update product thành công
- ✅ Mock: Update product thất bại
- ✅ Mock: Delete product thành công
- ✅ Mock: Delete product thất bại

### Kết quả mong đợi

```
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        ~3-4s
```

---

## ☕ Backend Tests

### Yêu cầu

- Java 21 hoặc cao hơn
- Maven 3.8+
- MySQL đang chạy
- Database đã được cấu hình trong `application.properties`

### Cấu hình Database

Kiểm tra file `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flogin_project_db
spring.datasource.username=root
spring.datasource.password=123456  # Thay bằng mật khẩu của bạn
```

### Chạy tất cả tests

**Sử dụng Maven wrapper:**

```bash
cd backend
./mvnw test
```

**Hoặc sử dụng Maven command:**

```bash
cd backend
mvn test
```

### Chạy test cụ thể

**Mock Test AuthController:**

```bash
./mvnw test -Dtest=AuthControllerTest
```

Tests bao gồm:

- ✅ Test login endpoint
- ✅ Test registration endpoint

**Mock Test ProductService:**

```bash
./mvnw test -Dtest=ProductServiceMockTest
```

Tests bao gồm:

- ✅ Test getAllProducts
- ✅ Test getProductById - found
- ✅ Test getProductById - not found
- ✅ Test createProduct
- ✅ Test updateProduct - success
- ✅ Test updateProduct - not found
- ✅ Test deleteProduct - success
- ✅ Test deleteProduct - not found
- ✅ Test searchProducts
- ✅ Test filterProductsByCategory

**Mock Test BackendApplication:**

```bash
./mvnw test -Dtest=BackendApplicationTests
```

### Kết quả mong đợi

```
Tests run: 13, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
Total time: ~13-15s
```

---

## 🔍 Các Test Cases chi tiết

### Frontend Mock Tests

#### Login Tests

1. **Successful login**: Mock API trả về token và thông tin user
2. **Failed login**: Mock API trả về lỗi 401 Unauthorized

#### Product Tests

1. **Create product thành công**: Mock API tạo sản phẩm mới
2. **Create product thất bại**: Mock API trả về lỗi validation
3. **Get products thành công**: Mock API trả về danh sách sản phẩm
4. **Get products thất bại**: Mock API trả về lỗi 500
5. **Update product thành công**: Mock API cập nhật sản phẩm
6. **Update product thất bại**: Mock API trả về lỗi 404
7. **Delete product thành công**: Mock API xóa sản phẩm
8. **Delete product thất bại**: Mock API trả về lỗi 404

### Backend Mock Tests

#### AuthControllerTest

- Test các endpoint authentication (login, register)
- Mock UserDetailsService và AuthenticationManager
- Verify JWT token generation

#### ProductServiceMockTest

- Test CRUD operations cho Product
- Mock ProductRepository
- Test exception handling
- Test search và filter functionality

#### BackendApplicationTests

- Context loading test
- Verify Spring Boot application starts successfully

---

## ⚠️ Lưu ý quan trọng

### Frontend

- Đảm bảo đã cài đặt đầy đủ dependencies bằng `npm install`
- Nếu gặp lỗi "Cannot find module", chạy lại `npm install`
- Mock tests không cần backend server chạy

### Backend

- Đảm bảo MySQL đang chạy trước khi chạy tests
- Kiểm tra database connection trong `application.properties`
- Đảm bảo database `flogin_project_db` đã được tạo
- Mock tests sẽ tự động mock các dependencies, không cần database thực

---

## 🐛 Xử lý lỗi thường gặp

### Frontend

**Lỗi: "Cannot find module"**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Lỗi: "Your test suite must contain at least one test"**

- Một số file test có thể bị comment hoặc rỗng
- Chạy các Mock Test cụ thể thay vì chạy tất cả

### Backend

**Lỗi: "Unable to determine Dialect without JDBC metadata"**

- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin kết nối database trong `application.properties`

**Lỗi: "Access denied for user"**

- Kiểm tra lại username và password trong `application.properties`
- Đảm bảo user có quyền truy cập database

---

## 📊 Tổng kết kết quả

### Kết quả thực tế đã test

**Backend Tests:**

- AuthControllerTest: 2/2 tests PASSED ✅
- BackendApplicationTests: 1/1 test PASSED ✅
- ProductServiceMockTest: 10/10 tests PASSED ✅
- **Total: 13/13 tests PASSED** 🎉

**Frontend Tests:**

- MockTest_login.test.js: 2/2 tests PASSED ✅
- MockTest_product.test.js: 8/8 tests PASSED ✅
- **Total: 10/10 tests PASSED** 🎉

**Tổng cộng: 23/23 tests PASSED** 🚀

---

## 📚 Tài liệu tham khảo

### Frontend Testing

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing React Components](https://reactjs.org/docs/testing.html)

### Backend Testing

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/)

### Additional Resources

- [Mock Testing Best Practices](https://martinfowler.com/articles/practical-test-pyramid.html)
- [LaTeX Documentation](https://www.latex-project.org/help/documentation/)

---

**Last Updated:** December 1, 2025
**Version:** 2.0
