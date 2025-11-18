import axios from 'axios';

// Tạo một 'instance' axios với cấu hình chung
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Trỏ đến API backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Cấu hình Interceptor (Rất quan trọng) ---
// Interceptor này sẽ tự động đính kèm Token vào *mọi* request
// nếu chúng ta đã đăng nhập.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== "null" && token !== "undefined") {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Định nghĩa các dịch vụ API ---

// 1. Dịch vụ Xác thực (Auth)
export const authService = {
  login: (loginRequest) => {
    return apiClient.post('/auth/login', loginRequest, {
    });
  },
  register: (registerRequest) => {
    return apiClient.post('/auth/register', registerRequest);
  },
  logout: () => {
    // Đăng xuất đơn giản là xóa token
    localStorage.removeItem('token');
  },
};

// 2. Dịch vụ Sản phẩm (Product)
export const productService = {
  getAll: () => {
    return apiClient.get('/products');
  },
  getById: (id) => {
    return apiClient.get(`/products/${id}`);
  },
  create: (productData) => {
return apiClient.post('/products', productData, {
        headers: { "Content-Type": undefined }
    });
  },
  update: (id, productData) => {
    return apiClient.put(`/products/${id}`, productData, {
        headers: { "Content-Type": undefined }
    });
  },
  delete: (id) => {
    return apiClient.delete(`/products/${id}`);
  },
};