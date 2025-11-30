# Hướng dẫn Capture Screenshots cho Báo cáo Automation Testing

## Các hình cần chụp:

### 1. login_e2e_results.png

- Chạy: `cd frontend && npm run cypress:run -- --spec "cypress/e2e/login.cy.js"`
- Chụp terminal output hiển thị: **27 passing tests**
- Hoặc mở file: `frontend/cypress/reports/mochawesome.html` và chụp phần summary

### 2. product_e2e_results.png

- Chạy: `cd frontend && npm run cypress:run -- --spec "cypress/e2e/product.cy.js"`
- Chụp terminal output hiển thị: **31 passing tests**
- Hoặc mở file: `frontend/cypress/reports/mochawesome.html` và chụp phần summary

### 3. mochawesome_report.png

- Mở file: `frontend/cypress/reports/mochawesome.html` trong browser
- Chụp toàn bộ report với charts và test results

### 4. github_actions_workflow.png

- Vào GitHub repository → Actions tab
- Chọn workflow run thành công
- Chụp màn hình hiển thị tất cả steps đều passed (✓)

### 5. e2e_tests_summary.png

- Chụp terminal output hoặc GitHub Actions summary
- Hiển thị: Total 58 tests (27 Login + 31 Product) - All passed

## Lệnh chạy tests:

```bash
# Chạy tất cả E2E tests
cd frontend
npm run cypress:run

# Chỉ Login tests
npm run cypress:run -- --spec "cypress/e2e/login.cy.js"

# Chỉ Product tests
npm run cypress:run -- --spec "cypress/e2e/product.cy.js"

# Mở Cypress UI (interactive mode)
npm run cypress:open
```

## Chú ý:

- Backend phải đang chạy trên port 8080
- Frontend phải đang chạy trên port 3000
- Database MySQL phải có sẵn dữ liệu test
