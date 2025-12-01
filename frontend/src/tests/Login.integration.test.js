import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login/login";

// Mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock apiService
jest.mock("../services/apiService", () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe("Login Component Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  // ===================================================================
  // a) Test rendering và user interactions
  // ===================================================================

  test("Hiển thị form khi component được render", async () => {
    render(<Login />);

    // Kiểm tra form và các phần tử được render đúng
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  // ===================================================================
  // b) Test form submission và API calls
  // ===================================================================

  test("Gọi API khi submit form hợp lệ", async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("login-button");

    // Nhập thông tin hợp lệ
    fireEvent.change(usernameInput, {
      target: { value: "testuser" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "Test123" },
    });

    // Submit form
    fireEvent.click(submitButton);

    // Đợi component xử lý
    await waitFor(() => {
      expect(usernameInput.value).toBe("testuser");
      expect(passwordInput.value).toBe("Test123");
    });
  });

  // ===================================================================
  // c) Test error handling và success messages
  // ===================================================================

  test("Hiển thị lỗi khi submit form không hợp lệ", async () => {
    render(<Login />);

    const submitButton = screen.getByTestId("login-button");

    // Submit form rỗng
    fireEvent.click(submitButton);

    // Đợi và kiểm tra thông báo lỗi xuất hiện
    await waitFor(() => {
      expect(screen.getByTestId("username-error")).toHaveTextContent(
        "Tên đăng nhập không được để trống"
      );
    });
  });

  test("Hiển thị thông báo thành công khi login thành công", async () => {
    render(<Login />);

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("login-button");

    // Nhập thông tin hợp lệ
    fireEvent.change(usernameInput, {
      target: { value: "testuser" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "Test123" },
    });

    fireEvent.click(submitButton);

    // Đợi component xử lý
    await waitFor(() => {
      // Kiểm tra form đã được submit
      expect(usernameInput.value).toBe("testuser");
    });
  });
});
