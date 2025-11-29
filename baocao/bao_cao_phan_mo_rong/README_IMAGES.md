# Hướng dẫn tạo ảnh chứng minh cho Báo cáo Phần Mở Rộng

## Các ảnh cần thiết

Để hoàn thiện báo cáo LaTeX, bạn cần chụp màn hình (screenshot) các kết quả test và lưu vào thư mục `images/` với các tên file sau:

### 1. Performance Testing (2 ảnh)

#### `login_performance_test.png`

- **Cách tạo:**
  ```bash
  cd performance-testing
  k6 run login-performance-test.js
  ```
- **Nội dung cần chụp:**
  - Toàn bộ output từ terminal khi chạy k6
  - Phần hiển thị biểu đồ ASCII art của k6
  - Phần "Login API Performance Test Summary" với:
    - Response Time (avg, min, max, p90, p95)
    - Total Requests và Requests/sec
    - Error Rate
  - Thời gian chạy test (10m32.9s)

#### `product_performance_test.png`

- **Cách tạo:**
  ```bash
  cd performance-testing
  k6 run product-performance-test.js
  ```
- **Nội dung cần chụp:**
  - Tương tự login test
  - Phần "Product API Performance Test Summary"
  - Các chỉ số: avg: 6.08ms, Total Requests: 229,616, etc.

### 2. Security Testing (1 ảnh)

#### `security_test_results.png`

- **Cách tạo:**
  ```bash
  cd backend
  mvn test -Dtest=SecurityTest
  ```
- **Nội dung cần chụp:**
  - Phần "T E S T S"
  - Dòng "Running Security Tests"
  - Kết quả: "Tests run: 19, Failures: 0, Errors: 0, Skipped: 0"
  - Thời gian: "Time elapsed: 13.95 s"
  - Dòng "BUILD SUCCESS"

## Hướng dẫn chụp màn hình

### Windows:

1. **Chụp toàn màn hình:** Phím `Windows + Print Screen`
2. **Chụp vùng chọn:** Phím `Windows + Shift + S`
3. Ảnh sẽ được lưu tự động vào thư mục `Pictures/Screenshots`

### macOS:

1. **Chụp toàn màn hình:** `Command + Shift + 3`
2. **Chụp vùng chọn:** `Command + Shift + 4`
3. Ảnh sẽ được lưu tự động trên Desktop

### Linux:

1. Sử dụng `gnome-screenshot` hoặc `scrot`
2. Hoặc phím `Print Screen` (tùy distro)

## Lưu ảnh vào đúng thư mục

Sau khi chụp, di chuyển các ảnh vào:

```
c:\DoAn\FloginFE_BE\images\
├── login_performance_test.png
├── product_performance_test.png
├── security_test_results.png
└── response_time_analysis.png (OPTIONAL - có thể bỏ qua)
```

### 3. Response Time Analysis (OPTIONAL)

#### `response_time_analysis.png`

- **Cách tạo:**
  - Có thể tạo biểu đồ từ Excel/Google Sheets
  - Hoặc dùng ảnh minh họa comparison chart
  - Hoặc screenshot từ k6 Cloud (nếu có)
- **Nội dung:** Biểu đồ so sánh percentiles giữa Login API vs Product API
- **Lưu ý:** Nếu không có, comment dòng `\includegraphics` trong LaTeX file

## Kiểm tra ảnh

Đảm bảo:

- ✅ Ảnh rõ nét, đủ sáng
- ✅ Text trong terminal đọc được
- ✅ Kích thước hợp lý (không quá nhỏ, không quá lớn)
- ✅ Format: PNG (nén tốt, chất lượng cao)
- ✅ Tên file chính xác (không viết hoa, không có khoảng trắng)

## Compile LaTeX sau khi có ảnh

```bash
cd baocao/bao_cao_phan_mo_rong
pdflatex BaoCao_PhanMoRong.tex
pdflatex BaoCao_PhanMoRong.tex  # Chạy 2 lần để update references
```

## Nếu thiếu ảnh

LaTeX sẽ báo lỗi:

```
! LaTeX Error: File `../images/login_performance_test.png' not found.
```

Giải pháp:

1. Kiểm tra đường dẫn file ảnh
2. Kiểm tra tên file (phân biệt chữ hoa/thường)
3. Tạm thời comment dòng `\includegraphics` để compile được

## Lưu ý

- Ảnh **BẮT BUỘC** phải chụp từ kết quả test thực tế
- **KHÔNG** chỉnh sửa ảnh (photoshop số liệu)
- Nếu chạy lại test, kết quả có thể khác một chút (response time, throughput) - điều này là bình thường
- Ảnh chứng minh tính xác thực của báo cáo (giống như Unit Testing đã làm)
