// frontend/src/tests/product.integration.test.js

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProductForm from "../components/Product/ProductForm";
import ProductPage from "../components/Product/ProductPage";
import { categoryService, productService } from "../services/apiService";

// Mock toàn bộ module apiService để không gọi thật đến backend
jest.mock("../services/apiService", () => ({
  productService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  categoryService: {
    getAll: jest.fn(),
  },
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

// Dữ liệu mẫu cho test
const mockCategories = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phụ kiện" },
];

const mockProducts = [
  {
    id: 1,
    name: "Laptop Dell",
    price: 15000000,
    quantity: 10,
    description: "Máy chạy mượt",
    categoryId: 1,
    categoryName: "Laptop",
    image: null,
  },
  {
    id: 2,
    name: "Chuột không dây",
    price: 300000,
    quantity: 5,
    description: "Chuột xài êm",
    categoryId: 2,
    categoryName: "Phụ kiện",
    image: null,
  },
];

beforeEach(() => {
  jest.clearAllMocks();

  // Khi ProductPage gọi API, trả về dữ liệu mẫu
  productService.getAll.mockResolvedValue({ data: mockProducts });
  categoryService.getAll.mockResolvedValue({ data: mockCategories });

  productService.create.mockResolvedValue({ data: mockProducts[1] });
  productService.update.mockResolvedValue({
    data: { ...mockProducts[0], name: "Laptop Dell Update" },
  });
});

// =============================
// a) ProductList + API (2đ)
// =============================
test("ProductPage: hiển thị danh sách sản phẩm sau khi gọi API", async () => {
  render(
    <MemoryRouter>
      <ProductPage />
    </MemoryRouter>
  );

  // Gọi API lấy sản phẩm & danh mục
  expect(productService.getAll).toHaveBeenCalledTimes(1);
  expect(categoryService.getAll).toHaveBeenCalledTimes(1);

  // Chờ dữ liệu render ra UI
  const firstProduct = await screen.findByText("Laptop Dell");
  const secondProduct = await screen.findByText("Chuột không dây");

  expect(firstProduct).toBeInTheDocument();
  expect(secondProduct).toBeInTheDocument();
});

// =============================================
// b) ProductForm (create) - Tạo mới sản phẩm
// =============================================
test("ProductForm (create): nhập form hợp lệ và gọi onSave với FormData đúng", async () => {
  const handleSave = jest.fn();
  const handleCancel = jest.fn();

  render(
    <ProductForm
      productToEdit={null}
      onSave={handleSave}
      onCancel={handleCancel}
      categories={mockCategories}
    />
  );

  // Nhập dữ liệu qua label (giống ví dụ đề bài)
  fireEvent.change(screen.getByLabelText("Tên sản phẩm"), {
    target: { value: "Chuột không dây mới" },
  });
  fireEvent.change(screen.getByLabelText("Giá"), {
    target: { value: "350000" },
  });
  fireEvent.change(screen.getByLabelText("Số lượng"), {
    target: { value: "7" },
  });
  fireEvent.change(screen.getByLabelText("Danh mục"), {
    target: { value: String(mockCategories[0].id) }, // "1"
  });
  fireEvent.change(screen.getByLabelText("Mô tả"), {
    target: { value: "Chuột mới test" },
  });

  // Submit form
  fireEvent.click(screen.getByTestId("submit-btn"));

  await waitFor(() => {
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  const formDataArg = handleSave.mock.calls[0][0];
  expect(formDataArg).toBeInstanceOf(FormData);
  expect(formDataArg.get("name")).toBe("Chuột không dây mới");
  expect(formDataArg.get("price")).toBe("350000");
  expect(formDataArg.get("quantity")).toBe("7");
  expect(formDataArg.get("categoryId")).toBe(String(mockCategories[0].id));
  expect(formDataArg.get("description")).toBe("Chuột mới test");
});

// =====================================================
// b) ProductForm (edit) - Chỉnh sửa sản phẩm có sẵn
// =====================================================
test("ProductForm (edit): hiển thị sẵn dữ liệu và gửi FormData mới khi lưu", async () => {
  const handleSave = jest.fn();

  const productToEdit = {
    id: 1,
    name: "Laptop Dell",
    price: 15000000,
    quantity: 10,
    description: "Máy chạy mượt",
    categoryId: 1,
    image: null,
  };

  render(
    <ProductForm
      productToEdit={productToEdit}
      onSave={handleSave}
      onCancel={() => {}}
      categories={mockCategories}
    />
  );

  // Input phải hiển thị sẵn dữ liệu cũ
  const nameInput = screen.getByLabelText("Tên sản phẩm");
  expect(nameInput).toHaveValue("Laptop Dell");

  // Sửa tên rồi lưu
  fireEvent.change(nameInput, {
    target: { value: "Laptop Dell Update" },
  });

  fireEvent.click(screen.getByTestId("submit-btn"));

  await waitFor(() => {
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  const formDataArg = handleSave.mock.calls[0][0];
  expect(formDataArg).toBeInstanceOf(FormData);
  expect(formDataArg.get("name")).toBe("Laptop Dell Update");
});

// =============================================
// c) ProductDetail - Modal xem chi tiết (1đ)
// =============================================
test('ProductDetail: mở modal khi bấm "Xem Chi Tiết" và đóng được', async () => {
  render(
    <MemoryRouter>
      <ProductPage />
    </MemoryRouter>
  );

  // Chờ danh sách sản phẩm hiển thị
  const viewButtons = await screen.findAllByText("Xem Chi Tiết");
  expect(viewButtons.length).toBeGreaterThan(0);

  // Bấm xem chi tiết sản phẩm đầu tiên
  fireEvent.click(viewButtons[0]);

  // Modal chi tiết phải hiện lên với thông tin sản phẩm
  expect(await screen.findByText("Thông Tin Sản Phẩm")).toBeInTheDocument();

  // Ở đây dùng getAllByText để tránh lỗi "multiple elements"
  const nameElems = screen.getAllByText(/Laptop Dell/i);
  expect(nameElems.length).toBeGreaterThan(0);

  expect(screen.getByText(/Mã SP:/i)).toBeInTheDocument();
  expect(screen.getByText(/Tồn kho:/i)).toBeInTheDocument();
  expect(screen.getByText(/Mô tả:/i)).toBeInTheDocument();

  // Bấm nút Đóng để tắt modal
  const closeButton = screen.getByRole("button", { name: "Đóng" });
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(screen.queryByText("Thông Tin Sản Phẩm")).not.toBeInTheDocument();
  });
});
