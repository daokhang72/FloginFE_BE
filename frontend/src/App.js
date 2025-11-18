import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import các component
import Login from './components/Login/login';
import ProductPage from './components/Product/ProductPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Đã xóa Navbar ở đây */}
      
      <div className="main-content">
        <Routes>
          {/* Mặc định vào trang Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* Trang Sản phẩm được bảo vệ */}
          <Route 
            path="/product" 
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Đã xóa route Dashboard */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;