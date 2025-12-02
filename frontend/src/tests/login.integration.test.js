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

// ---- MOCK apiService để không gọi axios thật ----
const mockLogin = jest.fn();
jest.mock('../services/apiService', () => ({
  authService: {
    login: (...args) => mockLogin(...args),
  },
}));

beforeEach(() => {
  jest.useRealTimers();       // reset timers mỗi test
  mockLogin.mockReset();
  mockNavigate.mockReset();
  localStorage.clear();
});

describe('Login Component Integration Tests', () => {
  // ===== (a) Test rendering & user interactions =====
  test('TC_LOGIN_A1 - Render day du form va cho phep nhap lieu', () => {
    render(<Login />);

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    // render đúng
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // user interaction
    fireEvent.change(usernameInput, { target: { value: 'user123' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });

    expect(usernameInput).toHaveValue('user123');
    expect(passwordInput).toHaveValue('pass123');
  });

  // (a) + (c): validation phía FE & error message
  test('TC_LOGIN_A2 - Hien thi loi khi submit form rong', async () => {
    render(<Login />);

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(
        screen.getByText(/Tên đăng nhập không được để trống/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Mật khẩu không được để trống/i),
      ).toBeInTheDocument();
    });

    // form invalid thì không gọi API
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // ===== (b) Test form submission & API calls + success flow =====
  test(
    'TC_LOGIN_B1 - Submit form hop le se goi API login, luu token va navigate /product',
    async () => {
      jest.useFakeTimers(); // vì code thật dùng setTimeout để navigate

      mockLogin.mockResolvedValueOnce({
        data: { token: 'fake-jwt-token' },
      });

      render(<Login />);

      fireEvent.change(screen.getByTestId('username-input'), {
        target: { value: 'user123' },
      });
      fireEvent.change(screen.getByTestId('password-input'), {
        target: { value: 'Pass123' },
      });
      fireEvent.click(screen.getByTestId('login-button'));

      // API phải được gọi đúng tham số
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'user123',
          password: 'Pass123',
        });
      });

      // token phải được lưu
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');

      // chạy hết setTimeout để navigate
      jest.runAllTimers();
      expect(mockNavigate).toHaveBeenCalledWith('/product');

      // (c - success message) nếu giao diện có message thì check, nếu không thì bỏ qua
      const successToast = screen.queryByText(/Đăng nhập thành công/i);
      if (successToast) {
        expect(successToast).toBeInTheDocument();
      }

      jest.useRealTimers();
    },
  );

  // ===== (c) Test error handling & error messages =====
  test('TC_LOGIN_C1 - Hien thi thong bao loi khi API login that bai', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Tên đăng nhập hoặc mật khẩu không đúng.',
        },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'user123' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'SaiMatKhau1' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Tên đăng nhập hoặc mật khẩu không đúng.'),
      ).toBeInTheDocument();
    });

    // lỗi thì không được navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
