import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/api';

const Product = ({ onLogout }) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: '',
        description: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: '',
        description: '',
    });
    const [notification, setNotification] = useState({ text: '', type: '' });
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoadingList(true);
        setNotification({ text: '', type: '' });
        try {
            const response = await getProducts();
            setProducts(response);
        } catch (error) {
            setNotification({ text: '❌ Không thể tải danh sách sản phẩm.', type: 'error' });
        } finally {
            setIsLoadingList(false);
        }
    };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleEditFormChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setNotification({ text: '', type: '' });
        if (!formData.name || !formData.price) {
            setNotification({ text: 'Tên và giá sản phẩm là bắt buộc!', type: 'error' });
            return;
        }
        if (parseFloat(formData.price) <= 0 || (formData.quantity && parseInt(formData.quantity) < 0)) {
            setNotification({ text: 'Giá và số lượng phải là số dương!', type: 'error' });
            return;
        }
        setIsSubmitting(true);
        try {
            const newProduct = await addProduct(formData);
            setProducts([...products, newProduct]);
            setNotification({ text: '✅ Thêm sản phẩm thành công!', type: 'success' });
            setFormData({ name: '', price: '', quantity: '', category: '', description: '' });
        } catch (error) {
            setNotification({ text: '❌ Lỗi khi thêm sản phẩm.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setNotification({ text: '', type: '' });
        if (!editFormData.name || !editFormData.price) {
            setNotification({ text: 'Tên và giá là bắt buộc!', type: 'error' });
            return;
        }
        setIsSubmitting(true);
        try {
            const updatedProduct = await updateProduct(editingId, editFormData);
            setProducts(products.map(p => p.id === editingId ? updatedProduct : p));
            setNotification({ text: '✅ Cập nhật thành công!', type: 'success' });
            setEditingId(null);
        } catch (error) {
            setNotification({ text: '❌ Lỗi khi cập nhật sản phẩm.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setNotification({ text: '', type: '' });
        setDeletingId(id);
        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
            setNotification({ text: '🗑️ Xóa sản phẩm thành công.', type: 'success' });
        } catch (error) {
            setNotification({ text: '❌ Lỗi khi xóa sản phẩm.', type: 'error' });
        } finally {
            setDeletingId(null);
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setEditFormData(product);
        setNotification({ text: '', type: '' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const calculateTotalValue = () => {
        const total = products.reduce((accumulator, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.quantity) || 0;
            return accumulator + (price * quantity);
        }, 0); 
        return total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <div>
            <button onClick={onLogout} style={{ float: 'right', margin: '10px' }}>
                Đăng xuất
            </button>
            <h2>Quản lý sản phẩm</h2>
            {notification.text && (
                <p style={{ color: notification.type === 'error' ? 'red' : 'green' }}>
                    {notification.text}
                </p>
            )}

            <h3>Thêm sản phẩm mới</h3>
            <form onSubmit={handleAddProduct}>
                 <div>
                    <label htmlFor="name">Tên:</label>
                    <input id="name" type="text" name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} disabled={isSubmitting}/>
                </div>
                <div>
                    <label htmlFor="price">Giá:</label>
                    <input id="price" type="number" name="price" placeholder="Giá" value={formData.price} onChange={handleChange} disabled={isSubmitting}/>
                </div>
                <div>
                    <label htmlFor="quantity">SL:</label>
                    <input id="quantity" type="number" name="quantity" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} disabled={isSubmitting}/>
                </div>
                <button type="submit" disabled={isSubmitting || editingId}>
                    {isSubmitting ? 'Đang thêm...' : 'Thêm sản phẩm'}
                </button>
            </form>

            <h3>Danh sách sản phẩm</h3>
            {!isLoadingList && products.length > 0 && (
                <h4 style={{ color: 'blue', border: '1px solid #ccc', padding: '10px' }}>
                    Tổng giá trị kho hàng: {calculateTotalValue()}
                </h4>
            )}

            {/* Bảng danh sách sản phẩm */}
            {isLoadingList ? (
                <p>Đang tải danh sách...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Giá (VND)</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="5">Không có sản phẩm nào.</td></tr>
                        ) : (
                            products.map((product) => (
                                editingId === product.id ? (
                                    // Chế độ SỬA
                                    <tr key={product.id}>
                                        <td colSpan="5">
                                            <form onSubmit={handleUpdateProduct} style={{ display: 'flex', gap: '10px' }}>
                                                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} disabled={isSubmitting} />
                                                <input type="number" name="price" value={editFormData.price} onChange={handleEditFormChange} disabled={isSubmitting} />
                                                <input type="number" name="quantity" value={editFormData.quantity} onChange={handleEditFormChange} disabled={isSubmitting} />
                                                <button type="submit" disabled={isSubmitting}>Lưu</button>
                                                <button type="button" onClick={handleCancelEdit} disabled={isSubmitting}>Hủy</button>
                                            </form>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={product.id}>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        
                                        <td>
                                            {(
                                                (parseFloat(product.price) || 0) * (parseInt(product.quantity) || 0)
                                            ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>

                                        <td>
                                            <button onClick={() => handleEditClick(product)} disabled={deletingId || editingId}>
                                                Sửa
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id || editingId}>
                                                {deletingId === product.id ? 'Đang xóa...' : 'Xóa'}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Product;