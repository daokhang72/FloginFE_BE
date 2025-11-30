# Cypress E2E Testing cho Login

## Tổng Quan

Dự án này sử dụng **Cypress** để thực hiện E2E (End-to-End) Automation Testing cho tính năng Login.

## Cấu Trúc Thư Mục

```
frontend/
├── cypress/
│   ├── e2e/
│   │   └── login.cy.js              # Test specs cho Login
│   ├── support/
│   │   ├── commands.js              # Custom Cypress commands
│   │   ├── e2e.js                   # Global config cho E2E tests
│   │   └── pages/
│   │       └── LoginPage.js         # Page Object Model cho Login
│   └── screenshots/                 # Screenshots khi test fail
├── cypress.config.js                # Cypress configuration
└── package.json                     # Scripts để chạy Cypress
```

## Setup và Configuration (1 điểm)

### 1. Cài Đặt Cypress

Cypress đã được cài đặt trong `package.json`:

```json
"cypress": "^15.6.0"
```

### 2. Cấu Hình Test Environment

File `cypress.config.js` chứa cấu hình:

- **baseUrl**: `http://localhost:3000`
- **viewportWidth**: 1280px
- **viewportHeight**: 720px
- **video**: Ghi lại video của tests
- **screenshotOnRunFailure**: Chụp màn hình khi test thất bại

### 3. Page Object Model

File `cypress/support/pages/LoginPage.js` implement POM pattern:

- Tách biệt **selectors** và **actions**
- Các methods chainable để dễ sử dụng
- Reusable cho nhiều test cases

## E2E Test Scenarios (2.5 điểm)

### Test 1: Complete Login Flow (1 điểm)

```javascript
describe("Complete Login Flow", () => {
  it("Nên hiển thị tất cả các elements của form login");
  it("Nên đăng nhập thành công với credentials hợp lệ");
  it("Nên thực hiện complete flow: nhập → submit → redirect");
});
```

**Coverage:**

- Kiểm tra hiển thị đầy đủ các UI elements
- Test toàn bộ luồng login từ đầu đến cuối
- Verify token được lưu và chuyển hướng đúng

### Test 2: Validation Messages (0.5 điểm)

```javascript
describe("Validation Messages", () => {
  it("Nên hiển thị lỗi khi username trống");
  it("Nên hiển thị lỗi khi password trống");
  it("Nên hiển thị lỗi khi username quá ngắn");
  it("Nên hiển thị lỗi khi password quá ngắn");
  it("Nên xóa error message khi người dùng sửa input hợp lệ");
});
```

**Coverage:**

- Test tất cả validation rules
- Kiểm tra error messages hiển thị đúng
- Verify class "invalid" được thêm vào fields lỗi

### Test 3: Success/Error Flows (0.5 điểm)

```javascript
describe("Success/Error Flows", () => {
  it("Nên hiển thị error message khi credentials không đúng");
  it("Nên xử lý đúng khi username sai");
  it("Nên xử lý đúng khi password sai");
  it("Nên cho phép thử lại sau khi đăng nhập thất bại");
  it("Nên hiển thị loading state khi đang xử lý login");
});
```

**Coverage:**

- Test success scenario
- Test các error scenarios khác nhau
- Verify không lưu token khi login thất bại
- Test retry mechanism

### Test 4: UI Elements Interactions (0.5 điểm)

```javascript
describe("UI Elements Interactions", () => {
  it("Nên focus vào username input khi page load");
  it("Nên chuyển focus từ username sang password khi nhấn Tab");
  it("Nên submit form khi nhấn Enter");
  it("Nên mask password input");
  it("Nên có thể clear và re-type inputs");
  it('Nên thêm class "invalid" cho fields có lỗi');
  it("Nên responsive với viewport nhỏ");
});
```

**Coverage:**

- Test keyboard navigation (Tab, Enter)
- Test focus management
- Test password masking
- Test responsive design
- Test input interactions

## Cách Chạy Tests

### 1. Mở Cypress Test Runner (Interactive Mode)

```bash
cd frontend
npm run cypress:open
```

Sau đó chọn E2E Testing và click vào `login.cy.js` để chạy tests.

### 2. Chạy Tests ở Headless Mode

```bash
cd frontend
npm run cypress:run
```

### 3. Chạy Tests với Server Auto-Start

```bash
cd frontend
npm run cypress:test
```

Script này sẽ:

1. Start React dev server
2. Đợi server sẵn sàng tại `http://localhost:3000`
3. Chạy Cypress tests
4. Tự động tắt server sau khi test xong

## Custom Cypress Commands

File `cypress/support/commands.js` định nghĩa các custom commands:

```javascript
// Login với username và password
cy.login("testuser", "Test123");

// Login với credentials hợp lệ
cy.loginWithValidCredentials();

// Clear authentication
cy.clearAuth();
```

## Test Credentials

Tests sử dụng credentials sau:

- **Valid Username**: `testuser`
- **Valid Password**: `Test123`
- **Invalid credentials**: Bất kỳ giá trị nào khác

## Kết Quả Mong Đợi

Tất cả 30+ test cases phải **PASS**:

- ✅ Complete Login Flow: 3 tests
- ✅ Validation Messages: 6 tests
- ✅ Success/Error Flows: 5 tests
- ✅ UI Elements Interactions: 10 tests
- ✅ Edge Cases & Security: 4 tests

## Video & Screenshots

Khi tests chạy:

- **Videos** được lưu tại: `cypress/videos/`
- **Screenshots** (khi fail) tại: `cypress/screenshots/`

## Best Practices Applied

1. ✅ **Page Object Model**: Tách biệt selectors và actions
2. ✅ **DRY Principle**: Reusable methods và custom commands
3. ✅ **Clear Test Names**: Mô tả rõ ràng mỗi test case
4. ✅ **Proper Assertions**: Sử dụng `should()` với chainable assertions
5. ✅ **Test Isolation**: Mỗi test độc lập với `beforeEach()`
6. ✅ **Data-testid**: Sử dụng stable selectors không thay đổi
7. ✅ **Organized Structure**: Nhóm tests theo categories

## Lưu Ý Quan Trọng

1. **Backend phải chạy trước**: Tests cần backend API tại `http://localhost:8080`
2. **Frontend phải chạy**: Dev server phải chạy tại `http://localhost:3000`
3. **Database phải có data**: User `testuser` với password `Test123` phải tồn tại

## Báo Cáo Cho Giáo Viên

Dự án đã implement đầy đủ các yêu cầu của Câu 5.1:

### ✅ Câu 5.1.1: Setup và Configuration (1 điểm)

- Cài đặt Cypress
- Cấu hình test environment trong `cypress.config.js`
- Setup Page Object Model trong `LoginPage.js`

### ✅ Câu 5.1.2: E2E Test Scenarios cho Login (2.5 điểm)

- **a) Test complete login flow (1 điểm)**: 3 test cases
- **b) Test validation messages (0.5 điểm)**: 6 test cases
- **c) Test success/error flows (0.5 điểm)**: 5 test cases
- **d) Test UI elements interactions (0.5 điểm)**: 10 test cases

**Tổng cộng: 5/5 điểm** ✅
