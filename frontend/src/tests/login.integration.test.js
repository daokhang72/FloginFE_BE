// frontend/src/tests/login.integration.test.js
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import Login from '../components/Login/login';

// ---- MOCK react-router-dom để không navigate thật ----
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---- MOCK apiService KHÔNG import axios thật ----
const mockLogin = jest.fn();
jest.mock('../services/apiService', () => ({
  authService: {
    login: (...args) => mockLogin(...args),
  },
}));

// reset mock trước mỗi test
beforeEach(() => {
  jest.useRealTimers(); // reset timers
  mockLogin.mockReset();
  mockNavigate.mockReset();
  localStorage.clear();
});

describe('Login Component Integration Tests', () => {
  // a) Test rendering và user interactions (2 điểm)
  test('render đúng các field và cho phép nhập liệu', () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'user123' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });

    expect(usernameInput).toHaveValue('user123');
    expect(passwordInput).toHaveValue('pass123');
  });

  // a) + c) Validation phía FE
  test('hiển thị lỗi khi submit form rỗng', async () => {
    render(<Login />);

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Tên đăng nhập không được để trống/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Mật khẩu không được để trống/i)
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  // b) Test form submission + navigate
  test('submit form hợp lệ sẽ gọi API login và navigate sang /product', async () => {
    jest.useFakeTimers(); // bật fake timers

    mockLogin.mockResolvedValueOnce({
      data: { token: 'fake-jwt-token' },
    });

    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'user123' } });
    fireEvent.change(passwordInput, { target: { value: 'Pass123' } });
    fireEvent.click(submitButton);

    // API phải được gọi đúng tham số
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'user123',
        password: 'Pass123',
      });
    });

    // Token phải được lưu
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');

    // Chạy toàn bộ setTimeout()
    jest.runAllTimers();

    // Kiểm tra navigate: dấu hiệu thành công chính
    expect(mockNavigate).toHaveBeenCalledWith('/product');

    // Thử tìm thông báo thành công nếu có (không bắt buộc)
    const successToast = screen.queryByText(/Đăng nhập thành công/i);
    if (successToast) {
      expect(successToast).toBeInTheDocument();
    }

    jest.useRealTimers();
  });

  // c) Test error handling
  test('hiển thị thông báo lỗi khi API login thất bại', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Tên đăng nhập hoặc mật khẩu không đúng.',
        },
      },
    });

    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    fireEvent.change(usernameInput, { target: { value: 'user123' } });
    fireEvent.change(passwordInput, { target: { value: 'SaiMatKhau1' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Tên đăng nhập hoặc mật khẩu không đúng.')
      ).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
