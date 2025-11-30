# Hướng dẫn chạy Unit Tests - Mock Testing
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

**Mock Test Login:**

```bash
npm test src/tests/MockTest_login.test.js
```

**Mock Test Product:**

```bash
npm test src/tests/MockTest_product.test.js
```

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

**Mock Test AuthController:**

```bash
mvn test -Dtest=AuthControllerTest
```

**Mock Test ProductService:**

```bash
mvn test -Dtest=ProductServiceMockTest
```

---

## 📚 Tài liệu tham khảo

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/)
- [LaTeX Documentation](https://www.latex-project.org/help/documentation/)

---

**Last Updated:** November 29, 2025
