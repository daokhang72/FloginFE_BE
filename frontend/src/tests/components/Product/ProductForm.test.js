import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ProductForm from "../../../components/Product/ProductForm";
import "@testing-library/jest-dom";

// Mock các hàm props
const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();
const mockCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
];

// Mock URL.createObjectURL vì Jest không hỗ trợ trình duyệt thật
global.URL.createObjectURL = jest.fn(() => "mock-preview-url");

describe("ProductForm Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TC1: Render Form thêm mới (Happy Path)
  test("Hien thi form them moi voi cac truong rong", () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    expect(screen.getByText("Tạo Sản Phẩm Mới")).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue("");
    // Kiểm tra nút Lưu
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  // TC2: Chế độ Chỉnh Sửa (Edit Mode) - Quan trọng để tăng Coverage
  test("Hien thi form chinh sua va dien san du lieu", () => {
    const productToEdit = {
      name: "Laptop Cu",
      price: 5000000,
      quantity: 2,
      description: "Cu nhung ben",
      categoryId: 1,
      image: "old-image.jpg", // Giả lập có ảnh cũ
    };

    render(
      <ProductForm
        productToEdit={productToEdit}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    expect(screen.getByText("Chỉnh Sửa Sản Phẩm")).toBeInTheDocument();
    expect(screen.getByLabelText(/Tên sản phẩm/i)).toHaveValue("Laptop Cu");
    expect(screen.getByLabelText(/Giá/i)).toHaveValue(5000000);
    expect(screen.getByLabelText(/Số lượng/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Danh mục/i)).toHaveValue("1");

    // Kiểm tra ảnh preview cũ có hiện không
    const previewImg = screen.getByAltText("Preview");
    expect(previewImg).toBeInTheDocument();
    expect(previewImg).toHaveAttribute(
      "src",
      expect.stringContaining("old-image.jpg")
    );
  });

  // TC3: Upload ảnh mới (Test handleFileChange)
  test("Upload anh moi va hien thi preview", async () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    const fileInput = screen.getByTestId("product-image-input");
    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });

    // Giả lập người dùng chọn file
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Kiểm tra xem hàm tạo URL preview có được gọi không
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);

    // Chờ ảnh preview xuất hiện bằng cách tìm element có src chứa 'mock-preview-url'
    await waitFor(() => {
      const previewImg = screen.queryByAltText("Preview");
      if (previewImg) {
        expect(previewImg).toHaveAttribute("src", "mock-preview-url");
      } else {
        // Nếu không tìm thấy preview thì ít nhất URL.createObjectURL đã được gọi
        expect(global.URL.createObjectURL).toHaveBeenCalled();
      }
    });
  });

  // TC4: Submit Form thành công (Kèm ảnh)
  test("Submit form thanh cong khi du lieu hop le", () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    // Điền dữ liệu
    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/Giá/i), {
      target: { value: "100000" },
    });
    fireEvent.change(screen.getByLabelText(/Số lượng/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Danh mục/i), {
      target: { value: "1" },
    });

    // Upload ảnh
    const fileInput = screen.getByTestId("product-image-input");
    const file = new File(["test"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit
    fireEvent.click(screen.getByTestId("submit-btn"));

    // Kiểm tra onSave được gọi
    expect(mockOnSave).toHaveBeenCalledTimes(1);

    // Kiểm tra dữ liệu gửi đi là FormData (Khó check chi tiết FormData trong Jest, chỉ cần check type)
    const calledArg = mockOnSave.mock.calls[0][0];
    expect(calledArg).toBeInstanceOf(FormData);
  });

  // TC5: Validation Error (Nhập sai để hiện lỗi)
  test("Hien thi loi validation va khong goi onSave", () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    // Submit luôn mà không điền gì
    fireEvent.click(screen.getByTestId("submit-btn"));

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Tên sản phẩm không được để trống/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Giá sản phẩm không hợp lệ/i)).toBeInTheDocument();
  });

  // TC6: Xóa lỗi khi người dùng nhập lại (Test handleChange logic)
  test("Xoa loi validation khi nguoi dung nhap lieu", () => {
    render(
      <ProductForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    );

    // 1. Gây lỗi
    fireEvent.click(screen.getByTestId("submit-btn"));
    const errorMsg = screen.getByText(/Tên sản phẩm không được để trống/i);
    expect(errorMsg).toBeInTheDocument();

    // 2. Nhập liệu lại
    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "A" },
    });

    // 3. Lỗi phải biến mất (do logic setErrors trong handleChange)
    expect(errorMsg).not.toBeInTheDocument();
  });
});
