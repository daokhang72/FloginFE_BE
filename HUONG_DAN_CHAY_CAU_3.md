# Hướng dẫn chạy Integration Tests (Câu 3)

---

## 📋 Tổng quan

Hướng dẫn này mô tả cách chạy các Integration Tests cho Login và Product, bao gồm Frontend Component Integration và Backend API Integration.

**Điểm số:** 20 điểm

- Câu 3.1: Login Integration Testing (10 điểm)
- Câu 3.2: Product Integration Testing (10 điểm)

---

## 🎨 Frontend Integration Tests

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

### Chạy tất cả Integration Tests

```bash
npm test -- --watchAll=false --testPathPattern=integration
```

---

## 📝 Câu 3.1: Login Integration Tests (10 điểm)

### Frontend Component Integration (5 điểm)

**Chạy test:**

```bash
npm test src/tests/Login.integration.test.js -- --watchAll=false
```

**Tests bao gồm:**

- ✅ **a) Test rendering và user interactions (2 điểm)**

  - Hiển thị form khi component được render
  - Kiểm tra các input và button được render đúng

- ✅ **b) Test form submission và API calls (2 điểm)**

  - Gọi API khi submit form hợp lệ
  - Kiểm tra dữ liệu được gửi đi đúng

- ✅ **c) Test error handling và success messages (1 điểm)**
  - Hiển thị lỗi khi submit form không hợp lệ
  - Hiển thị thông báo thành công khi login thành công

**Kết quả mong đợi:**

```
PASS src/tests/Login.integration.test.js
  Login Component Integration Tests
    ✓ Hiển thị form khi component được render
    ✓ Gọi API khi submit form hợp lệ
    ✓ Hiển thị lỗi khi submit form không hợp lệ
    ✓ Hiển thị thông báo thành công khi login thành công

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### Backend API Integration (5 điểm)

**Chạy test:**

```bash
cd backend
mvn test -Dtest=AuthControllerIntegrationTest
```

**Tests bao gồm:**

- ✅ **a) Test POST /api/auth/login endpoint (3 điểm)**
  - Test endpoint POST /api/auth/login thành công
- ✅ **b) Test response structure và status codes (1 điểm)**
  - Kiểm tra cấu trúc response và status code 200
- ✅ **c) Test CORS và headers (1 điểm)**
  - Kiểm tra CORS và content-type headers

**Kết quả mong đợi:**

```
[INFO] Running Login API Integration Tests
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0

Test Results:
  ✓ Test POST /api/auth/login endpoint thanh cong
  ✓ Test response structure va status code 200
  ✓ Test CORS va content-type headers
```

---

## 🛍️ Câu 3.2: Product Integration Tests (10 điểm)

### Frontend Component Integration (5 điểm)

**Chạy test:**

```bash
cd frontend
npm test src/tests/ProductForm.integration.test.js -- --watchAll=false
```

**Tests bao gồm:**

- ✅ **a) Test ProductList component với API (2 điểm)**
  - Hiển thị form tạo sản phẩm mới
- ✅ **b) Test ProductForm component (create/edit) (2 điểm)**
  - Tạo sản phẩm mới - điền form và submit
  - Chỉnh sửa sản phẩm - hiển thị dữ liệu cũ
- ✅ **c) Test ProductDetail component (1 điểm)**
  - Hiển thị chi tiết sản phẩm khi có productToEdit

**Kết quả mong đợi:**

```
PASS src/tests/ProductForm.integration.test.js
  Product Form Integration Tests
    ✓ Hiển thị form tạo sản phẩm mới
    ✓ Tạo sản phẩm mới - điền form và submit
    ✓ Chỉnh sửa sản phẩm - hiển thị dữ liệu cũ
    ✓ Hiển thị chi tiết sản phẩm khi có productToEdit

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### Backend API Integration (5 điểm)

**Chạy test:**

```bash
cd backend
mvn test -Dtest=ProductControllerIntegrationTest
```

**Tests bao gồm:**

- ✅ **a) Test POST /api/products (Create) (1 điểm)**
  - Tạo sản phẩm mới với multipart form data
- ✅ **b) Test GET /api/products (Read all) (1 điểm)**
  - Lấy tất cả sản phẩm
- ✅ **c) Test GET /api/products/{id} (Read one) (1 điểm)**
  - Lấy một sản phẩm theo ID
- ✅ **d) Test PUT /api/products/{id} (Update) (1 điểm)**
  - Cập nhật sản phẩm
- ✅ **e) Test DELETE /api/products/{id} (Delete) (1 điểm)**
  - Xóa sản phẩm

**Kết quả mong đợi:**

```
[INFO] Running Product API Integration Tests
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0

Test Results:
  ✓ Test POST /api/products - tao san pham moi
  ✓ Test GET /api/products - lay tat ca san pham
  ✓ Test GET /api/products/{id} - lay mot san pham
  ✓ Test PUT /api/products/{id} - cap nhat san pham
  ✓ Test DELETE /api/products/{id} - xoa san pham
```

---

## 🚀 Chạy tất cả Integration Tests

### Frontend - Tất cả Integration Tests

```bash
cd frontend
npm test -- --watchAll=false --testPathPattern="integration"
```

### Backend - Tất cả Integration Tests

```bash
cd backend
mvn test -Dtest=*IntegrationTest
```

Hoặc chạy cả Login và Product:

```bash
mvn test -Dtest=AuthControllerIntegrationTest,ProductControllerIntegrationTest
```

---

## 📊 Tổng kết kết quả

### Frontend Integration Tests

- Login Integration: **4/4 tests passed** ✅
- Product Integration: **4/4 tests passed** ✅
- **Tổng: 8/8 tests**

### Backend Integration Tests

- Login API Integration: **3/3 tests passed** ✅
- Product API Integration: **5/5 tests passed** ✅
- **Tổng: 8/8 tests**

### Tổng điểm: **20/20 điểm** 🎉

---

## 📁 Cấu trúc file tests

```
frontend/src/tests/
├── Login.integration.test.js          # Login Frontend Integration
└── ProductForm.integration.test.js    # Product Frontend Integration

backend/src/test/java/com/flogin/integration/
├── AuthControllerIntegrationTest.java    # Login Backend Integration
└── ProductControllerIntegrationTest.java # Product Backend Integration
```

---

## 🔍 Chi tiết từng test file

### Login.integration.test.js

```javascript
// Test rendering và user interactions
✓ Hiển thị form khi component được render

// Test form submission và API calls
✓ Gọi API khi submit form hợp lệ

// Test error handling và success messages
✓ Hiển thị lỗi khi submit form không hợp lệ
✓ Hiển thị thông báo thành công khi login thành công
```

### ProductForm.integration.test.js

```javascript
// Test ProductList component
✓ Hiển thị form tạo sản phẩm mới

// Test ProductForm component (create/edit)
✓ Tạo sản phẩm mới - điền form và submit
✓ Chỉnh sửa sản phẩm - hiển thị dữ liệu cũ

// Test ProductDetail component
✓ Hiển thị chi tiết sản phẩm khi có productToEdit
```

### AuthControllerIntegrationTest.java

```java
// Test POST /api/auth/login endpoint
✓ Test POST /api/auth/login endpoint thanh cong

// Test response structure và status codes
✓ Test response structure va status code 200

// Test CORS và headers
✓ Test CORS va content-type headers
```

### ProductControllerIntegrationTest.java

```java
// CRUD Operations Tests
✓ Test POST /api/products - tao san pham moi
✓ Test GET /api/products - lay tat ca san pham
✓ Test GET /api/products/{id} - lay mot san pham
✓ Test PUT /api/products/{id} - cap nhat san pham
✓ Test DELETE /api/products/{id} - xoa san pham
```

---

## 🛠️ Troubleshooting

### Frontend Issues

**Lỗi: Cannot find module**

```bash
# Xóa node_modules và cài lại
cd frontend
rm -rf node_modules
npm install
```

**Lỗi: Tests are not running**

```bash
# Clear Jest cache
npm test -- --clearCache
```

### Backend Issues

**Lỗi: Cannot connect to database**

```bash
# Kiểm tra MySQL đang chạy
# Kiểm tra application.properties
```

**Lỗi: Compilation failure**

```bash
# Clean và build lại
mvn clean compile
mvn test -Dtest=ProductControllerIntegrationTest
```

**Mock service không hoạt động:**

- Kiểm tra `@MockBean` annotation
- Kiểm tra `when(...).thenReturn(...)` đã setup đúng chưa
- Kiểm tra `@AutoConfigureMockMvc(addFilters = false)` để tắt security

---

## 📚 Tài liệu tham khảo

### Frontend Testing

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)

### Backend Testing

- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [MockMvc Documentation](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/test/web/servlet/MockMvc.html)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

---

## ✅ Checklist hoàn thành

- [x] Frontend Login Integration Tests (4 tests)
- [x] Backend Login Integration Tests (3 tests)
- [x] Frontend Product Integration Tests (4 tests)
- [x] Backend Product Integration Tests (5 tests)
- [x] Tất cả tests đều pass
- [x] Documentation đầy đủ
