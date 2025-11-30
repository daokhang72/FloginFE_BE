import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("create"); // create | edit

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        await createProduct(form);
        setMessage("Thêm sản phẩm thành công");
      } else {
        await updateProduct(form.id, form);
        setMessage("Cập nhật sản phẩm thành công");
      }

      setForm({ id: null, name: "", price: "", quantity: "", category: "" });
      setMode("create");
      loadProducts();
    } catch (err) {
      setMessage("Lỗi thao tác sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setMode("edit");
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setMessage("Xóa sản phẩm thành công");
    loadProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Management</h2>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          data-testid="product-name"
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
        />

        <input
          data-testid="product-price"
          name="price"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
        />

        <input
          data-testid="product-quantity"
          name="quantity"
          placeholder="Số lượng"
          value={form.quantity}
          onChange={handleChange}
        />

        <input
          data-testid="product-category"
          name="category"
          placeholder="Danh mục"
          value={form.category}
          onChange={handleChange}
        />

        <button
          data-testid="submit-btn"
          onClick={handleSubmit}
          style={{ marginLeft: 10 }}
        >
          {mode === "create" ? "Thêm" : "Cập nhật"}
        </button>

        {message && (
          <div data-testid="success-message" style={{ color: "green" }}>
            {message}
          </div>
        )}
      </div>

      {/* LIST */}
      <h3>Danh sách sản phẩm</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id} data-testid="product-item">
            {p.name} - {p.price}đ ({p.quantity})
            <button
              data-testid="edit-btn"
              onClick={() => handleEdit(p)}
              style={{ marginLeft: 10 }}
            >
              Sửa
            </button>
            <button
              data-testid="delete-btn"
              onClick={() => handleDelete(p.id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
