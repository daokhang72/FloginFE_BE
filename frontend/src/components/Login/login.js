import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { authService } from '../../services/apiService';
import { validateUsername, validatePassword } from '../../utils/validation'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState('');
  // Thêm state để xác định loại thông báo (success/error)
  const [isSuccess, setIsSuccess] = useState(false); 

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoginMessage('');
    setIsSuccess(false);

    // 1. Validation
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
        setErrors({
          username: usernameError,
          password: passwordError,
        });
        return;
    }

    // 2. Gọi API
    try {
        const response = await authService.login({ username, password });
        
        // --- THÀNH CÔNG ---
        setIsSuccess(true); // Đánh dấu là thành công (để hiện màu xanh)
        setLoginMessage("Đăng nhập thành công! Đang chuyển hướng...");
        
        // Lưu token
        localStorage.setItem('token', response.data.token);
        
        // --- TRÌ HOÃN CHUYỂN TRANG (Để người dùng kịp đọc thông báo) ---
        setTimeout(() => {
            navigate('/product'); 
        }, 1500); // Chờ 1.5 giây

    } catch (error) {
        // --- THẤT BẠI ---
        setIsSuccess(false); // Đánh dấu là thất bại (để hiện màu đỏ)
        const apiError = error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
        setLoginMessage(apiError);
        // setErrors({ api: apiError }); // Không cần set vào errors object nữa nếu dùng toast
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng Nhập</h2>
        
        {/* --- HIỂN THỊ TOAST MESSAGE --- */}
        {loginMessage && (
          <div className={`toast-message ${isSuccess ? '' : 'error'}`}>
            {loginMessage}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
            className={errors.username ? 'invalid' : ''} 
          />
          {errors.username && (
            <span className="error-message" data-testid="username-error" style={{color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>
              {errors.username}
            </span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
            className={errors.password ? 'invalid' : ''}
          />
          {errors.password && (
            <span className="error-message" data-testid="password-error" style={{color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>
              {errors.password}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{width: '100%', marginTop: '10px'}}
          data-testid="login-button"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default Login;