# Hướng dẫn chạy Unit Tests và Coverage Reports

## 📋 Mục lục

- [Frontend Tests](#frontend-tests)
- [Backend Tests](#backend-tests)
- [Coverage Reports](#coverage-reports)
- [Compile LaTeX Report](#compile-latex-report)

---

## 🎨 Frontend Tests

### Yêu cầu

- Node.js >= 16.x
- npm >= 8.x

### Cài đặt dependencies

```bash
cd frontend
npm install
```

### Chạy tất cả tests

```bash
npm test
```

### Chạy test cụ thể

**Login Validation Tests:**

```bash
npm test src/tests/validation.test.js
```

**Product Validation Tests:**

```bash
npm test src/tests/productValidation.test.js
```

### Chạy tests với coverage

```bash
npm test -- --coverage --watchAll=false
```

### Xem Coverage Report

```bash
# Mở file HTML coverage report
open frontend/coverage/lcov-report/index.html
# Hoặc trên Windows:
start frontend/coverage/lcov-report/index.html
```

**Kết quả mong đợi:**

- ✅ validation.js: 100% coverage
- ✅ productValidation.js: ~97% coverage
- ✅ Overall: ~98% coverage

---

## ☕ Backend Tests

### Yêu cầu

- Java 21
- Maven 3.8+

### Chạy tất cả tests

```bash
cd backend
mvn test
```

### Chạy test cụ thể

**AuthService Tests:**

```bash
mvn test -Dtest=AuthServiceTest
```

**ProductService Tests:**

```bash
mvn test -Dtest=ProductServiceTest
```

### Chạy tests với JaCoCo Coverage

```bash
mvn clean test jacoco:report
```

### Xem JaCoCo Coverage Report

```bash
# Mở file HTML coverage report
open backend/target/site/jacoco/index.html
# Hoặc trên Windows:
start backend/target/site/jacoco/index.html
```

**Kết quả mong đợi:**

- ✅ AuthService: 100% Instructions, 100% Branches
- ✅ ProductService: 95% Instructions, 87% Branches
- ✅ Overall: 87% Instructions, 90% Branches

---

## 📊 Coverage Reports

### Frontend Coverage Structure

```
frontend/coverage/
├── lcov-report/
│   ├── index.html          # Main coverage report
│   ├── validation.js.html  # Detailed validation coverage
│   └── productValidation.js.html
├── coverage-final.json
└── lcov.info
```

### Backend Coverage Structure

```
backend/target/site/jacoco/
├── index.html              # Main coverage report
├── com.flogin.service/     # Service package coverage
│   ├── AuthService.html
│   └── ProductService.html
├── jacoco.csv              # CSV format
└── jacoco.xml              # XML format
```

---

## 📝 Compile LaTeX Report

### Yêu cầu

- MiKTeX hoặc TeX Live
- pdflatex

### Compile báo cáo

```bash
cd /path/to/FloginFE_BE
pdflatex -interaction=nonstopmode BaoCao_UnitTesting_TDD.tex
```

### Compile 2 lần (nếu có references)

```bash
pdflatex BaoCao_UnitTesting_TDD.tex
pdflatex BaoCao_UnitTesting_TDD.tex
```

**Output:** `BaoCao_UnitTesting_TDD.pdf`

---

## 🖼️ Screenshots cho Báo cáo

### Chụp ảnh Coverage Reports

1. **Frontend Coverage:**

   ```bash
   npm test -- --coverage --watchAll=false
   ```

   Chụp ảnh từ terminal hoặc mở `frontend/coverage/lcov-report/index.html`

2. **Backend Coverage:**

   ```bash
   mvn clean test jacoco:report
   ```

   Mở `backend/target/site/jacoco/index.html` và chụp ảnh

3. **Lưu ảnh vào thư mục:**
   ```
   images/
   ├── login_validation_frontend.png
   ├── auth_service_backend.png
   ├── product_validation_frontend.png
   ├── product_service_backend.png
   ├── frontend_coverage.png
   └── backend_coverage.png
   ```

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** Tests không chạy

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Coverage không hiển thị

```bash
# Xóa cache Jest
npm test -- --clearCache
```

### Backend Issues

**Problem:** Maven không tìm thấy JDK

```bash
# Set JAVA_HOME
export JAVA_HOME=/path/to/jdk-21
# Windows:
set JAVA_HOME=C:\Path\To\jdk-21
```

**Problem:** Tests fail do database

- Đảm bảo H2 database được cấu hình đúng trong `application-test.properties`
- Check logs tại `backend/target/surefire-reports/`

### LaTeX Issues

**Problem:** pdflatex not found

```bash
# Cài MiKTeX (Windows)
# Download từ: https://miktex.org/download

# Hoặc TeX Live (Linux/Mac)
sudo apt-get install texlive-full  # Ubuntu/Debian
brew install --cask mactex          # macOS
```

**Problem:** Missing images

- Đảm bảo tất cả ảnh có trong thư mục `images/`
- Check đường dẫn trong file `.tex`

---

## 📈 Test Coverage Goals

| Module                      | Target | Current   |
| --------------------------- | ------ | --------- |
| Frontend Validation         | ≥90%   | 100% ✅   |
| Frontend Product Validation | ≥90%   | 96.77% ✅ |
| Backend AuthService         | ≥85%   | 100% ✅   |
| Backend ProductService      | ≥85%   | 95% ✅    |

---

## 📚 Tài liệu tham khảo

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/)
- [LaTeX Documentation](https://www.latex-project.org/help/documentation/)

---

**Last Updated:** November 29, 2025
