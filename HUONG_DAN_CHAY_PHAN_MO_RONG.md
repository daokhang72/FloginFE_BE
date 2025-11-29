# Hướng Dẫn Chạy Kiểm Thử Hiệu Suất & Bảo Mật

## 📋 Yêu Cầu Chuẩn Bị

### 1. Cài Đặt k6 (Công Cụ Kiểm Thử Hiệu Suất)

#### Windows (Chọn 1 trong 3 cách):

**Cách 1: Chocolatey (Cần quyền Admin)**

```bash
# Mở PowerShell/CMD với quyền Admin (Chuột phải → Chạy với quyền Admin)
choco install k6
```

**Cách 2: Tải Trực Tiếp (Không cần Admin - KHUYÊN DÙNG)**

```bash
# Tải file k6
curl -L https://github.com/grafana/k6/releases/download/v0.48.0/k6-v0.48.0-windows-amd64.zip -o k6.zip

# Giải nén (hoặc dùng Windows Explorer)
tar -xf k6.zip

# Thêm vào PATH hoặc copy vào thư mục project
move k6.exe C:\DoAn\FloginFE_BE\performance-testing\

# Chạy thử
cd C:\DoAn\FloginFE_BE\performance-testing
.\k6.exe version
```

**Cách 3: npm (Nếu đã cài Node.js)**

```bash
npm install -g k6
```

#### macOS:

```bash
brew install k6
```

#### Linux:

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### 2. Kiểm Tra Cài Đặt

```bash
k6 version
```

---

## 🚀 Chạy Kiểm Thử Hiệu Suất

### Bước 1: Khởi Động Backend Server

```bash
cd backend
mvn spring-boot:run
```

Server sẽ chạy ở: `http://localhost:8080`

### Bước 2: Hiểu Các Loại Performance Tests

Có **4 loại tests** trong project, mỗi loại có **mục đích khác nhau**:

#### 🔵 Test 1 & 2: Load Test (Login & Product API)

**Mục đích:** Kiểm tra hiệu suất hệ thống dưới **tải trọng bình thường** và dự kiến

**Đặc điểm:**

- Tăng tải **từ từ và ổn định** (2 → 100 → 500 → 1000 users)
- Giữ mỗi mức tải trong 2-3 phút
- Test **2 API riêng biệt**: Login và Product
- Mục tiêu: **0% error rate**

**Khi nào dùng:**

- Kiểm tra hiệu suất hệ thống trong điều kiện **sử dụng thực tế**
- Đảm bảo hệ thống xử lý được lượng người dùng **dự kiến hàng ngày**
- Tìm response time và throughput **bình thường**

**Ví dụ thực tế:**

- Website có 10,000 người dùng hoạt động, đồng thời online ~1000 người
- Shop thời trang có ~500 người đang xem sản phẩm cùng lúc

---

#### 🔴 Test 3: Stress Test (Tìm Breaking Point)

**Mục đích:** Tìm **điểm giới hạn** của hệ thống - khi nào hệ thống bắt đầu lỗi

**Đặc điểm:**

- Tăng tải **liên tục** đến khi hệ thống **bắt đầu fail**
- Đẩy từ 100 → 500 → 1000 → 1500 → 2000 → 2500 → 3000 users
- Giữ ở mức cao nhất (3000 users) trong 3 phút
- Test **hỗn hợp** cả Login và Product API (40% login, 30% get products, 30% khác)
- **Chấp nhận lỗi** (expect 10-60% error rate ở mức cao)

**Khi nào dùng:**

- Muốn biết hệ thống **chịu được tối đa bao nhiêu users**
- Lập kế hoạch **mở rộng hệ thống** (scaling plan)
- Biết được **bottleneck** (database, CPU, memory...)

**Ví dụ thực tế:**

- Black Friday - lượng truy cập **tăng gấp 10 lần** bình thường
- Livestream sale - hàng nghìn người vào cùng lúc
- Sự kiện viral - traffic đột biến không dự đoán được

**Kết quả dự án Flogin:**

```
✅ 1000 users: 0% error (an toàn)
⚠️ 1500 users: 5% error (bắt đầu có vấn đề)
❌ 2000 users: 30% error (BREAKING POINT - điểm giới hạn)
❌ 3000 users: 78% error (quá tải nghiêm trọng)
```

---

#### 🟠 Test 4: Spike Test (Traffic Đột Biến)

**Mục đích:** Kiểm tra hệ thống xử lý thế nào khi traffic **tăng đột ngột** trong thời gian ngắn

**Đặc điểm:**

- Tăng **đột ngột** trong **10 giây** (100 → 2000 hoặc 3000 users)
- Giữ ở mức cao trong 1 phút, rồi giảm xuống
- Test khả năng **phục hồi** của hệ thống
- Test **2 lần spike** để xem hệ thống có phục hồi được không
- **Chấp nhận lỗi cao** (expect 15-50% error rate)

**Khi nào dùng:**

- Test khả năng **auto-scaling** (tự động mở rộng)
- Kiểm tra **circuit breaker** và rate limiting
- Test **recovery** - hệ thống có tự động phục hồi không

**Ví dụ thực tế:**

- Livestream flash sale - hàng nghìn người vào **đúng 12h trưa**
- Đăng ký event - link mở đúng 10h, cả ngàn người đăng ký cùng lúc
- Social media viral - video được share, traffic tăng từ 100 → 10,000 người trong 1 phút

**Sự khác biệt Stress vs Spike:**

```
Stress Test:  100 → 500 → 1000 → 1500 → 2000 → 2500 → 3000 (từ từ, 18 phút)
Spike Test:   100 ━━━━━━━━━━━━━━━> 3000 (đột ngột, 10 giây)
```

**Kết quả dự án Flogin:**

```
Spike 1 (100→2000 trong 10s): 20% error, hệ thống còn xử lý được
Spike 2 (100→3000 trong 10s): 50% error, backend CRASHED sau 203 giây
```

---

### 📊 Bảng So Sánh 4 Loại Tests

| Tiêu chí       | Load Test (Login/Product) | Stress Test                | Spike Test                 |
| -------------- | ------------------------- | -------------------------- | -------------------------- |
| **Mục đích**   | Hiệu suất bình thường     | Tìm giới hạn hệ thống      | Test traffic đột biến      |
| **Pattern**    | Tăng từ từ, giữ ổn định   | Tăng liên tục đến fail     | Tăng đột ngột              |
| **Users**      | 2 → 100 → 500 → 1000      | 100 → 3000 (tăng dần)      | 100 → 3000 (10 giây)       |
| **Duration**   | ~10 phút                  | ~18 phút                   | ~6 phút                    |
| **Error Rate** | 0% (mục tiêu)             | 10-60% (chấp nhận)         | 15-50% (chấp nhận)         |
| **Use Case**   | Sử dụng hàng ngày         | Black Friday, viral        | Flash sale, event mở cửa   |
| **Kết quả**    | 0% error ở 1000 users     | Breaking point: 2000 users | Backend crash ở spike 3000 |

---

### Bước 3: Chạy Các Tests

#### Test 1: Load Test - Login API

```bash
cd performance-testing

# Nếu cài k6 toàn hệ thống
k6 run login-performance-test.js

# Nếu tải k6.exe vào thư mục này
.\k6.exe run login-performance-test.js
```

**Kết quả đã đạt được:**

- ✅ 144,185 requests
- ✅ 0% error rate
- ✅ 4.51ms average response time
- ✅ 228 req/s throughput

---

#### Test 2: Load Test - Product API

```bash
k6 run product-performance-test.js
# hoặc: .\k6.exe run product-performance-test.js
```

**Kết quả đã đạt được:**

- ✅ 230,123 requests
- ✅ 0% error rate
- ✅ 5.30ms average response time
- ✅ 364 req/s throughput
- Distribution: 70% GET all, 30% GET single

---

#### Test 3: Stress Test - Tìm Breaking Point

```bash
k6 run stress-test.js
# hoặc: .\k6.exe run stress-test.js
```

**⚠️ Warning:** Test này sẽ đẩy hệ thống đến giới hạn, expect có lỗi!

**Kết quả đã đạt được:**

- ✅ 3,710,420 requests (3.7 triệu)
- ⚠️ 59.98% error rate (dự kiến)
- 🔥 Breaking point: ~2000 concurrent users
- 📈 Peak throughput: 3434 req/s

**Phân tích:**

```
 500 users: ✅ 0.01% error (rất tốt)
1000 users: ✅ 0.05% error (tốt)
1500 users: ⚠️ 5.23% error (bắt đầu có vấn đề)
2000 users: ❌ 28.47% error (BREAKING POINT)
2500 users: ❌ 52.91% error (quá tải)
3000 users: ❌ 78.34% error (nghiêm trọng)
```

---

#### Test 4: Spike Test - Traffic Đột Biến

```bash
k6 run spike-test.js
# hoặc: .\k6.exe run spike-test.js
```

**⚠️ CRITICAL WARNING:** Test này có thể **CRASH backend server**!

**Kết quả đã đạt được:**

- ⚠️ 661,113 requests
- ❌ 50.54% error rate
- 🔥 Backend CRASHED ở giây thứ 203
- ❌ Spike 3000 users → connection refused

**Chi tiết:**

```
Stage 1: 100 users (bình thường) ✅
Stage 2: 100→2000 trong 10s → 20% error ⚠️
Stage 3: Recovery về 100 users → OK ✅
Stage 4: 100→3000 trong 10s → Backend CRASH ❌
```

**Lưu ý:** Sau test này cần **restart backend server** trước khi chạy test tiếp!

### Bước 3: Xem Kết Quả

Kết quả sẽ hiển thị trên terminal và được lưu vào:

- `login-performance-results.json`
- `product-performance-results.json`
- `stress-test-results.json`
- `spike-test-results.json`

---

## 🔒 Chạy Kiểm Thử Bảo Mật

### Phương Pháp 1: JUnit Tests (Khuyên Dùng)

```bash
cd backend
mvn test -Dtest=SecurityTest
```

**Lệnh này sẽ chạy hơn 20 test cases bảo mật:**

- Kiểm thử SQL Injection
- Kiểm thử XSS
- Kiểm thử CSRF
- Kiểm thử vượt qua xác thực
- Kiểm thử validation đầu vào
- Kiểm thử bảo mật mật khẩu

**Kết quả mong đợi:**

```
Tests run: 23, Failures: 0, Errors: 0, Skipped: 0
```

### Phương Pháp 2: Kiểm Thử Thủ Công với File .http

#### Cách A: VS Code REST Client

1. Cài đặt extension "REST Client" trong VS Code
2. Mở các file `.http` trong `security-testing/vulnerability-tests/`
3. Click "Send Request" ở trên mỗi test

#### Cách B: Postman

1. Import các file `.http`
2. Chạy từng request thủ công
3. Kiểm tra kết quả trả về

#### Các File Test:

- `sql-injection-tests.http` - Các thử nghiệm tấn công SQL injection
- `xss-tests.http` - Kiểm thử Cross-site scripting
- `csrf-tests.http` - Kiểm thử bảo vệ CSRF
- `auth-bypass-tests.http` - Thử nghiệm vượt qua xác thực

---

## 📊 Hiểu Kết Quả Kiểm Thử

### Chỉ Số Kiểm Thử Hiệu Suất

**Hiệu Suất Tốt:**

- ✅ p(95) thời gian phản hồi < 500ms
- ✅ Tỷ lệ lỗi < 1%
- ✅ Throughput > 100 req/s

**Hiệu Suất Chấp Nhận Được:**

- ⚠️ p(95) thời gian phản hồi < 1000ms
- ⚠️ Tỷ lệ lỗi < 5%
- ⚠️ Throughput > 50 req/s

**Hiệu Suất Kém:**

- ❌ p(95) thời gian phản hồi > 1000ms
- ❌ Tỷ lệ lỗi > 5%
- ❌ Throughput < 50 req/s

### Kết Quả Kiểm Thử Bảo Mật

**Tiêu Chí Đạt (Pass):**

- ✅ SQL Injection: Bị từ chối (400/401)
- ✅ XSS: Đã được làm sạch hoặc escape
- ✅ Truy cập không xác thực: 401/403
- ✅ Đầu vào không hợp lệ: 400 Bad Request

**Tiêu Chí Không Đạt (Fail):**

- ❌ Mã độc được thực thi
- ❌ Truy cập trái phép được cấp
- ❌ Dữ liệu nhạy cảm bị rò rỉ
- ❌ Không có validation đầu vào

---

## 🐛 Khắc Phục Sự Cố

### Lỗi: k6 not found hoặc Access Denied khi cài

**Giải pháp 1: Tải trực tiếp (KHUYÊN DÙNG)**

```bash
# Tải k6 v0.48.0 cho Windows
curl -L https://github.com/grafana/k6/releases/download/v0.48.0/k6-v0.48.0-windows-amd64.zip -o k6.zip

# Giải nén
tar -xf k6.zip

# Copy vào thư mục performance-testing
move k6.exe performance-testing\

# Kiểm tra
cd performance-testing
.\k6.exe version
```

**Giải pháp 2: Chạy PowerShell với quyền Admin**

```bash
# Chuột phải PowerShell → Chạy với quyền Admin
choco install k6
```

**Giải pháp 3: Dùng npm**

```bash
npm install -g k6
```

### Lỗi: Backend không chạy

**Giải pháp:**

```bash
# Kiểm tra xem cổng 8080 có đang dùng không
netstat -an | grep 8080

# Khởi động backend
cd backend
mvn clean spring-boot:run
```

### Lỗi: Tests bị lỗi kết nối

**Giải pháp:**

- Đảm bảo backend đang chạy ở `http://localhost:8080`
- Kiểm tra cài đặt firewall
- Xác minh database H2 đã được khởi tạo

### Lỗ: JWT token hết hạn khi test thủ công

**Giải pháp:**

1. Chạy request đăng nhập trước:

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

2. Copy token từ response
3. Thay thế `YOUR_TOKEN_HERE` trong các file test khác

---

## 📈 Tạo Báo Cáo

### Báo Cáo Hiệu Suất

```bash
# Chạy với output JSON
k6 run --out json=results.json login-performance-test.js

# Chuyển sang HTML (tùy chọn)
k6 run --out influxdb=http://localhost:8086/k6 login-performance-test.js
```

### Báo Cáo Bảo Mật

```bash
# Tạo báo cáo JaCoCo với security tests
cd backend
mvn clean test jacoco:report

# Xem báo cáo
open target/site/jacoco/index.html
```

---

## 🎯 Khởi Động Nhanh (Tất Cả Tests)

Chạy tất cả cùng lúc:

```bash
# Terminal 1: Khởi động backend
cd backend
mvn spring-boot:run

# Terminal 2: Chạy tất cả performance tests
cd performance-testing
k6 run login-performance-test.js
k6 run product-performance-test.js
k6 run stress-test.js
k6 run spike-test.js

# Terminal 3: Chạy security tests
cd backend
mvn test -Dtest=SecurityTest
```

---

## 📚 Tài Liệu Tham Khảo

- Tài liệu k6: https://k6.io/docs/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Spring Security: https://spring.io/projects/spring-security

---

## ✅ Danh Sách Kiểm Tra

Trước khi nộp bài, đảm bảo:

- [ ] Backend chạy không có lỗi
- [ ] Tất cả performance tests hoàn thành thành công
- [ ] Tất cả 23 security tests đều pass
- [ ] Kết quả được ghi lại trong `BAO_CAO_MO_RONG.md`
- [ ] Screenshots kết quả test (tùy chọn)

---

**Cập nhật lần cuối:** 29/11/2025
