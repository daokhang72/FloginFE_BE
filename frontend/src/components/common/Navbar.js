import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. THÊM useNavigate
import { authService } from '../../services/apiService'; // 2. THÊM authService
import './Navbar.css'; 

function Navbar() {
  const navigate = useNavigate(); // 3. KHỞI TẠO navigate

  // 4. TẠO HÀM ĐĂNG XUẤT
  const handleLogout = () => {
    authService.logout(); // Gọi hàm xóa token
    navigate('/login');   // Chuyển người dùng về trang login
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">F-Login App</Link>
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/login" className="nav-link">Đăng Nhập</Link>
        </li>
        <li className="nav-item">
          <Link to="/product" className="nav-link">Sản Phẩm</Link>
        </li>
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </li>
        
        {/* 5. THÊM NÚT ĐĂNG XUẤT */}
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link-button">
            Đăng xuất
          </button>
        </li>

      </ul>
    </nav>
  );
}

export default Navbar;