# Hướng dẫn tạo biểu đồ Response Time Analysis

## Option 1: Sử dụng Excel/Google Sheets (Đơn giản nhất)

### Bước 1: Nhập dữ liệu

Tạo bảng với dữ liệu sau:

| Metric         | Login API (ms) | Product API (ms) |
| -------------- | -------------- | ---------------- |
| Average        | 4.29           | 6.08             |
| p(50) - Median | 3.80           | 5.20             |
| p(90)          | 5.05           | 8.77             |
| p(95)          | 5.59           | 10.52            |
| p(99)          | 8.50           | 15.30            |
| Max            | 312.21         | 299.96           |

### Bước 2: Tạo biểu đồ

**Excel:**

1. Chọn dữ liệu → Insert → Column Chart hoặc Bar Chart
2. Chọn "Clustered Column" hoặc "Grouped Bar"
3. Thêm title: "Response Time Analysis - Percentiles Comparison"
4. Thêm legend: Login API vs Product API
5. Định dạng trục Y: "Response Time (ms)"

**Google Sheets:**

1. Chọn dữ liệu → Insert → Chart
2. Chart type: Column chart hoặc Bar chart
3. Customize:
   - Chart title: "Response Time Analysis"
   - Axis titles: X = "Metrics", Y = "Time (ms)"
   - Legend position: Bottom

### Bước 3: Export ảnh

**Excel:**

- Right click vào chart → Save as Picture → PNG format

**Google Sheets:**

- Click vào chart → 3 dots menu → Download → PNG image

### Bước 4: Lưu file

```
c:\DoAn\FloginFE_BE\images\response_time_analysis.png
```

---

## Option 2: Sử dụng Python + Matplotlib (Chuyên nghiệp)

### Code mẫu:

```python
import matplotlib.pyplot as plt
import numpy as np

# Dữ liệu
metrics = ['Average', 'p(50)', 'p(90)', 'p(95)', 'p(99)', 'Max']
login_api = [4.29, 3.80, 5.05, 5.59, 8.50, 312.21]
product_api = [6.08, 5.20, 8.77, 10.52, 15.30, 299.96]

# Vị trí thanh
x = np.arange(len(metrics))
width = 0.35

# Tạo biểu đồ
fig, ax = plt.subplots(figsize=(12, 6))
bars1 = ax.bar(x - width/2, login_api, width, label='Login API', color='#4CAF50')
bars2 = ax.bar(x + width/2, product_api, width, label='Product API', color='#2196F3')

# Thêm labels và title
ax.set_xlabel('Metrics', fontsize=12, fontweight='bold')
ax.set_ylabel('Response Time (ms)', fontsize=12, fontweight='bold')
ax.set_title('Response Time Analysis - Login API vs Product API', fontsize=14, fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(metrics)
ax.legend()

# Thêm giá trị trên mỗi cột
def autolabel(bars):
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=9)

autolabel(bars1)
autolabel(bars2)

# Lưu ảnh
plt.tight_layout()
plt.savefig('c:/DoAn/FloginFE_BE/images/response_time_analysis.png', dpi=300, bbox_inches='tight')
plt.show()
```

### Chạy code:

```bash
# Cài đặt thư viện (nếu chưa có)
pip install matplotlib numpy

# Chạy script
python create_chart.py
```

---

## Option 3: Sử dụng Online Tools (Không cần cài gì)

### 1. ChartBlocks (https://www.chartblocks.com/)

- Free, không cần đăng ký
- Kéo thả để tạo chart
- Export PNG

### 2. Canva (https://www.canva.com/)

- Tạo tài khoản miễn phí
- Tìm template "Bar Chart" hoặc "Column Chart"
- Nhập dữ liệu và customize
- Download PNG

### 3. Plotly Chart Studio (https://chart-studio.plotly.com/)

- Free tier available
- Tạo interactive charts
- Export as static image

---

## Option 4: Screenshot từ k6 Cloud (Nếu có account)

Nếu bạn có k6 Cloud account:

```bash
k6 login cloud
k6 run --out cloud login-performance-test.js
```

Sau đó vào k6 Cloud dashboard và screenshot phần Response Time chart.

---

## Nếu không muốn tạo biểu đồ

### Giải pháp nhanh:

Comment dòng này trong file LaTeX:

```latex
% \begin{figure}[h]
% \centering
% \fbox{\includegraphics[width=0.85\textwidth]{../images/response_time_analysis.png}}
% \caption{Phân tích Response Time Distribution - Percentiles Comparison}
% \label{fig:response_analysis}
% \end{figure}
```

Báo cáo vẫn compile được bình thường, chỉ thiếu phần biểu đồ này.

---

## Tips để ảnh đẹp hơn

1. **Resolution:** Ít nhất 1920x1080 pixels
2. **DPI:** 300 DPI cho print quality
3. **Format:** PNG (transparency support)
4. **Font size:** Đủ lớn để đọc được khi in ra
5. **Colors:** Sử dụng màu tương phản (Green vs Blue)
6. **Legend:** Rõ ràng, dễ phân biệt
7. **Labels:** Có đơn vị (ms, req/s, etc.)

## Checklist

- [ ] Dữ liệu chính xác từ kết quả test
- [ ] Biểu đồ rõ ràng, dễ đọc
- [ ] Màu sắc phân biệt Login API vs Product API
- [ ] Có title và labels đầy đủ
- [ ] File lưu đúng tên: `response_time_analysis.png`
- [ ] File lưu đúng thư mục: `c:\DoAn\FloginFE_BE\images\`
- [ ] Kích thước hợp lý (không quá nhỏ, không quá lớn)
