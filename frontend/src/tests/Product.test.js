import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom';
import Product from '../components/Product';
import { getProducts, addProduct, deleteProduct } from '../services/api';

jest.mock('../services/api');

const mockProducts = [
    { id: 1, name: 'Sản phẩm A', price: 100 },
    { id: 2, name: 'Sản phẩm B', price: 200 },
];

const newProduct = {
    id: 3,
    name: 'Sản phẩm C',
    price: '300',
    quantity: '10',
    category: 'Test',
    description: 'Mô tả test',
};

describe('Product Component', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ========== Test Case 1: Tải danh sách sản phẩm ==========
    describe('Fetching Products', () => {
        test('1. Hiển thị danh sách sản phẩm khi tải thành công', async () => {
            getProducts.mockResolvedValue(mockProducts);

            render(<Product />);
            expect(await screen.findByText('Sản phẩm A')).toBeInTheDocument();
            expect(getProducts).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Sản phẩm B')).toBeInTheDocument();
        });

        test('2. Hiển thị thông báo lỗi khi tải danh sách thất bại', async () => {
            getProducts.mockRejectedValue(new Error('API Fail'));

            render(<Product />);
            const errorMsg = 'Không thể tải danh sách sản phẩm.';
            expect(await screen.findByText(errorMsg)).toBeInTheDocument();
            expect(screen.queryByText('Sản phẩm A')).toBeNull();
        });
    });

    // ========== Test Case 2: Thêm sản phẩm ==========
    describe('Adding Products', () => {
        test('3. Hiển thị lỗi validation nếu thiếu Tên hoặc Giá', async () => {
            getProducts.mockResolvedValue([]);

            render(<Product />);
            fireEvent.click(screen.getByRole('button', { name: /Thêm sản phẩm/i }));

            const errorMsg = 'Tên và giá sản phẩm là bắt buộc!';
            expect(await screen.findByText(errorMsg)).toBeInTheDocument();

            expect(addProduct).not.toHaveBeenCalled();
        });

        test('4. Thêm sản phẩm thành công', async () => {
            getProducts.mockResolvedValue(mockProducts);
            addProduct.mockResolvedValue(newProduct);

            render(<Product />);
            await screen.findByText('Sản phẩm A');
            fireEvent.change(screen.getByPlaceholderText('Tên sản phẩm'), {
                target: { value: 'Sản phẩm C' },
            });
            fireEvent.change(screen.getByPlaceholderText('Giá'), {
                target: { value: '300' },
            });
            fireEvent.click(screen.getByRole('button', { name: /Thêm sản phẩm/i }));

            await waitFor(() => {
                expect(addProduct).toHaveBeenCalledWith(
                    expect.objectContaining({ name: 'Sản phẩm C', price: '300' })
                );
            });

            expect(await screen.findByText('Sản phẩm C')).toBeInTheDocument();
            expect(await screen.findByText('✅ Thêm sản phẩm thành công!')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Tên sản phẩm').value).toBe('');
        });
    });

    // ========== Test Case 3: Xóa sản phẩm ==========
    describe('Deleting Products', () => {
        test('5. Xóa sản phẩm thành công', async () => {
            getProducts.mockResolvedValue(mockProducts);
            deleteProduct.mockResolvedValue({});

            render(<Product />);

            const productA = await screen.findByText('Sản phẩm A');

            const productLi = productA.closest('li');
            const deleteButton = within(productLi).getByRole('button', { name: /Xóa/i });

            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(deleteProduct).toHaveBeenCalledWith(1);
            });

            expect(await screen.findByText('🗑️ Xóa sản phẩm thành công.')).toBeInTheDocument();
            expect(screen.queryByText('Sản phẩm A')).toBeNull();
            expect(screen.getByText('Sản phẩm B')).toBeInTheDocument();
        });

        test('6. Hiển thị lỗi khi xóa sản phẩm thất bại', async () => {
            getProducts.mockResolvedValue(mockProducts);
            deleteProduct.mockRejectedValue(new Error('Delete Fail'));

            render(<Product />);

            const productA = await screen.findByText('Sản phẩm A');
            const productLi = productA.closest('li');
            const deleteButton = within(productLi).getByRole('button', { name: /Xóa/i });

            fireEvent.click(deleteButton);

            expect(await screen.findByText('❌ Lỗi khi xóa sản phẩm.')).toBeInTheDocument();

            expect(screen.getByText('Sản phẩm A')).toBeInTheDocument();
        });
    });
});