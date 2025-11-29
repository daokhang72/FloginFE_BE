# Lỗi LaTeX và Cách khắc phục

## Các lỗi thường gặp

### 1. File ảnh không tìm thấy

```
! LaTeX Error: File `../images/login_performance_test.png' not found.
```

**Nguyên nhân:** Chưa tạo screenshot từ kết quả test

**Giải pháp:**

- Xem file `README_IMAGES.md` để biết cách tạo ảnh
- Hoặc tạm thời comment các dòng `\includegraphics` để compile được

### 2. Lỗi package không có

```
! LaTeX Error: File `vietnam.sty' not found.
```

**Giải pháp Windows:**

```bash
# Cài MiKTeX Package Manager
mpm --install=vietnam
mpm --install=vntex
```

**Giải pháp Ubuntu/Linux:**

```bash
sudo apt-get install texlive-lang-other
sudo apt-get install texlive-fonts-extra
```

**Giải pháp macOS:**

```bash
sudo tlmgr install vntex
```

### 3. Lỗi encoding

```
! Package inputenc Error: Unicode character ... not set up for use with LaTeX.
```

**Giải pháp:** Đảm bảo file .tex được lưu với encoding UTF-8

### 4. Lỗi longtable

```
! LaTeX Error: File `longtable.sty' not found.
```

**Giải pháp:**

```bash
# Windows (MiKTeX)
mpm --install=longtable

# Ubuntu/Linux
sudo apt-get install texlive-latex-extra

# macOS
sudo tlmgr install longtable
```

## Compile LaTeX thành công

### Bước 1: Đảm bảo có đủ ảnh

```
images/
├── login_performance_test.png
├── product_performance_test.png
└── security_test_results.png
```

### Bước 2: Compile

```bash
cd baocao/bao_cao_phan_mo_rong
pdflatex BaoCao_PhanMoRong.tex
pdflatex BaoCao_PhanMoRong.tex  # Chạy lần 2 để update references
```

### Bước 3: Mở file PDF

```bash
# Windows
start BaoCao_PhanMoRong.pdf

# macOS
open BaoCao_PhanMoRong.pdf

# Linux
xdg-open BaoCao_PhanMoRong.pdf
```

## Nếu vẫn lỗi - Compile tạm thời

Nếu bạn muốn xem kết quả ngay mà chưa có ảnh, tạm thời comment các dòng `\includegraphics`:

```latex
% \begin{figure}[h]
% \centering
% \fbox{\includegraphics[width=0.9\textwidth]{../images/login_performance_test.png}}
% \caption{Kết quả chạy k6 Performance Test - Login API từ Terminal}
% \label{fig:login_perf}
% \end{figure}
```

Sau khi có ảnh, uncomment lại.

## Tool khuyên dùng

### Online LaTeX Editor (Không cần cài đặt)

- **Overleaf:** https://www.overleaf.com
  - Upload file .tex và ảnh
  - Compile online
  - Export PDF

### Offline LaTeX Editor

- **Windows:** TeXworks (đi kèm MiKTeX)
- **macOS:** TeXShop (đi kèm MacTeX)
- **Linux:** Texmaker, TeXstudio
- **Cross-platform:** VS Code + LaTeX Workshop extension

## Kiểm tra xem đã cài LaTeX chưa

```bash
pdflatex --version
```

Nếu chưa cài:

- **Windows:** Tải MiKTeX từ https://miktex.org
- **macOS:** Tải MacTeX từ https://www.tug.org/mactex
- **Linux:** `sudo apt-get install texlive-full`
