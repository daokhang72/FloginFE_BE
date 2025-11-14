import React, { useState } from 'react';
import { validateLoginForm } from '../utils/validate';
import { login } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ text: '', type: '' });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: null }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setApiMessage({ text: '', type: '' });

    const validationErrors = validateLoginForm({ username, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await login(username, password);
        
        setApiMessage({ text: '✅ Đăng nhập thành công!', type: 'success' });
        console.log('Token:', response.token); 
        
        onLoginSuccess(response.token);
      } catch (error) {
        setApiMessage({ text: '❌ Sai username hoặc password!', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng nhập hệ thống</h2>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          aria-invalid={!!errors.username}
          aria-describedby="username-error"
          disabled={loading}
        />
        {errors.username && <p id="username-error" style={{ color: 'red' }}>{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          disabled={loading}
        />
        {errors.password && <p id="password-error" style={{ color: 'red' }}>{errors.password}</p>}
      </div>

      {apiMessage.text && (
        <p style={{ color: apiMessage.type === 'error' ? 'red' : 'green' }}>
          {apiMessage.text}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Login'}
      </button>
      
    </form>
  );
};

export default Login;