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
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoginMessage('');
    setIsSuccess(false);

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    try {
      const response = await authService.login({ username, password });

      setIsSuccess(true);
      setLoginMessage("Đăng nhập thành công! Đang chuyển hướng...");

      localStorage.setItem('token', response.data.token);

      setTimeout(() => {
        navigate('/product');
      }, 1200);

    } catch (error) {
      setIsSuccess(false);
      const apiError = error.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng.";
      setLoginMessage(apiError);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng Nhập</h2>

        {loginMessage && (
          <div className={`toast-message ${isSuccess ? '' : 'error'}`}>
            {loginMessage}
          </div>
        )}

        <div className="input-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? 'invalid' : ''}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'invalid' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="login-button">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
