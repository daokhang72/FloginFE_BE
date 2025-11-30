# README – Hướng dẫn chạy Test cho Câu 5 (Automation Testing & CI/CD)

## 1. Chuẩn bị môi trường
- Node.js >= 18
- npm >= 9
- Java >= 17
- Maven >= 3.9
- GitHub repository nếu dùng CI/CD

---

## 2. Chạy Cypress – E2E Testing

### 2.1 Cài đặt và mở Cypress
```bash
cd frontend
npm install cypress --save-dev
npx cypress open
```

Chọn:
- **E2E Testing**
- Chọn trình duyệt (Chrome/Electron)
- Chạy test:
  - `login.e2e.spec.js`
  - `product.e2e.spec.js`

### 2.2 Chạy headless (dùng cho CI/CD)
```bash
npx cypress run
```

---

## 3. Chạy Jest – Frontend Unit & Integration Tests

### 3.1 Chạy toàn bộ test
```bash
npm test
```

### 3.2 Chạy test kèm coverage
```bash
npm test -- --coverage
```

Báo cáo coverage:
```
frontend/coverage/lcov-report/index.html
```

---

## 4. Backend Test – JUnit + Mockito

### 4.1 Chạy toàn bộ test backend
```bash
cd backend
mvn clean test
```

### 4.2 Chạy riêng từng file test
```bash
mvn -Dtest=AuthServiceTest test
mvn -Dtest=ProductServiceTest test
```

---

## 5. JaCoCo Coverage (Backend)
```bash
mvn clean test
mvn jacoco:report
```

Báo cáo:
```
backend/target/site/jacoco/index.html
```

---

## 6. CI/CD – GitHub Actions

Pipeline tự động chạy khi **push** hoặc **pull request**.

Gồm 3 job:
- Frontend Jest
- Cypress E2E
- Backend Maven test

Workflow file:
```
.github/workflows/ci.yml
```

---

## 7. Cheat Sheet – Lệnh nhanh

| Test | Lệnh |
|------|------|
| Cypress UI | `npx cypress open` |
| Cypress headless | `npx cypress run` |
| Jest test | `npm test` |
| Jest coverage | `npm test -- --coverage` |
| Maven test | `mvn clean test` |
| JaCoCo report | `mvn jacoco:report` |

---

## 8. Kết luận
README này cung cấp đầy đủ hướng dẫn để chạy:
- Cypress E2E
- Jest Unit Test
- JUnit Backend Test
- Coverage Reports
- CI/CD pipeline

Bạn có thể đính README này vào thư mục `docs/` hoặc gốc project.
