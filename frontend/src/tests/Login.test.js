import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import { login } from '../services/api';
import { validateLoginForm } from '../utils/validate';

jest.mock('../services/api');

describe('Login Component', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('1. renders login form correctly', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('2. shows validation errors when fields are empty', async () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(button);

    expect(await screen.findByText('Username không được để trống')).toBeInTheDocument();
    expect(await screen.findByText('Password không được để trống')).toBeInTheDocument();
  });

  test('3. shows validation error for invalid username format (regex)', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'a!' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'validpass123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    const errorMsg = 'Username phải từ 3-50 ký tự và chỉ chứa a-z, A-Z, 0-9, -, ., _';
    expect(await screen.findByText(errorMsg)).toBeInTheDocument();
    
    expect(login).not.toHaveBeenCalled();
  });

  test('4. calls login API and shows success message on valid submission', async () => {
    const mockToken = 'fake-jwt-token-123';
    login.mockResolvedValue({ data: { token: mockToken } });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'ValidPass123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('✅ Đăng nhập thành công!')).toBeInTheDocument();

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith('validuser', 'ValidPass123');
    
    expect(screen.queryByText('Username không được để trống')).toBeNull();
  });

  test('5. shows API error message on login failure', async () => {
    login.mockRejectedValue(new Error('Sai mật khẩu'));

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass1' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('❌ Sai username hoặc password!')).toBeInTheDocument();
    
    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith('validuser', 'wrongpass1');
  });
});