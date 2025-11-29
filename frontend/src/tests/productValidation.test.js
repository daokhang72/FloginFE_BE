import { validateProduct } from '../utils/productValidation';

describe('Product Validation Tests (Frontend)', () => {

    // Dữ liệu mẫu hợp lệ để tái sử dụng
    const validProduct = {
        name: 'Laptop Dell',
        price: 15000000,
        quantity: 10,
        description: 'Mô tả ngắn gọn',
        categoryId: 1
    };

    // --- 1. TEST NAME ---
    test('TC_PROD_001: Tên sản phẩm rỗng hoặc khoảng trắng', () => {
        expect(validateProduct({ ...validProduct, name: '' }).name).toBe('Tên sản phẩm không được để trống');
        expect(validateProduct({ ...validProduct, name: '   ' }).name).toBe('Tên sản phẩm không được để trống');
    });

    test('TC_PROD_002: Tên sản phẩm quá ngắn (< 3 ký tự)', () => {
        expect(validateProduct({ ...validProduct, name: 'AB' }).name).toBe('Tên sản phẩm phải có ít nhất 3 ký tự');
    });

    test('TC_PROD_003: Tên sản phẩm quá dài (> 100 ký tự)', () => {
        const longName = 'a'.repeat(101);
        expect(validateProduct({ ...validProduct, name: longName }).name).toBe('Tên sản phẩm không được quá 100 ký tự');
    });

    // --- 2. TEST PRICE ---
    test('TC_PROD_004: Giá không phải là số', () => {
        expect(validateProduct({ ...validProduct, price: 'abc' }).price).toBe('Giá sản phẩm không hợp lệ');
        expect(validateProduct({ ...validProduct, price: null }).price).toBe('Giá sản phẩm không hợp lệ');
    });

    test('TC_PROD_005: Giá âm hoặc bằng 0', () => {
        expect(validateProduct({ ...validProduct, price: -5000 }).price).toBe('Giá sản phẩm phải lớn hơn 0');
        expect(validateProduct({ ...validProduct, price: 0 }).price).toBe('Giá sản phẩm phải lớn hơn 0');
    });

    test('TC_PROD_006: Giá quá lớn (> 999,999,999)', () => {
        expect(validateProduct({ ...validProduct, price: 1000000000 }).price).toBe('Giá sản phẩm quá lớn (tối đa 999,999,999)');
    });

    // --- 3. TEST QUANTITY ---
    test('TC_PROD_007: Số lượng không phải là số', () => {
        expect(validateProduct({ ...validProduct, quantity: 'xyz' }).quantity).toBe('Số lượng không hợp lệ');
    });

    test('TC_PROD_008: Số lượng là số thập phân (Float)', () => {
        // Test nhánh !Number.isInteger(quantity)
        expect(validateProduct({ ...validProduct, quantity: 10.5 }).quantity).toBe('Số lượng phải là số nguyên');
    });

    test('TC_PROD_009: Số lượng bằng 0 (Theo logic trong file của bạn)', () => {
        // Test nhánh quantity == 0
        expect(validateProduct({ ...validProduct, quantity: 0 }).quantity).toBe('Số lượng phải lớn hơn 0');
    });

    test('TC_PROD_010: Số lượng âm', () => {
        expect(validateProduct({ ...validProduct, quantity: -1 }).quantity).toBe('Số lượng không được nhỏ hơn 0');
    });

    test('TC_PROD_011: Số lượng quá lớn (> 99,999)', () => {
        expect(validateProduct({ ...validProduct, quantity: 100000 }).quantity).toBe('Số lượng quá lớn (tối đa 99,999)');
    });

    // --- 4. TEST DESCRIPTION ---
    test('TC_PROD_012: Mô tả quá dài (> 500 ký tự)', () => {
        const longDesc = 'a'.repeat(501);
        expect(validateProduct({ ...validProduct, description: longDesc }).description).toBe('Mô tả không được quá 500 ký tự');
    });

    // --- 5. TEST CATEGORY ---
    test('TC_PROD_013: Danh mục chưa chọn hoặc không hợp lệ', () => {
        expect(validateProduct({ ...validProduct, categoryId: '' }).categoryId).toBe('Vui lòng chọn danh mục');
        expect(validateProduct({ ...validProduct, categoryId: 0 }).categoryId).toBe('Vui lòng chọn danh mục');
        expect(validateProduct({ ...validProduct, categoryId: null }).categoryId).toBe('Vui lòng chọn danh mục');
    });

    // --- 6. TEST HỢP LỆ ---
    test('TC_PROD_014: Sản phẩm hợp lệ hoàn toàn', () => {
        const errors = validateProduct(validProduct);
        expect(Object.keys(errors).length).toBe(0);
    });
});