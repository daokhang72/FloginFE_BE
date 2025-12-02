import React, { useState, useEffect } from "react";
// 1. Import hàm validate
import { validateProduct } from "../../utils/productValidation";

const initialFormState = {
  name: "",
  price: "",
  quantity: "",
  description: "",
  categoryId: "",
  image: null,
};

function ProductForm({ productToEdit, onSave, onCancel, categories }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({}); // State chứa lỗi validation
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        quantity: productToEdit.quantity,
        description: productToEdit.description || "",
        categoryId: productToEdit.categoryId,
        image: null,
      });

      if (productToEdit.image) {
        setPreviewImage(`http://localhost:8080/uploads/${productToEdit.image}`);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData(initialFormState);
      setPreviewImage(null);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // (Tùy chọn) Xóa lỗi ngay khi người dùng bắt đầu gõ lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi cũ

    // --- BƯỚC 1: GỌI HÀM VALIDATE ---
    const validationErrors = validateProduct(formData);

    // --- BƯỚC 2: KIỂM TRA LỖI (QUAN TRỌNG NHẤT) ---
    if (Object.keys(validationErrors).length > 0) {
      // console.log("Phát hiện lỗi validation:", validationErrors); // Debug only
      setErrors(validationErrors); // Cập nhật state để hiện thông báo đỏ
      return; // <--- DỪNG LẠI! Không chạy tiếp code bên dưới
    }

    // --- BƯỚC 3: NẾU KHÔNG CÓ LỖI -> GỬI DATA ---
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("price", parseFloat(formData.price));
    dataToSend.append("quantity", parseInt(formData.quantity, 10));
    dataToSend.append("description", formData.description || "");
    dataToSend.append("categoryId", parseInt(formData.categoryId, 10));

    if (formData.image instanceof File) {
      dataToSend.append("imageFile", formData.image);
    }

    onSave(dataToSend);
  };

  const formTitle = productToEdit ? "Chỉnh Sửa Sản Phẩm" : "Tạo Sản Phẩm Mới";

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>{formTitle}</h3>

        {/* --- TÊN SẢN PHẨM --- */}
        <div className="input-group">
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            data-testid="product-name"
            className={errors.name ? "invalid" : ""} // Thêm class lỗi để viền đỏ
          />
          {/* Hiển thị thông báo lỗi */}
          {errors.name && (
            <span
              className="error-message"
              style={{ color: "red", fontSize: "0.9rem" }}
            >
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-row">
          {/* --- GIÁ --- */}
          <div className="input-group">
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              data-testid="product-price"
              className={errors.price ? "invalid" : ""}
            />
            {errors.price && (
              <span
                className="error-message"
                style={{ color: "red", fontSize: "0.9rem" }}
              >
                {errors.price}
              </span>
            )}
          </div>

          {/* --- SỐ LƯỢNG --- */}
          <div className="input-group">
            <label htmlFor="quantity">Số lượng</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              data-testid="product-quantity"
              className={errors.quantity ? "invalid" : ""}
            />
            {errors.quantity && (
              <span
                className="error-message"
                style={{ color: "red", fontSize: "0.9rem" }}
              >
                {errors.quantity}
              </span>
            )}
          </div>
        </div>

        {/* --- DANH MỤC --- */}
        <div className="input-group">
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            data-testid="product-category"
            className={errors.categoryId ? "invalid" : ""}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span
              className="error-message"
              style={{ color: "red", fontSize: "0.9rem" }}
            >
              {errors.categoryId}
            </span>
          )}
        </div>

        {/* --- MÔ TẢ --- */}
        <div className="input-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            data-testid="product-description"
            className={errors.description ? "invalid" : ""}
          ></textarea>
          {errors.description && (
            <span
              className="error-message"
              style={{ color: "red", fontSize: "0.9rem" }}
            >
              {errors.description}
            </span>
          )}
        </div>

        {/* --- ẢNH --- */}
        <div className="input-group">
          <label>Hình ảnh</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            data-testid="product-image-input"
          />

          {/* Preview Ảnh Đẹp Hơn (như bạn đã sửa) */}
          {previewImage && (
            <div className="image-preview-container">
              <p
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "0.9rem",
                  color: "#888",
                }}
              >
                Xem trước ảnh:
              </p>
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            data-testid="submit-btn"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
