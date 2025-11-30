# CI/CD Integration cho Login Tests

## Tổng Quan

GitHub Actions workflow tự động chạy Login tests (Unit Tests + E2E Tests) khi có code changes.

## Workflow Configuration

File: `.github/workflows/login-tests.yml`

### Trigger Events

Workflow được kích hoạt khi:

- **Push** code lên branches: `main`, `develop`
- **Pull Request** vào branch: `main`

### Jobs & Steps

#### 1. Setup Environment

- ✅ Checkout code
- ✅ Setup Node.js 18
- ✅ Setup Java 17 (cho Backend)
- ✅ Setup MySQL 8.0 (database service)

#### 2. Install Dependencies

```bash
cd frontend
npm install
```

#### 3. Start Backend Server

```bash
cd backend
./mvnw spring-boot:run &
sleep 30
```

Backend chạy ở background với:

- MySQL: `localhost:3306`
- Spring Boot: `localhost:8080`

#### 4. Run Login Unit Tests

```bash
cd frontend
npm test -- --testPathPattern=Login
```

Test file: `src/components/Login/__tests__/login.test.js`

#### 5. Run Login E2E Tests

```bash
cd frontend
npm run cypress:run -- --spec "cypress/e2e/login.cy.js"
```

Test file: `cypress/e2e/login.cy.js`

#### 6. Generate Test Report

Tự động upload artifacts:

- 📹 **Videos**: `cypress/videos/`
- 📸 **Screenshots**: `cypress/screenshots/`
- 📊 **Reports**: `cypress/reports/`

#### 7. Publish Test Results

Sử dụng `dorny/test-reporter` để hiển thị kết quả trong GitHub Actions UI.

## Test Reports

### Mochawesome Reporter

Cypress sử dụng Mochawesome để generate HTML reports:

```javascript
reporter: "mochawesome",
reporterOptions: {
  reportDir: "cypress/reports",
  overwrite: false,
  html: true,
  json: true,
  charts: true,
  reportPageTitle: "Login E2E Test Report",
  embeddedScreenshots: true,
  inlineAssets: true,
}
```

### Report Features

- ✅ **HTML Report**: Interactive test results
- ✅ **JSON Report**: Machine-readable format
- ✅ **Charts**: Visual test statistics
- ✅ **Screenshots**: Embedded failure screenshots
- ✅ **Videos**: Test execution recordings

## Cách Xem Test Reports

### Trong GitHub Actions

1. Vào tab **Actions** trong repository
2. Click vào workflow run
3. Scroll xuống **Artifacts** section
4. Download `cypress-results.zip`
5. Extract và mở file HTML report

### Local Testing

Chạy tests với report generation:

```bash
cd frontend
npm run cypress:report
```

Report được tạo tại: `frontend/cypress/reports/`

## Workflow Status Badge

Thêm badge vào README.md:

```markdown
![Login Tests CI](https://github.com/daokhang72/FloginFE_BE/workflows/Login%20Tests%20CI/badge.svg)
```

## Environment Variables

Workflow sử dụng các biến môi trường:

```yaml
env:
  SPRING_DATASOURCE_URL: jdbc:mysql://localhost:3306/flogin_project_db
  SPRING_DATASOURCE_USERNAME: root
  SPRING_DATASOURCE_PASSWORD: root
```

## Troubleshooting

### Backend không start

- Kiểm tra MySQL service đã chạy chưa
- Tăng sleep time trong step "Start Backend Server"

### Frontend tests fail

- Đảm bảo backend đã ready (port 8080)
- Kiểm tra database có user `testuser` / `Test123`

### Reports không generate

- Cài đặt dependencies: `npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator`
- Kiểm tra cypress.config.js có đúng reporter config

## Dependencies Required

Thêm vào `package.json`:

```json
{
  "devDependencies": {
    "cypress": "^15.6.0",
    "mochawesome": "^7.1.3",
    "mochawesome-merge": "^4.3.0",
    "mochawesome-report-generator": "^6.2.0"
  }
}
```

## Best Practices

1. ✅ **Always run tests on push**: Catch issues early
2. ✅ **Keep artifacts**: Debug failures with videos/screenshots
3. ✅ **Parallel testing**: Use matrix strategy for multiple browsers
4. ✅ **Cache dependencies**: Speed up workflow with npm cache
5. ✅ **Notify on failures**: Setup Slack/email notifications

## Báo Cáo Cho Giáo Viên

### ✅ Câu 6.1.3: CI/CD Integration cho Login Tests (1.5 điểm)

Đã implement đầy đủ:

1. ✅ **Tạo GitHub Actions workflow** (0.5 điểm)

   - File: `.github/workflows/login-tests.yml`
   - Triggers: push, pull_request
   - Multi-step job với backend + frontend

2. ✅ **Run login tests automatically** (0.5 điểm)

   - Unit tests: `npm test -- --testPathPattern=Login`
   - E2E tests: `npm run cypress:run`
   - Auto-start backend và frontend

3. ✅ **Generate test reports** (0.5 điểm)
   - Mochawesome HTML reports
   - Screenshots on failure
   - Videos của test execution
   - Upload artifacts to GitHub Actions

**TỔNG: 1.5/1.5 ĐIỂM** ✅

## Next Steps

- Thêm test coverage reporting
- Setup notifications (Slack, email)
- Add performance testing
- Deploy preview environments
