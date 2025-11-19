// src/services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
};