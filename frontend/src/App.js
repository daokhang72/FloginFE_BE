import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Product from './components/Product';

function App() {
  // 1. Kiểm tra localStorage khi bắt đầu
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Hàm này được truyền cho Login.js
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken); // Lưu token
    setToken(newToken);
  };

  // Hàm này được truyền cho Product.js
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    setToken(null);
  };

  return (
    <div className="App">
      {/* 2. Dùng 'token' (thay vì isLoggedIn) để quyết định */}
      {!token ? (
        <>
          <h2>Đăng nhập hệ thống</h2>
          {/* 3. Truyền hàm handleLoginSuccess */}
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      ) : (
        <>
          <h2>Quản lý sản phẩm</h2>
          {/* 4. Truyền hàm handleLogout */}
          <Product onLogout={handleLogout} />
        </>
      )}
    </div>
  );
}

export default App;