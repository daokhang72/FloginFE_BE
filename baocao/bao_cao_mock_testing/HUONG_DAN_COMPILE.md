# Hướng dẫn Compile Báo Cáo Mock Testing

## Bước 1: Chụp ảnh bằng chứng

### 1.1. Chạy test và chụp ảnh Login Mock Test

```bash
cd c:/DoAn/FloginFE_BE/frontend
npm test -- --testPathPattern=MockTest_login --watchAll=false
```

**Chụp màn hình terminal** và lưu vào:

```
baocao/bao_cao_mock_testing/images/login_mock_test_results.png
```

### 1.2. Chạy test và chụp ảnh Product Mock Test

```bash
cd c:/DoAn/FloginFE_BE/frontend
npm test -- --testPathPattern=MockTest_product --watchAll=false
```

**Chụp màn hình terminal** và lưu vào:

```
baocao/bao_cao_mock_testing/images/product_mock_test_results.png
```

---

## Bước 2: Compile báo cáo PDF

### 2.1. Mở terminal tại thư mục báo cáo tổng hợp

```bash
cd c:/DoAn/FloginFE_BE/baocao/bao_cao_tong_hop
```

### 2.2. Compile lần 1 (tạo file PDF và cập nhật references)

```bash
pdflatex BaoCao_TongHop.tex
```

### 2.3. Compile lần 2 (cập nhật Table of Contents)

```bash
pdflatex BaoCao_TongHop.tex
```

### 2.4. Mở file PDF để xem

```bash
# Windows
start BaoCao_TongHop.pdf

# Mac
open BaoCao_TongHop.pdf

# Linux
xdg-open BaoCao_TongHop.pdf
```

---

## Bước 3: Kiểm tra kết quả

### 3.1. Kiểm tra Table of Contents

Mục lục phải có:

- **4. Mock Testing**
  - 4.1 Giới thiệu chương
  - 4.2 Login - Mock Testing
  - 4.3 Product - Mock Testing
  - 4.4 Kết luận

### 3.2. Kiểm tra nội dung Chapter 4

- Có đầy đủ mô tả và test cases
- Có 2 hình ảnh hiển thị đúng:
  - Figure X.X: Kết quả Mock Test - Login Component
  - Figure X.Y: Kết quả Mock Test - Product Service
- Bảng test cases hiển thị đúng
- Code listings hiển thị đúng syntax highlighting

### 3.3. Kiểm tra ảnh

- Ảnh rõ nét, dễ đọc
- Không bị lỗi "File not found"
- Border (fbox) hiển thị đúng
- Caption hiển thị đúng

---

## Troubleshooting

### Lỗi: "File 'login_mock_test_results.png' not found"

**Nguyên nhân:** Chưa chụp ảnh hoặc sai tên file

**Giải pháp:**

1. Kiểm tra file ảnh tồn tại:

```bash
ls baocao/bao_cao_mock_testing/images/
```

2. Chụp lại ảnh theo đúng tên file
3. Compile lại báo cáo

### Lỗi: "Undefined control sequence"

**Nguyên nhân:** Thiếu LaTeX packages

**Giải pháp:**

1. Đảm bảo đang compile từ `BaoCao_TongHop.tex`
2. Cài đặt đầy đủ LaTeX distribution (MiKTeX hoặc TeX Live)
3. Update packages:

```bash
tlmgr update --all  # TeX Live
```

### Lỗi: Table of Contents không cập nhật

**Nguyên nhân:** Cần compile nhiều lần

**Giải pháp:**

1. Xóa các file tạm:

```bash
rm BaoCao_TongHop.aux BaoCao_TongHop.toc BaoCao_TongHop.lof BaoCao_TongHop.lot
```

2. Compile 2 lần liên tiếp:

```bash
pdflatex BaoCao_TongHop.tex
pdflatex BaoCao_TongHop.tex
```

### Lỗi: Ảnh bị vỡ hoặc không rõ

**Nguyên nhân:** File ảnh quá lớn hoặc độ phân giải thấp

**Giải pháp:**

1. Nén ảnh với chất lượng cao:

   - Format: PNG
   - Max size: 2-3 MB
   - Min resolution: 1920x1080

2. Chụp lại với settings tốt hơn

---

## Tips

### Compile nhanh với script

Tạo file `compile.sh`:

```bash
#!/bin/bash
cd c:/DoAn/FloginFE_BE/baocao/bao_cao_tong_hop
pdflatex BaoCao_TongHop.tex
pdflatex BaoCao_TongHop.tex
echo "Done! Opening PDF..."
start BaoCao_TongHop.pdf
```

Chạy:

```bash
bash compile.sh
```

### Clean auxiliary files

```bash
cd c:/DoAn/FloginFE_BE/baocao/bao_cao_tong_hop
rm *.aux *.log *.toc *.lof *.lot *.out
```

### View logs nếu có lỗi

```bash
cat BaoCao_TongHop.log | grep -i error
```

---

## Checklist trước khi nộp

- [ ] Chụp xong 2 ảnh bằng chứng
- [ ] Compile thành công không lỗi
- [ ] Table of Contents đầy đủ
- [ ] Chapter 4 hiển thị đúng
- [ ] Ảnh hiển thị rõ ràng
- [ ] Code listings format đẹp
- [ ] Bảng test cases đầy đủ
- [ ] Numbering sections đúng (4, 4.1, 4.2, 4.3, 4.4)
- [ ] Review toàn bộ nội dung
- [ ] PDF không bị lỗi font tiếng Việt

---

## Kết quả mong đợi

Sau khi hoàn thành, bạn sẽ có:

1. File `BaoCao_TongHop.pdf` hoàn chỉnh
2. Chapter 4 "Mock Testing" với đầy đủ nội dung
3. 2 ảnh bằng chứng test results
4. Code examples và test cases chi tiết
5. Báo cáo chuyên nghiệp, dễ đọc
