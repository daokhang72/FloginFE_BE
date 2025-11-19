import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
// 1. IMPORT THÊM categoryService
import { productService, authService, categoryService } from "../../services/apiService"; 
import "./Product.css";

// (ĐÃ XÓA MẢNG categories CỨNG Ở ĐÂY)

function ProductPage() {
  const [products, setProducts] = useState([]);
  
  // 2. THÊM STATE CHO DANH MỤC
  const [categories, setCategories] = useState([]); 

  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const IMAGE_BASE_URL = `http://${window.location.hostname}:8080/uploads/`;
  const PLACEHOLDER_IMAGE = "https://placehold.co/300x300?text=No+Image";

  const getImageUrl = (imageName) => {
    if (!imageName) return PLACEHOLDER_IMAGE;
    if (imageName.startsWith("http")) return imageName;
    return `${IMAGE_BASE_URL}${imageName}`;
  };

  useEffect(() => {
    fetchData(); // Gọi hàm tải dữ liệu chung
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // 3. HÀM TẢI DỮ LIỆU (Sản phẩm + Danh mục)
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Chạy song song cả 2 API để tiết kiệm thời gian
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      
      // --- LOGIC SẮP XẾP MỚI ---
      // Sắp xếp danh mục theo tên (name) từ A-Z
      const sortedCategories = categoriesRes.data.sort((a, b) => {
        // Sử dụng localeCompare để sắp xếp chuỗi theo thứ tự bảng chữ cái
        // LocaleCompare thường chính xác hơn cho các ký tự tiếng Việt hoặc các ngôn ngữ khác
        return a.name.localeCompare(b.name);
      });
      // ------------------------

      setProducts(productsRes.data);
      setCategories(sortedCategories); // Lưu danh mục đã sắp xếp vào state
      
    } catch (err) {
      console.error(err);
      setError("Lỗi tải dữ liệu từ máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CÁC LOGIC KHÁC GIỮ NGUYÊN ---
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "ALL" 
        ? true 
        : product.categoryName === filterCategory;
    return matchSearch && matchCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetail = (product) => setSelectedProduct(product);
  const closeDetailModal = () => setSelectedProduct(null);
  const handleEditFromModal = () => { setProductToEdit(selectedProduct); setSelectedProduct(null); setShowForm(true); };
  const handleDeleteFromModal = () => { setProductToDelete(selectedProduct); setSelectedProduct(null); setShowDeleteModal(true); };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.delete(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false); setProductToDelete(null);
      setMessage("Đã xóa sản phẩm thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { setError(err.response?.data || "Lỗi xóa sản phẩm."); }
  };
  
  const cancelDelete = () => { setShowDeleteModal(false); setProductToDelete(null); };

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
      setShowForm(false); setProductToEdit(null); 
      fetchData(); // Tải lại cả danh sách để đồng bộ
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { 
        const serverError = err.response?.data || "Lỗi lưu sản phẩm.";
        setError(serverError); 
    }
  };

  if (isLoading && products.length === 0) return <div className="loading-message">Đang tải dữ liệu...</div>;

  return (
    <div className="product-page-container">
      <header className="product-header">
        <div className="header-left">
          <h1>Quản Lý Sản Phẩm</h1>
        </div>
        <div className="header-tools">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <button onClick={() => { setProductToEdit(null); setShowForm(true); }} className="btn btn-primary">
            + Thêm Mới
          </button>
          <button onClick={handleLogout} className="btn btn-danger">Đăng Xuất</button>
        </div>
      </header>

      {/* --- THANH LỌC DẠNG THẺ (DÙNG DỮ LIỆU TỪ API) --- */}
      <div className="filter-section">
        <span className="filter-label">Danh mục:</span>
        
        <button 
            className={`filter-pill ${filterCategory === "ALL" ? "active" : ""}`}
            onClick={() => { setFilterCategory("ALL"); setCurrentPage(1); }}
        >
            Tất cả
        </button>

        {/* Render danh mục từ State (API) */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${filterCategory === cat.name ? "active" : ""}`}
            onClick={() => { setFilterCategory(cat.name); setCurrentPage(1); }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {message && <div className="toast-message">{message}</div>}
      
      {error && (
        <div className="toast-message error">
          {error}
          <button onClick={() => setError(null)} style={{marginLeft:'10px', background:'transparent', border:'none', color:'white', cursor:'pointer'}}>x</button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          {/* Truyền danh mục động vào Form */}
          <ProductForm 
            productToEdit={productToEdit} 
            onSave={handleSave} 
            onCancel={() => setShowForm(false)} 
            categories={categories} 
          />
        </div>
      )}

      {/* --- GRID SẢN PHẨM --- */}
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
          <div style={{ width: "100%", textAlign: "center", gridColumn: "1/-1", padding: "40px", color: "#999" }}>
            <p style={{fontSize: '1.2rem'}}>Không tìm thấy sản phẩm nào phù hợp.</p>
            <button className="btn btn-secondary" onClick={() => {setSearchTerm(''); setFilterCategory('ALL')}} style={{marginTop:'10px'}}>Xóa bộ lọc</button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index} className={`page-btn ${currentPage === index + 1 ? "active" : ""}`} onClick={() => paginate(index + 1)}>{index + 1}</button>
          ))}
          <button className="page-btn" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
        </div>
      )}

      {/* ... (Phần Modal Chi tiết và Modal Xóa giữ nguyên như cũ) ... */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content detail-modal-width">
            <div className="detail-header">
              <h2>Thông Tin Sản Phẩm</h2>
              <button onClick={closeDetailModal} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer', color: '#999'}}>&times;</button>
            </div>
            <div className="detail-body">
              <div className="detail-left">
                <img src={getImageUrl(selectedProduct.image)} alt={selectedProduct.name} className="detail-image" onError={(e) => { e.target.onerror = null; e.target.src=PLACEHOLDER_IMAGE; }} />
              </div>
              <div className="detail-right">
                <span className="detail-category">{selectedProduct.categoryName}</span>
                <h3 className="detail-name">{selectedProduct.name}</h3>
                <div className="detail-price">{selectedProduct.price.toLocaleString('vi-VN')} đ</div>
                <div className="detail-row"><strong>Mã SP:</strong> <span>#{selectedProduct.id}</span></div>
                <div className="detail-row"><strong>Tồn kho:</strong> <span>{selectedProduct.quantity}</span></div>
                <span className="detail-description-label">Mô tả:</span>
                <div className="detail-description-content">{selectedProduct.description || "Chưa có mô tả."}</div>
              </div>
            </div>
            <div className="detail-footer">
              <button onClick={handleEditFromModal} className="btn btn-warning">Sửa</button>
              <button onClick={handleDeleteFromModal} className="btn btn-danger">Xóa</button>
              <button onClick={closeDetailModal} className="btn btn-secondary">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && productToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <span className="delete-icon">⚠️</span>
            <h3 className="delete-title">Xác nhận xóa?</h3>
            <p className="delete-text">Bạn có chắc muốn xóa <strong>"{productToDelete.name}"</strong>?</p>
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