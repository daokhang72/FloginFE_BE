# Hướng dẫn thêm ảnh Evidence cho Integration Testing

## Các ảnh cần chụp:

### 1. Frontend Login Integration Test Results

- **File:** `frontend_login_integration.png`
- **Nội dung:** Screenshot kết quả chạy `npm test src/tests/Login.integration.test.js`
- **Cần hiển thị:** 4 tests passed, test names, execution time

### 2. Frontend Product Integration Test Results

- **File:** `frontend_product_integration.png`
- **Nội dung:** Screenshot kết quả chạy `npm test src/tests/ProductForm.integration.test.js`
- **Cần hiển thị:** 4 tests passed, test names, execution time

### 3. Backend Auth Integration Test Results

- **File:** `backend_auth_integration.png`
- **Nội dung:** Screenshot kết quả chạy `mvn test -Dtest=AuthControllerIntegrationTest`
- **Cần hiển thị:** Tests run: 3, Failures: 0, BUILD SUCCESS

### 4. Backend Product Integration Test Results

- **File:** `backend_product_integration.png`
- **Nội dung:** Screenshot kết quả chạy `mvn test -Dtest=ProductControllerIntegrationTest`
- **Cần hiển thị:** Tests run: 5, Failures: 0, BUILD SUCCESS

## Lệnh để chạy tests:

### Frontend:

```bash
cd frontend
npm test src/tests/Login.integration.test.js -- --watchAll=false
npm test src/tests/ProductForm.integration.test.js -- --watchAll=false
```

### Backend:

```bash
cd backend
mvn test -Dtest=AuthControllerIntegrationTest
mvn test -Dtest=ProductControllerIntegrationTest
```

## Vị trí thêm ảnh vào LaTeX:

Sau mỗi phần "Kết quả chạy test:", thêm:

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{../bao_cao_integration_testing/images/ten_file_anh.png}
\caption{Kết quả Integration Tests}
\end{figure}
```
