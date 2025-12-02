# 📋 Câu 1 – Phân tích và Thiết kế Test Cases

## 📌 Tổng quan

Câu 1 yêu cầu phân tích yêu cầu hệ thống và thiết kế test cases chi tiết cho 2 chức năng chính:

- **Login (Đăng nhập)**: 8 test cases
- **Product (Quản lý sản phẩm)**: 14 test cases

**Tổng cộng**: 22 test cases

## 🎯 Nội dung

### 1. Login - Phân tích và Thiết kế Test Scenarios

#### 1.1. Yêu cầu chức năng

- Username: 3-50 ký tự
- Password: 6-100 ký tự, phải chứa cả chữ và số
- API: POST /api/auth/login

#### 1.2. Test Scenarios

**TS_LOGIN_01**: Validation dữ liệu đầu vào

- TC_LOGIN_01: Submit form rỗng
- TC_LOGIN_02: Username quá ngắn (< 3 ký tự)
- TC_LOGIN_03: Password quá ngắn (< 6 ký tự)
- TC_LOGIN_04: Password không chứa số

**TS_LOGIN_02**: Xác thực người dùng

- TC_LOGIN_05: Username không tồn tại
- TC_LOGIN_06: Password sai
- TC_LOGIN_07: Đăng nhập thành công

**TS_LOGIN_03**: CORS và Headers

- TC_LOGIN_08: Kiểm tra CORS headers

#### 1.3. Test Data

**Valid credentials**:

- Username: `testuser`
- Password: `Test123`

**Invalid test data**:

- Empty username: ""
- Short username: "ab"
- Non-existent username: "nonexistuser"
- Empty password: ""
- Short password: "12345"
- No number password: "abcdefgh"
- Wrong password: "WrongPass1"

### 2. Product - Phân tích và Thiết kế Test Scenarios

#### 2.1. Yêu cầu chức năng

- Product Name: 3-100 ký tự
- Price: Số dương, không vượt quá 1 tỷ đồng
- Quantity: Số nguyên không âm
- Description: Tối đa 500 ký tự
- Category: Bắt buộc chọn
- Image: JPG, PNG, GIF (tùy chọn)

#### 2.2. Test Scenarios

**TS_PRODUCT_01**: Validation dữ liệu sản phẩm

- TC_PROD_01: Tên sản phẩm rỗng
- TC_PROD_02: Tên quá ngắn (< 3 ký tự)
- TC_PROD_03: Tên quá dài (> 100 ký tự)
- TC_PROD_04: Giá âm
- TC_PROD_05: Giá bằng 0
- TC_PROD_06: Giá quá lớn (> 1 tỷ)
- TC_PROD_07: Số lượng âm
- TC_PROD_08: Mô tả quá dài (> 500 ký tự)
- TC_PROD_09: Không chọn danh mục

**TS_PRODUCT_02**: CRUD Operations

- TC_PROD_10: Tạo sản phẩm thành công (POST)
- TC_PROD_11: Lấy danh sách sản phẩm (GET all)
- TC_PROD_12: Lấy chi tiết sản phẩm (GET by ID)
- TC_PROD_13: Cập nhật sản phẩm (PUT)
- TC_PROD_14: Xóa sản phẩm (DELETE)

#### 2.3. API Endpoints

```
GET    /api/products          - Lấy danh sách sản phẩm
GET    /api/products/{id}     - Lấy chi tiết sản phẩm
POST   /api/products          - Tạo sản phẩm mới
PUT    /api/products/{id}     - Cập nhật sản phẩm
DELETE /api/products/{id}     - Xóa sản phẩm
```

#### 2.4. Test Data

**Valid products**:
| Name | Price (VND) | Quantity | Category |
|------|-------------|----------|----------|
| Laptop Dell | 15,000,000 | 10 | Laptop |
| Chuột không dây | 200,000 | 50 | Phụ kiện |
| Bàn phím cơ | 1,500,000 | 20 | Phụ kiện |
| Màn hình 24 inch | 3,000,000 | 15 | Màn hình |

**Invalid test data**:

- Name: "", "AB", (101 chars)
- Price: -1000, 0, 1000000001
- Quantity: -5
- Description: (501 chars)
- CategoryId: 0, ""

## 📊 Thống kê Test Cases

### Phân bố theo chức năng

- **Login**: 8 test cases (36%)
- **Product**: 14 test cases (64%)
- **Tổng**: 22 test cases

### Phân loại theo loại test

- **Validation Tests**: 11 test cases (50%)
- **Functional Tests**: 9 test cases (41%)
- **Integration Tests**: 2 test cases (9%)

### Coverage

✅ **Input Validation**: Đầy đủ các trường hợp biên (boundary values)  
✅ **Business Logic**: Bao phủ tất cả các luồng chính  
✅ **Error Handling**: Kiểm tra các trường hợp lỗi thường gặp

## 📁 Cấu trúc thư mục

```
baocao/bao_cao_test_case_design/
├── BaoCao_TestCaseDesign_Content.tex   # Nội dung chính
├── README.md                            # File này
└── images/                              # Thư mục chứa ảnh (nếu có)
```

## 📄 Xem báo cáo LaTeX

File LaTeX chính: `BaoCao_TestCaseDesign_Content.tex`

Nội dung bao gồm:

1. Giới thiệu chương
2. Login - Phân tích và Thiết kế Test Scenarios
   - Yêu cầu chức năng
   - Test Scenarios
   - Thiết kế Test Cases chi tiết
   - Test Data
3. Product - Phân tích và Thiết kế Test Scenarios
   - Yêu cầu chức năng
   - Test Scenarios
   - Thiết kế Test Cases chi tiết
   - Test Data
4. Kết luận

## 🔗 Liên kết với các phần khác

Test cases được thiết kế trong câu này sẽ được sử dụng để:

- **Unit Testing** (Câu 2): Kiểm thử từng đơn vị code
- **Integration Testing** (Câu 3): Kiểm thử tích hợp giữa các components
- **Mock Testing** (Câu 4): Kiểm thử với mock dependencies
- **Automation Testing** (Câu 5): Tự động hóa kiểm thử E2E

## 💡 Lưu ý

- Test cases được thiết kế dựa trên yêu cầu thực tế của hệ thống FloginFE_BE
- Mỗi test case có mô tả rõ ràng về Input và Expected Result
- Test data được chuẩn bị sẵn để dễ dàng thực thi tests
- Các test cases này đã được implement và verify trong các câu tiếp theo
