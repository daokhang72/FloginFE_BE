import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Component "Người gác cổng"
 * - Kiểm tra xem có 'token' trong localStorage không.
 * - Nếu có: Cho phép hiển thị {children} (tức là trang ProductPage, Dashboard...)
 * - Nếu không: Chuyển hướng người dùng về trang /login
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Người dùng chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" replace />;
  }

  // Người dùng đã đăng nhập, cho phép hiển thị trang
  return children;
}

export default ProtectedRoute;