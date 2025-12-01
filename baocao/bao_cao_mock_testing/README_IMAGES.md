# Hướng dẫn chụp ảnh bằng chứng cho Mock Testing

## Ảnh cần chụp

### 1. login_mock_test_results.png

**Lệnh chạy:**

```bash
cd frontend
npm test -- --testPathPattern=MockTest_login --watchAll=false
```

**Nội dung cần capture:**

- Test suite: "Login Component - Mock Tests"
- 2 test cases PASSED:
  - ✓ Successful login - mock API
  - ✓ Failed login - mock API
- Test Suites: 1 passed, 1 total
- Tests: 2 passed, 2 total

**Vị trí lưu:** `baocao/bao_cao_mock_testing/images/login_mock_test_results.png`

---

### 2. product_mock_test_results.png

**Lệnh chạy:**

```bash
cd frontend
npm test -- --testPathPattern=MockTest_product --watchAll=false
```

**Nội dung cần capture:**

- Test suite: "Product Mock Tests - Frontend"
- 8 test cases PASSED:
  - ✓ Mock: Create product thành công
  - ✓ Mock: Create product thất bại
  - ✓ Mock: Get products thành công
  - ✓ Mock: Get products thất bại
  - ✓ Mock: Update product thành công
  - ✓ Mock: Update product thất bại
  - ✓ Mock: Delete product thành công
  - ✓ Mock: Delete product thất bại
- Test Suites: 1 passed, 1 total
- Tests: 8 passed, 8 total

**Vị trí lưu:** `baocao/bao_cao_mock_testing/images/product_mock_test_results.png`

---

## Hướng dẫn chụp ảnh

### Cách 1: Chụp từ Terminal

1. Chạy lệnh test trong terminal
2. Đợi test hoàn thành và hiển thị kết quả
3. Chụp màn hình terminal (bao gồm cả dòng lệnh và output)
4. Crop ảnh để chỉ giữ lại phần quan trọng
5. Lưu vào thư mục `images/` với tên tương ứng

### Cách 2: Chụp từ VS Code Terminal

1. Mở terminal trong VS Code
2. Chạy lệnh test
3. Chụp màn hình VS Code terminal
4. Lưu ảnh vào thư mục `images/`

### Cách 3: Chụp từ GitHub Actions (nếu có)

1. Vào repository GitHub
2. Chọn tab "Actions"
3. Chọn workflow run mới nhất
4. Mở job "Run Frontend Mock Tests"
5. Chụp phần logs hiển thị kết quả test
6. Lưu ảnh vào thư mục `images/`

---

## Lưu ý

- Ảnh nên có độ phân giải rõ ràng, dễ đọc
- Nên chụp full màu để thấy được màu xanh (PASS) và đỏ (FAIL)
- Đảm bảo tên file chính xác để LaTeX có thể reference được
- Kích thước ảnh không quá lớn (tối đa 2-3MB)

---

## Kiểm tra ảnh đã đủ chưa

Sau khi chụp xong, kiểm tra xem có đủ 2 ảnh:

```bash
ls -la baocao/bao_cao_mock_testing/images/
```

Nên có:

- login_mock_test_results.png
- product_mock_test_results.png
