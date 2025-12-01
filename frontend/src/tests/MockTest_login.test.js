// MockTest_login.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom module - MUST return mockNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock API service
jest.mock("../services/apiService", () => ({
  authService: {
    login: jest.fn(),
  },
}));

import Login from "../components/Login/login";
import { authService } from "../services/apiService";

jest.useFakeTimers();

describe("Login Component - Mock Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test("Successful login - mock API", async () => {
    // --- Mock API thành công ---
    authService.login.mockResolvedValue({
      data: {
        token: "mock-token",
        user: { username: "admin01" },
      },
    });

    render(<Login />);

    // Nhập username + password
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "admin01" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Admin123" },
    });

    fireEvent.click(screen.getByTestId("login-button"));

    // Chờ hiển thị thông báo success
    expect(
      await screen.findByText(/Đăng nhập thành công/i)
    ).toBeInTheDocument();

    // Chạy timeout → trigger navigate
    jest.runAllTimers();

    // --- Verify navigate ---
    expect(mockNavigate).toHaveBeenCalledWith("/product");

    // --- Verify API được gọi đúng ---
    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith({
      username: "admin01",
      password: "Admin123",
    });

    // --- Verify cấu trúc API trả về ---
    const response = authService.login.mock.calls[0][0];
    expect(typeof response).toBe("object");
  });

  test("Failed login - mock API", async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: "Sai mật khẩu!" } },
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "admin01" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Admin123" },
    });

    fireEvent.click(screen.getByTestId("login-button"));

    // Kiểm tra message lỗi hiển thị
    expect(await screen.findByText("Sai mật khẩu!")).toBeInTheDocument();

    // Verify API được gọi
    expect(authService.login).toHaveBeenCalledTimes(1);
  });
});
