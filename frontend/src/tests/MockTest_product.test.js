import * as ProductModule from '../services/productService';

jest.mock('../services/productService', () => {
  return {
    productService: {
      createProduct: jest.fn(),
      getProducts: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    },
  };
});

describe('Product Mock Tests - Frontend', () => {
  const { productService } = ProductModule;

  const mockProduct = {
    id: 1,
    name: 'Laptop',
    price: 15000000,
    quantity: 5,
    description: 'RTX 3090',
    categoryId: 1,
    image: 'laptop.jpg'
  };

  const mockList = [mockProduct];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE 
  test('Mock: Create product thành công', async () => {
    productService.createProduct.mockResolvedValue(mockProduct);

    const result = await productService.createProduct(mockProduct);

    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual(mockProduct);
  });

  test('Mock: Create product thất bại', async () => {
    const error = { message: "Create failed" };
    productService.createProduct.mockRejectedValue(error);

    await expect(productService.createProduct(mockProduct))
      .rejects.toEqual(error);

    expect(productService.createProduct).toHaveBeenCalledTimes(1);
  });

  // READ 
  test('Mock: Get products thành công', async () => {
    productService.getProducts.mockResolvedValue(mockList);

    const result = await productService.getProducts();

    expect(productService.getProducts).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockList);
  });

  test('Mock: Get products thất bại', async () => {
    const error = { message: "Fetch failed" };
    productService.getProducts.mockRejectedValue(error);

    await expect(productService.getProducts())
      .rejects.toEqual(error);

    expect(productService.getProducts).toHaveBeenCalledTimes(1);
  });

  // UPDATE
  test('Mock: Update product thành công', async () => {
    const updated = { ...mockProduct, name: "Updated Laptop" };
    productService.updateProduct.mockResolvedValue(updated);

    const result = await productService.updateProduct(updated);

    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    expect(productService.updateProduct).toHaveBeenCalledWith(updated);
    expect(result.name).toBe("Updated Laptop");
  });

  test('Mock: Update product thất bại', async () => {
    const error = { message: "Update failed" };
    productService.updateProduct.mockRejectedValue(error);

    await expect(productService.updateProduct(mockProduct))
      .rejects.toEqual(error);

    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
  });

  // DELETE 
  test('Mock: Delete product thành công', async () => {
    productService.deleteProduct.mockResolvedValue({ success: true });

    const result = await productService.deleteProduct(1);

    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true });
  });

  test('Mock: Delete product thất bại', async () => {
    const error = { message: "Delete failed" };
    productService.deleteProduct.mockRejectedValue(error);

    await expect(productService.deleteProduct(1))
      .rejects.toEqual(error);

    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
  });
});
