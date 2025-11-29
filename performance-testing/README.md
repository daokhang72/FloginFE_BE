# Kiểm Thử Hiệu Suất cho Ứng Dụng Flogin

## Giới Thiệu

Kiểm thử hiệu suất được thực hiện bằng **k6** - công cụ load testing hiện đại, mã nguồn mở và dễ sử dụng.

## Cài Đặt k6

### Windows (Chọn 1 trong 3 cách)

**Cách 1: Chocolatey (Cần quyền Admin)**

```bash
# Mở PowerShell/CMD với quyền Admin
choco install k6
```

**Cách 2: Download trực tiếp (KHUYÊN DÙNG - Không cần Admin)**

```bash
# Tải k6 từ GitHub
curl -L https://github.com/grafana/k6/releases/download/v0.48.0/k6-v0.48.0-windows-amd64.zip -o k6.zip

# Giải nén và chạy
tar -xf k6.zip
.\k6.exe version
```

**Cách 3: npm (Nếu đã cài Node.js)**

```bash
npm install -g k6
```

### Linux/macOS

```bash
# macOS
brew install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## 🎯 Kết Quả Tests Đã Chạy

### Tổng Quan Kết Quả

| Test             | Users | Requests  | Error Rate | Avg Response | Throughput | Status                  |
| ---------------- | ----- | --------- | ---------- | ------------ | ---------- | ----------------------- |
| **Login Load**   | 1000  | 144,185   | 0.00%      | 4.51ms       | 228 req/s  | ✅ PASS                 |
| **Product Load** | 1000  | 230,123   | 0.00%      | 5.30ms       | 364 req/s  | ✅ PASS                 |
| **Stress Test**  | 3000  | 3,710,420 | 59.98%     | 170ms        | 3434 req/s | ✅ Breaking point found |
| **Spike Test**   | 3000  | 661,113   | 50.54%     | 223ms        | 1944 req/s | ✅ Crash point found    |

### Key Findings

- ✅ **Safe Capacity:** 1000 concurrent users (0% error)
- ⚠️ **Breaking Point:** ~2000 users (30-60% error rate)
- ❌ **Crash Point:** 3000 user sudden spike (backend crash)
- 🚀 **Peak Throughput:** 3434 req/s before failure
- ⚡ **Response Time:** 4-5ms average under normal load

---

## Chạy Tests

**Lưu ý:** Đảm bảo backend đang chạy ở `http://localhost:8080` trước khi chạy tests!

### Bước 1: Chuẩn bị dữ liệu test (QUAN TRỌNG!)

Trước khi chạy performance test, cần tạo test users trong database:

```bash
cd performance-testing
k6 run setup-users.js
```

Output mong đợi:

```
🚀 Setting up test users...
✅ User 'user1' registered successfully
✅ User 'user2' registered successfully
✅ User 'admin' registered successfully
✅ Setup complete! You can now run: k6 run quick-test.js
```

**Lưu ý:** Nếu users đã tồn tại, bạn sẽ thấy message `ℹ️ User 'xxx' already exists` - đây là bình thường.

### Bước 2: Chạy Performance Tests

### 1. Kiểm Thử Hiệu Suất Login API

```bash
k6 run login-performance-test.js
# Hoặc nếu download k6.exe: .\k6.exe run login-performance-test.js
```

### 2. Kiểm Thử Hiệu Suất Product API

```bash
k6 run product-performance-test.js
```

### 3. Stress Test (Tìm Điểm Giới Hạn)

```bash
k6 run stress-test.js
```

### 4. Spike Test (Kiểm Tra Tăng Đột Ngột)

```bash
k6 run spike-test.js
```

## Kết Quả và Các Chỉ Số

Kết quả test sẽ hiển thị các chỉ số sau:

- **http_req_duration**: Thời gian phản hồi (response time)
- **http_req_failed**: Tỷ lệ request bị lỗi
- **iterations**: Số lượng lần lặp hoàn thành
- **vus**: Số người dùng ảo (Virtual users) đang chạy

## Cấu Trúc Các Kịch Bản Test

1. **Smoke Test**: 1-2 users trong 30 giây - kiểm tra cơ bản
2. **Load Test**: 100, 500, 1000 người dùng đồng thời
3. **Stress Test**: Tăng dần số users để tìm điểm giới hạn hệ thống
4. **Spike Test**: Tăng đột ngột số users để kiểm tra khả năng phục hồi
