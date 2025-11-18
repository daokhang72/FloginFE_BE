import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { productService, authService } from "../../services/apiService";
import "./Product.css";

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" },
];

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // --- STATES CHO UI ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // --- STATE CHO MODAL XÓA ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const IMAGE_BASE_URL = `http://${window.location.hostname}:8080/uploads/`;
  const PLACEHOLDER_IMAGE = "https://placehold.co/300x300?text=No+Image";

  // --- HÀM HỖ TRỢ LẤY URL ẢNH ---
  const getImageUrl = (imageName) => {
    if (!imageName) return PLACEHOLDER_IMAGE;
    if (imageName.startsWith("http")) {
      return imageName;
    }
    return `${IMAGE_BASE_URL}${imageName}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null); // Reset lỗi khi tải lại
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC LỌC & TÌM KIẾM ---
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory ? product.categoryName === filterCategory : true;
    return matchSearch && matchCategory;
  });

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- CÁC HÀM XỬ LÝ ---
  
  // 1. Xem chi tiết
  const handleViewDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeDetailModal = () => setSelectedProduct(null);

  // 2. Sửa từ Modal chi tiết
  const handleEditFromModal = () => {
    setProductToEdit(selectedProduct); // Chuyển dữ liệu sang form sửa
    setSelectedProduct(null); // Tắt modal chi tiết
    setShowForm(true); // Mở form sửa
  };

  // 3. Xóa từ Modal chi tiết (Mở modal xác nhận)
  const handleDeleteFromModal = () => {
    setProductToDelete(selectedProduct);
    setSelectedProduct(null);
    setShowDeleteModal(true);
  };

  // 4. Xóa trực tiếp từ Grid (Mở modal xác nhận)
  const handleDeleteDirect = (product) => {
      setProductToDelete(product);
      setShowDeleteModal(true);
  }

  // 5. Thực hiện XÓA THẬT
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      // Cập nhật UI
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      
      // Reset
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Thông báo
      setMessage("Đã xóa sản phẩm thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      // Xử lý lỗi từ backend
      const serverError = err.response?.data || 'Lỗi khi xóa sản phẩm.';
      setError(serverError);
      
      // Nếu lỗi 404, reload lại danh sách
      if (err.response?.status === 404) {
          setShowDeleteModal(false);
          fetchProducts();
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // 6. Lưu (Thêm/Sửa)
  const handleSave = async (productData) => {
    try {
      if (productToEdit) {
        const response = await productService.update(productToEdit.id, productData);
        setProducts(products.map((p) => (p.id === productToEdit.id ? response.data : p)));
        setMessage("Cập nhật thành công!");
      } else {
        const response = await productService.create(productData);
        setProducts([...products, response.data]);
        setMessage("Thêm mới thành công!");
      }
      setShowForm(false);
      setProductToEdit(null);
      // Tải lại để đảm bảo ảnh mới được load
      fetchProducts(); 
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      const serverError = err.response?.data || 'Lỗi lưu sản phẩm.';
      setError(serverError);
    }
  };

  // --- RENDER GIAO DIỆN ---

  if (isLoading && products.length === 0) return <div className="loading-message">Đang tải dữ liệu...</div>;

  return (
    <div className="product-page-container">
      
      {/* --- HEADER --- */}
      <header className="product-header">
        <div className="header-left">
          <h1>Quản Lý Sản Phẩm</h1>
        </div>
        <div className="header-tools">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button onClick={() => { setProductToEdit(null); setShowForm(true); }} className="btn btn-primary">
            + Thêm Mới
          </button>
          <button onClick={handleLogout} className="btn btn-danger">Đăng Xuất</button>
        </div>
      </header>

      {/* --- THÔNG BÁO TOAST --- */}
      {message && <div className="toast-message">{message}</div>}
      
      {error && (
        <div className="toast-message error">
          {error}
          <button onClick={() => setError(null)} style={{marginLeft:'10px', background:'transparent', border:'none', color:'white', cursor:'pointer'}}>x</button>
        </div>
      )}

      {/* --- FORM MODAL (Thêm/Sửa) --- */}
      {showForm && (
        <div className="modal-overlay">
          <ProductForm
            productToEdit={productToEdit}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            categories={categories}
          />
        </div>
      )}

      {/* --- LƯỚI SẢN PHẨM (GRID) --- */}
      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="card-image-wrapper">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="card-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                />
                <div className="card-overlay">
                  <button className="view-btn" onClick={() => handleViewDetail(product)}>
                    Xem Chi Tiết
                  </button>
                  {/* Thêm nút xóa nhanh ở đây nếu muốn, nhưng nút Xem Chi Tiết là đủ đẹp */}
                </div>
              </div>
              <div className="card-info">
                <span className="card-category">{product.categoryName}</span>
                <h3 className="card-title" title={product.name}>{product.name}</h3>
                <div className="card-price">{product.price.toLocaleString("vi-VN")} đ</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ width: "100%", textAlign: "center", gridColumn: "1/-1" }}>Không tìm thấy sản phẩm nào.</p>
        )}
      </div>

      {/* --- PHÂN TRANG --- */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            &laquo; Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            Sau &raquo;
          </button>
        </div>
      )}

      {/* --- MODAL CHI TIẾT (VIEW - GIAO DIỆN MỚI) --- */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content detail-modal-width">
            
            {/* Header */}
            <div className="detail-header">
              <h2>Thông Tin Sản Phẩm</h2>
              <button onClick={closeDetailModal} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer', color: '#999'}}>&times;</button>
            </div>

            {/* Body: Chia 2 cột */}
            <div className="detail-body">
              
              {/* Cột Trái: Ảnh */}
              <div className="detail-left">
                <img 
                  src={getImageUrl(selectedProduct.image)} 
                  alt={selectedProduct.name} 
                  className="detail-image"
                  onError={(e) => { e.target.onerror = null; e.target.src=PLACEHOLDER_IMAGE; }}
                />
              </div>

              {/* Cột Phải: Thông tin */}
              <div className="detail-right">
                <span className="detail-category">{selectedProduct.categoryName}</span>
                <h3 className="detail-name">{selectedProduct.name}</h3>
                <div className="detail-price">{selectedProduct.price.toLocaleString('vi-VN')} đ</div>
                
                <div className="detail-row">
                  <strong>Mã sản phẩm:</strong> <span>#{selectedProduct.id}</span>
                </div>
                <div className="detail-row">
                  <strong>Tồn kho:</strong> <span>{selectedProduct.quantity} sản phẩm</span>
                </div>

                <span className="detail-description-label">Mô tả sản phẩm:</span>
                <div className="detail-description-content">
                  {selectedProduct.description || "Chưa có mô tả cho sản phẩm này."}
                </div>
              </div>
            </div>

            {/* Footer: Nút bấm */}
            <div className="detail-footer">
              <button onClick={handleEditFromModal} className="btn btn-warning">
                Sửa
              </button>
              <button onClick={handleDeleteFromModal} className="btn btn-danger">
                Xóa
              </button>
              <button onClick={closeDetailModal} className="btn btn-secondary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL XÁC NHẬN XÓA (MỚI) --- */}
      {showDeleteModal && productToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <span className="delete-icon">⚠️</span>
            <h3 className="delete-title">Xác nhận xóa?</h3>
            <p className="delete-text">
              Bạn có chắc chắn muốn xóa sản phẩm <br />
              <strong>"{productToDelete.name}"</strong> không?
              <br />
              <span style={{ fontSize: "0.9rem", color: "#999" }}>Hành động này không thể hoàn tác.</span>
            </p>
            <div className="delete-actions">
              <button onClick={cancelDelete} className="btn btn-secondary">Hủy bỏ</button>
              <button onClick={confirmDelete} className="btn btn-danger">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductPage;