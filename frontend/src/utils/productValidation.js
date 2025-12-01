/**
 * Validate Product Data
 */
export const validateProduct = (product) => {
  const errors = {};

  // 1. Product Name [cite: 113]
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Tên sản phẩm không được để trống';
  } else if (product.name.length < 3) {
    errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
  } else if (product.name.length > 100) {
    errors.name = 'Tên sản phẩm không được quá 100 ký tự';
  }

  // 2. Price [cite: 114, 115]
  const price = parseFloat(product.price);
  if (isNaN(price)) {
    errors.price = 'Giá sản phẩm không hợp lệ';
  } else if (price <= 0) {
    // PDF không yêu cầu, nhưng ví dụ test (TC2 [cite: 286]) có test giá âm
    errors.price = 'Giá sản phẩm phải lớn hơn 0';
  } else if (price > 999999999) {
    errors.price = 'Giá sản phẩm quá lớn (tối đa 999,999,999)';
  }

  // 3. Quantity [cite: 116]
  const quantity = Number(product.quantity);
  if (isNaN(quantity)) {
    errors.quantity = 'Số lượng không hợp lệ';
  } else if (!Number.isInteger(quantity)) {
    errors.quantity = 'Số lượng phải là số nguyên';
  } else if (quantity === 0) {
    errors.quantity = 'Số lượng phải lớn hơn 0';
  } else if (quantity < 0) {
    errors.quantity = 'Số lượng không được nhỏ hơn 0';
  } else if (quantity > 99999) {
    errors.quantity = 'Số lượng quá lớn (tối đa 99,999)';
  }

  // 4. Description [cite: 117]
  if (product.description && product.description.length > 500) {
    errors.description = 'Mô tả không được quá 500 ký tự';
  }

  // 5. Category [cite: 118]
  if (!product.categoryId || product.categoryId === '' || product.categoryId === 0) {
      errors.categoryId = 'Vui lòng chọn danh mục';
    }
    
  return errors;
};