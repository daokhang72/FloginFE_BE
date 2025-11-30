// src/services/productService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default {
  getProducts: () => api.get('/products').then(res => res.data),
  getProductById: (id) => api.get(`/products/${id}`).then(res => res.data),
  addProduct: (productFormData) => api.post('/products', productFormData).then(res => res.data),
  updateProduct: (id, productFormData) => api.put(`/products/${id}`, productFormData).then(res => res.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then(res => res.data),
};
