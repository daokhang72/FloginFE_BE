# HƯỚNG DẪN CHẠY CÂU 5: AUTOMATION TESTING VÀ CI/CD

## 📋 Tổng Quan

Document này hướng dẫn chi tiết cách chạy các tests cho **Câu 5: Automation Testing và CI/CD**.

Hiện tại đã hoàn thành:

- ✅ **Câu 5.1**: Login - E2E Automation Testing (5 điểm)
- ✅ **Câu 6.1.3**: CI/CD Integration cho Login Tests (1.5 điểm)

---

## 🎯 Câu 5.1: Login E2E Automation Testing

### Công Nghệ Sử Dụng

- **Framework**: Cypress 15.6.0
- **Pattern**: Page Object Model (POM)
- **Reporter**: Mochawesome
- **Test Coverage**: 27 test cases

### Cấu Trúc Files

```
frontend/
├── cypress/
│   ├── e2e/
│   │   └── login.cy.js              # 27 test cases cho Login
│   ├── support/
│   │   ├── commands.js              # Custom Cypress commands
│   │   ├── e2e.js                   # Global config
│   │   └── pages/
│   │       └── LoginPage.js         # Page Object Model
│   ├── reports/                     # HTML/JSON reports
│   ├── videos/                      # Test execution videos
│   └── screenshots/                 # Screenshots khi test fail
├── cypress.config.js                # Cypress configuration
└── package.json                     # Scripts và dependencies
```

---

## 🚀 Cách Chạy Tests

### Bước 1: Chuẩn Bị Môi Trường

#### 1.1. Cài Đặt Dependencies

```bash
cd frontend
npm install
```

Dependencies quan trọng:

- `cypress@^15.6.0`
- `mochawesome@^7.1.3`
- `mochawesome-merge@^4.3.0`
- `mochawesome-report-generator@^6.2.0`
- `start-server-and-test@^2.1.3`

#### 1.2. Chuẩn Bị Database

Đảm bảo database có user test:

- **Username**: `testuser`
- **Password**: `Test123`

```sql
-- Nếu chưa có, tạo user test:
INSERT INTO users (username, password)
VALUES ('testuser', '$2a$10$...');  -- password đã hash
```

### Bước 2: Start Backend

Mở terminal thứ nhất:

```bash
cd backend
./mvnw spring-boot:run
```

Hoặc trên Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

Đợi backend khởi động xong (port 8080).

### Bước 3: Chạy Cypress Tests

#### **Phương Án 1: Interactive Mode (Khuyến Nghị Cho Development)**

Mở terminal thứ hai:

```bash
cd frontend
npm start
```

Đợi frontend chạy xong (port 3000), sau đó mở terminal thứ ba:

```bash
cd frontend
npm run cypress:open
```

Cypress Test Runner sẽ mở:

1. Chọn **E2E Testing**
2. Chọn browser (Chrome/Edge/Firefox)
3. Click vào file `login.cy.js`
4. Xem tests chạy real-time

#### **Phương Án 2: Headless Mode (Chạy Nhanh)**

Nếu frontend đã chạy ở terminal khác:

```bash
cd frontend
npm run cypress:run
```

#### **Phương Án 3: Tự Động (All-in-One)**

Chạy một lệnh duy nhất (tự động start frontend + run tests):

```bash
cd frontend
npm run cypress:test
```

Script này sẽ:

1. ✅ Tự động start React dev server
2. ✅ Đợi server sẵn sàng tại `http://localhost:3000`
3. ✅ Chạy tất cả Cypress tests
4. ✅ Tự động tắt server sau khi xong

#### **Phương Án 4: Với HTML Reports**

```bash
cd frontend
npm run cypress:report
```

Sau khi chạy xong, mở report:

```bash
# Windows
start cypress/reports/mochawesome.html

# Mac/Linux
open cypress/reports/mochawesome.html
```

---

## 📊 Test Cases Chi Tiết

### 1. Complete Login Flow (3 tests)

- ✅ Hiển thị tất cả elements của form login
- ✅ Đăng nhập thành công với credentials hợp lệ
- ✅ Complete flow: nhập → submit → redirect

### 2. Validation Messages (6 tests)

- ✅ Hiển thị lỗi khi username trống
- ✅ Hiển thị lỗi khi password trống
- ✅ Hiển thị lỗi khi cả hai trống
- ✅ Hiển thị lỗi khi username quá ngắn (< 3 ký tự)
- ✅ Hiển thị lỗi khi password quá ngắn (< 6 ký tự)
- ✅ Xóa error message khi người dùng sửa input hợp lệ

### 3. Success/Error Flows (5 tests)

- ✅ Hiển thị error message khi credentials không đúng
- ✅ Xử lý đúng khi username sai
- ✅ Xử lý đúng khi password sai
- ✅ Cho phép thử lại sau khi đăng nhập thất bại
- ✅ Hiển thị loading state khi đang xử lý login

### 4. UI Elements Interactions (10 tests)

- ✅ Focus vào username input khi page load
- ✅ Chuyển focus từ username sang password
- ✅ Submit form khi nhấn Enter ở username field
- ✅ Submit form khi nhấn Enter ở password field
- ✅ Mask password input
- ✅ Có thể clear và re-type inputs
- ✅ Thêm class 'invalid' cho fields có lỗi
- ✅ Có thể click vào button nhiều lần
- ✅ Responsive với viewport nhỏ

### 5. Edge Cases & Security (4 tests)

- ✅ Xử lý special characters trong username
- ✅ Xử lý spaces trong inputs
- ✅ Prevent multiple submissions
- ✅ Clear old error messages khi submit lại

---

## 🎨 Custom Cypress Commands

File: `cypress/support/commands.js`

### 1. Login Command

```javascript
cy.login("testuser", "Test123");
```

### 2. Login With Valid Credentials

```javascript
cy.loginWithValidCredentials();
```

### 3. Clear Authentication

```javascript
cy.clearAuth();
```

---

## 📐 Page Object Model

File: `cypress/support/pages/LoginPage.js`

### Selectors

```javascript
const loginPage = new LoginPage();
loginPage.selectors.usernameInput;
loginPage.selectors.passwordInput;
loginPage.selectors.loginButton;
```

### Actions

```javascript
loginPage.visit();
loginPage.typeUsername("testuser");
loginPage.typePassword("Test123");
loginPage.clickLoginButton();
loginPage.login("testuser", "Test123");
```

### Assertions

```javascript
loginPage.checkUsernameError("Tên đăng nhập không được để trống");
loginPage.checkPasswordError("Mật khẩu không được để trống");
loginPage.checkSuccessMessage("thành công");
loginPage.checkRedirectToProduct();
loginPage.checkTokenSaved();
```

---

## 🔧 Troubleshooting

### Lỗi: Backend không kết nối được

```
CypressError: cy.visit() failed trying to load: http://localhost:3000
```

**Giải pháp:**

1. Kiểm tra backend đã chạy chưa: `http://localhost:8080`
2. Kiểm tra database connection
3. Verify user `testuser` tồn tại trong DB

### Lỗi: Frontend không start

```
Error: EADDRINUSE: address already in use :::3000
```

**Giải pháp:**

```bash
# Kill process đang dùng port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Lỗi: Tests fail do validation message không khớp

**Giải pháp:**

- Kiểm tra file `src/utils/validation.js`
- Đảm bảo error messages khớp với tests
- Hiện tại sử dụng: "không được để trống" thay vì "Vui lòng nhập"

### Lỗi: Module not found

```
Error: Cannot find module 'mochawesome'
```

**Giải pháp:**

```bash
cd frontend
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

---

## 📈 Xem Kết Quả

### 1. Terminal Output

```
✔ All specs passed!
Duration: 36 seconds
Tests:    27
Passing:  27
Failing:  0
```

### 2. HTML Report

Location: `frontend/cypress/reports/mochawesome.html`

Mở bằng browser để xem:

- Interactive test results
- Charts và statistics
- Test duration
- Screenshots (nếu có test fail)

### 3. Videos

Location: `frontend/cypress/videos/login.cy.js.mp4`

Xem lại toàn bộ quá trình test execution.

### 4. Screenshots

Location: `frontend/cypress/screenshots/`

Ảnh chụp màn hình khi tests fail (để debug).

---

## 🤖 CI/CD Integration (Câu 6.1.3)

### GitHub Actions Workflow

File: `.github/workflows/login-tests.yml`

### Trigger

- Push lên branch `main` hoặc `develop`
- Pull request vào branch `main`

### Workflow Steps

1. ✅ Checkout code
2. ✅ Setup Node.js 18 + Java 17
3. ✅ Setup MySQL 8.0 service
4. ✅ Install dependencies
5. ✅ Start backend server
6. ✅ Run Login Unit Tests
7. ✅ Run Login E2E Tests
8. ✅ Generate test reports
9. ✅ Upload artifacts (videos, screenshots, reports)

### Xem Kết Quả CI/CD

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Chọn workflow run mới nhất
4. Xem logs và download artifacts

---

## 📝 NPM Scripts Reference

```json
{
  "cypress:open": "cypress open", // Mở Test Runner (interactive)
  "cypress:run": "cypress run", // Chạy headless
  "cypress:test": "start-server-and-test start http://localhost:3000 cypress:run",
  "cypress:report": "cypress run --reporter mochawesome",
  "cypress:merge": "mochawesome-merge cypress/reports/*.json > cypress/reports/combined-report.json",
  "cypress:generate": "marge cypress/reports/combined-report.json -f index -o cypress/reports/html"
}
```

---

## ✅ Checklist Trước Khi Chạy Tests

- [ ] Backend đã chạy tại `http://localhost:8080`
- [ ] Database có user `testuser` / `Test123`
- [ ] Frontend dependencies đã install (`npm install`)
- [ ] Port 3000 không bị chiếm dụng
- [ ] Cypress đã được cài đặt

---

## 🎯 Best Practices

1. ✅ **Isolation**: Mỗi test độc lập, không phụ thuộc lẫn nhau
2. ✅ **Clear Data**: `beforeEach` clear localStorage
3. ✅ **Page Object Model**: Tách biệt selectors và actions
4. ✅ **Data-testid**: Sử dụng stable selectors
5. ✅ **Custom Commands**: Reuse common actions
6. ✅ **Meaningful Names**: Test names mô tả rõ ràng
7. ✅ **Wait Properly**: Sử dụng `cy.wait()` khi cần thiết
8. ✅ **Assertions**: Verify expected behavior

---

## 📚 Tài Liệu Tham Khảo

- [Cypress Documentation](https://docs.cypress.io)
- [Mochawesome Reporter](https://github.com/adamgruber/mochawesome)
- [GitHub Actions](https://docs.github.com/en/actions)
- File README chi tiết: `frontend/cypress/README.md`
- CI/CD Guide: `.github/workflows/README.md`

---

## 🚧 Tiếp Theo: Product Tests

Câu tiếp theo sẽ làm tương tự cho **Product Page**:

- Product E2E Tests
- CRUD operations testing
- CI/CD integration cho Product

---

## 📞 Liên Hệ & Support

Nếu gặp vấn đề, kiểm tra:

1. Terminal logs
2. Cypress screenshots/videos
3. Browser console
4. Backend logs

**Prepared by**: GitHub Copilot  
**Date**: November 30, 2025  
**Status**: ✅ COMPLETED - Login Tests
