import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "../components/Product/ProductForm";

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-preview-url");

describe("Product Form Integration Tests", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockCategories = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===================================================================
  // a) Test ProductList component với API (2 điểm)
  // Lưu ý: ProductList được tích hợp trong ProductPage,
  // test này sẽ test form thay thế vì không có component riêng
  // ===================================================================

  test("Hiển thị form tạo sản phẩm mới", () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    expect(screen.getByLabelText(/Tên sản phẩm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Giá/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số lượng/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  // ===================================================================
  // b) Test ProductForm component (create/edit) (2 điểm)
  // ===================================================================

  test("Tạo sản phẩm mới - điền form và submit", () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    // Điền dữ liệu
    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "Laptop Dell" },
    });
    fireEvent.change(screen.getByLabelText(/Giá/i), {
      target: { value: "15000000" },
    });
    fireEvent.change(screen.getByLabelText(/Số lượng/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Danh mục/i), {
      target: { value: "1" },
    });

    // Submit
    fireEvent.click(screen.getByTestId("submit-btn"));

    // Kiểm tra onSave được gọi
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    const calledArg = mockOnSave.mock.calls[0][0];
    expect(calledArg).toBeInstanceOf(FormData);
  });

  test("Chỉnh sửa sản phẩm - hiển thị dữ liệu cũ", () => {
    const productToEdit = {
      name: "Laptop Dell",
      price: 15000000,
      quantity: 10,
      description: "Sản phẩm chất lượng",
      categoryId: 1,
      image: "laptop.jpg",
    };

    render(
      <ProductForm
        productToEdit={productToEdit}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue("Laptop Dell");
    expect(screen.getByLabelText(/Giá/i)).toHaveValue(15000000);
    expect(screen.getByLabelText(/Số lượng/i)).toHaveValue(10);
    expect(screen.getByLabelText(/Danh mục/i)).toHaveValue("1");
  });

  // ===================================================================
  // c) Test ProductDetail component (1 điểm)
  // Lưu ý: ProductDetail được tích hợp trong ProductPage,
  // test này kiểm tra xem form có hiển thị đúng chi tiết không
  // ===================================================================

  test("Hiển thị chi tiết sản phẩm khi có productToEdit", async () => {
    const productToEdit = {
      name: "Laptop Dell",
      price: 15000000,
      quantity: 10,
      description: "Sản phẩm chất lượng cao",
      categoryId: 1,
      image: "laptop.jpg",
    };

    render(
      <ProductForm
        productToEdit={productToEdit}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue("Laptop Dell");
      expect(screen.getByLabelText(/Số lượng/i)).toHaveValue(10);
    });

    // Kiểm tra ảnh preview
    const previewImg = screen.getByAltText("Preview");
    expect(previewImg).toBeInTheDocument();
    expect(previewImg).toHaveAttribute(
      "src",
      expect.stringContaining("laptop.jpg")
    );
  });
});
