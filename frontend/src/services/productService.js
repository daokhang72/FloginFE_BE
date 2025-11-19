// src/services/productService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default {
  getProducts: () => api.get('/products').then(res => res.data),
  addProduct: (product) => api.post('/products', product).then(res => res.data),
};