# Báo Cáo Mock Testing

## Mô tả

Thư mục này chứa nội dung báo cáo Mock Testing cho hệ thống FloginFE_BE.

## Cấu trúc thư mục

```
bao_cao_mock_testing/
├── BaoCao_MockTesting_Content.tex   # Nội dung chính của báo cáo
├── README.md                         # File này
├── README_IMAGES.md                  # Hướng dẫn chụp ảnh bằng chứng
└── images/                           # Thư mục chứa ảnh bằng chứng
    ├── login_mock_test_results.png   # Kết quả test Login (cần chụp)
    └── product_mock_test_results.png # Kết quả test Product (cần chụp)
```

## Nội dung báo cáo

### 1. Giới thiệu (Section 4)

- Khái niệm Mock Testing
- Công cụ sử dụng: Jest, Mockito
- Mục tiêu kiểm thử

### 2. Login - Mock Testing (Section 4.2)

- Mock authService.login()
- Mock useNavigate() từ react-router-dom
- 2 test cases:
  - TC_MOCK_LOGIN_001: Đăng nhập thành công
  - TC_MOCK_LOGIN_002: Đăng nhập thất bại

### 3. Product - Mock Testing (Section 4.3)

- Mock productService (CREATE, READ, UPDATE, DELETE)
- 8 test cases bao phủ các operations:
  - TC_MOCK_PROD_001-002: Create operations
  - TC_MOCK_PROD_003-004: Read operations
  - TC_MOCK_PROD_005-006: Update operations
  - TC_MOCK_PROD_007-008: Delete operations

### 4. Kết luận (Section 4.4)

- Tổng kết kết quả: 10/10 tests PASSED
- Đánh giá ưu điểm của Mock Testing
- Best practices đã áp dụng

## Cách sử dụng

### 1. Compile riêng file này (nếu cần test)

```bash
cd baocao/bao_cao_mock_testing
pdflatex BaoCao_MockTesting_Content.tex
```

### 2. Include vào báo cáo tổng hợp (đã được cấu hình)

File `BaoCao_TongHop.tex` đã include nội dung này tại dòng:

```latex
\setcounter{section}{3}
\input{../bao_cao_mock_testing/BaoCao_MockTesting_Content.tex}
```

### 3. Compile báo cáo tổng hợp

```bash
cd baocao/bao_cao_tong_hop
pdflatex BaoCao_TongHop.tex
pdflatex BaoCao_TongHop.tex  # Compile 2 lần để cập nhật TOC và references
```

## Yêu cầu

### LaTeX Packages

Tất cả packages đã được khai báo trong `BaoCao_TongHop.tex`:

- vntex (tiếng Việt)
- longtable (bảng nhiều trang)
- listings (code highlighting)
- graphicx (hình ảnh)
- hyperref (links)
- xcolor (màu sắc)

### Ảnh bằng chứng

**Bắt buộc phải có 2 ảnh:**

1. `login_mock_test_results.png` - Kết quả test Login
2. `product_mock_test_results.png` - Kết quả test Product

Xem hướng dẫn chi tiết trong `README_IMAGES.md`

## Lệnh chạy test để lấy kết quả

### Login Mock Test

```bash
cd frontend
npm test -- --testPathPattern=MockTest_login --watchAll=false
```

**Expected output:**

```
✓ Successful login - mock API
✓ Failed login - mock API
Test Suites: 1 passed, 1 total
Tests: 2 passed, 2 total
```

### Product Mock Test

```bash
cd frontend
npm test -- --testPathPattern=MockTest_product --watchAll=false
```

**Expected output:**

```
✓ Mock: Create product thành công
✓ Mock: Create product thất bại
✓ Mock: Get products thành công
✓ Mock: Get products thất bại
✓ Mock: Update product thành công
✓ Mock: Update product thất bại
✓ Mock: Delete product thành công
✓ Mock: Delete product thất bại
Test Suites: 1 passed, 1 total
Tests: 8 passed, 8 total
```

## Tham chiếu trong LaTeX

Các hình ảnh được reference trong báo cáo:

```latex
\includegraphics[width=0.85\textwidth]{../bao_cao_mock_testing/images/login_mock_test_results.png}
\includegraphics[width=0.85\textwidth]{../bao_cao_mock_testing/images/product_mock_test_results.png}
```

## Lưu ý

1. **Đường dẫn tương đối**: Các đường dẫn ảnh sử dụng `../` vì file được input từ `bao_cao_tong_hop/`
2. **Section counter**: Sử dụng `\setcounter{section}{3}` để đảm bảo numbering đúng (Chapter 4)
3. **Subsection counter**: Reset về 0 tại đầu file với `\setcounter{subsection}{0}`
4. **Longtable**: Tất cả bảng sử dụng `longtable` environment để có thể span nhiều trang
5. **Code listings**: JavaScript code sử dụng `lstlisting` environment với `language=javascript`

## Troubleshooting

### Lỗi "File not found" cho ảnh

- Kiểm tra tên file chính xác: `login_mock_test_results.png`, `product_mock_test_results.png`
- Kiểm tra ảnh đã được lưu vào thư mục `images/`
- Compile từ thư mục `bao_cao_tong_hop/` (không phải thư mục hiện tại)

### Lỗi "Undefined control sequence"

- Đảm bảo compile từ `BaoCao_TongHop.tex` (có đầy đủ packages)
- Không compile trực tiếp file `BaoCao_MockTesting_Content.tex`

### Table của content bị lỗi

- Compile 2 lần liên tiếp để cập nhật TOC
- Clear các file auxiliary (.aux, .toc, .lof, .lot) nếu cần

## Checklist hoàn thành

- [x] Tạo file BaoCao_MockTesting_Content.tex
- [x] Tạo thư mục images/
- [x] Tạo README.md và README_IMAGES.md
- [x] Cập nhật BaoCao_TongHop.tex để include content
- [ ] Chụp ảnh login_mock_test_results.png
- [ ] Chụp ảnh product_mock_test_results.png
- [ ] Compile và kiểm tra PDF output
- [ ] Review nội dung và formatting

## Liên hệ

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng liên hệ nhóm thực hiện.
