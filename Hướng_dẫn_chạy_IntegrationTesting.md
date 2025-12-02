# 🧪 Câu 3 – Integration Testing (Frontend + Backend)

> Tài liệu hướng dẫn chi tiết cách chạy **Integration Testing** cho hệ thống Login và Product  
> trong dự án **FloginFE_BE** (React + Spring Boot).

---

## 📌 1. Tổng quan

Phần này mô tả cách:

- Chạy **kiểm thử tích hợp Frontend** (React, Jest, React Testing Library).  
- Chạy **kiểm thử tích hợp Backend** (Spring Boot, JUnit 5, MockMvc, Mockito).  
- Thống kê **số lượng test case**, **tỉ lệ pass**, và **kết quả mong đợi**.  
- Cung cấp **checklist** để đảm bảo toàn bộ Câu 3 đã được thực hiện đầy đủ.

---

## 🏗 2. Công nghệ sử dụng

### Frontend
- ReactJS  
- Jest  
- React Testing Library  
- Jest-DOM  

### Backend
- Spring Boot  
- Spring MVC  
- JUnit 5  
- MockMvc  
- Mockito  
- Maven Surefire Plugin

---

## 📂 3. Cấu trúc thư mục test

```text
FloginFE_BE/
├── frontend/
│   └── src/tests/
│        ├── login.integration.test.js
│        └── product.integration.test.js
│
└── backend/
    └── src/test/java/com/flogin/controller/
         ├── AuthControllerIntegrationTest.java
         └── ProductControllerIntegrationTest.java
```
## ⚡ 4. Hướng dẫn nhanh
Chạy toàn bộ test frontend
```bash
cd frontend
npm test
```
Chạy toàn bộ test backend
```bash
cd backend
mvn test
```
## 🟦 5. Frontend Integration Testing (React)
5.1 Chuẩn bị môi trường
```bash
cd frontend
npm install
```
5.2 Test Login – login.integration.test.js
```text
File: frontend/src/tests/login.integration.test.js
```
- Lệnh chạy riêng:

```bash
npm test src/tests/login.integration.test.js
```
Bảng test case
| Test case | Mục tiêu | Kết quả mong đợi |
|-------|--------|--------|
|TC-LOGIN-A1| Render form, nhập username/password      | Input hiển thị, nhận đúng dữ liệu      |
|TC-LOGIN-A2| Submit form rỗng      | Hiện lỗi thiếu thông tin      |
|TC-LOGIN-B1| Submit hợp lệ + gọi API + navigate      |Gọi login(), navigate /product      |
|TC-LOGIN-C1| API trả lỗi      | Hiển thị thông báo sai thông tin      |

- Kết quả mong đợi Jest

```text
PASS  src/tests/login.integration.test.js
Test Suites: 1 passed
Tests:       4 passed
```
5.3 Test Product – product.integration.test.js

- File: frontend/src/tests/product.integration.test.js

- Lệnh chạy riêng:

```bash
npm test src/tests/product.integration.test.js
```
Bảng test case
| Test case  | Mục tiêu                | Kết quả mong đợi                           |
| ---------- | ----------------------- | ------------------------------------------ |
| TC-PROD-A1 | Load danh sách sản phẩm | Hiển thị item "Laptop Dell"                |
| TC-PROD-B1 | Tạo mới – gọi onSave    | onSave nhận FormData đúng                  |
| TC-PROD-B2 | Edit sản phẩm           | Form load đúng dữ liệu cũ, lưu dữ liệu mới |
| TC-PROD-C1 | Xem chi tiết sản phẩm   | Modal hiển thị đầy đủ thông tin            |

- Kết quả mong đợi

```text
PASS  src/tests/product.integration.test.js
```
## 🟩 6. Backend Integration Testing (Spring Boot)
6.1 Chuẩn bị môi trường
```bash
cd backend
mvn clean install -DskipTests
```
6.2 Test API Login – AuthControllerIntegrationTest.java

- File: backend/src/test/java/com/flogin/controller/AuthControllerIntegrationTest.java

- Lệnh chạy riêng:
```bash
mvn test -Dtest=AuthControllerIntegrationTest
```
Bảng test case

| Test case | Mục tiêu              | Kết quả mong đợi                     |
| --------- | --------------------- | ------------------------------------ |
| TC-BE-A1  | Đăng nhập thành công  | Status 200, trả JSON token + message |
| TC-BE-A2  | Sai username/password | Status 400, trả thông báo lỗi        |
| TC-BE-C1  | CORS preflight        | Header CORS hợp lệ                   |


- Kết quả mong đợi Maven

```text
Tests run: 3, Failures: 0
BUILD SUCCESS
```
6.3 Test API Product – ProductControllerIntegrationTest.java

- File: backend/src/test/java/com/flogin/controller/ProductControllerIntegrationTest.java

- Lệnh chạy riêng:

```bash
mvn test -Dtest=ProductControllerIntegrationTest
```
Bảng test case

| Test case     | Mục tiêu               | Kết quả mong đợi                    |
| ------------- | ---------------------- | ----------------------------------- |
| TC-PROD-BE-A1 | POST tạo sản phẩm      | 201, JSON trả id & name đúng        |
| TC-PROD-BE-B1 | GET danh sách sản phẩm | 200, danh sách đúng số lượng        |
| TC-PROD-BE-C1 | GET chi tiết sản phẩm  | 200, id = 1, name đúng              |
| TC-PROD-BE-D1 | PUT cập nhật sản phẩm  | 200, name thay đổi                  |
| TC-PROD-BE-E1 | DELETE sản phẩm        | 200, deleteProduct() gọi đúng 1 lần |

- Kết quả mong đợi

```text
Tests run: 5, Failures: 0
BUILD SUCCESS
```
## 📊 7. Thống kê kết quả test
| Nhóm kiểm thử    | TC     | Pass   | Tỉ lệ    |
| ---------------- | ------ | ------ | -------- |
| FE – Login       | 4      | 4      | 100%     |
| FE – Product     | 4      | 4      | 100%     |
| BE – Auth API    | 3      | 3      | 100%     |
| BE – Product API | 5      | 5      | 100%     |
| **Tổng cộng**    | **16** | **16** | **100%** |


## ✅ 8. Checklist hoàn thành Câu 3

- Cấu trúc & file test

 ✅ login.integration.test.js

 ✅ product.integration.test.js

 ✅ AuthControllerIntegrationTest.java

 ✅ ProductControllerIntegrationTest.java

- Frontend

 ✅ Chạy: npm test src/tests/login.integration.test.js

 ✅ Chạy: npm test src/tests/product.integration.test.js

 ✅ npm test PASS toàn bộ

- Backend

 ✅ mvn test -Dtest=AuthControllerIntegrationTest

 ✅ mvn test -Dtest=ProductControllerIntegrationTest

 ✅ mvn test PASS toàn bộ

## 📝 9. Ghi chú quan trọng
- Backend dùng MockMvc → không cần Database thật.

- Frontend dùng mock service → không phụ thuộc backend khi chạy Jest.

- Các chuỗi trong test code để không dấu để khớp code gốc.
