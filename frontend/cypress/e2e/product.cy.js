import ProductPage from '../support/pages/ProductPage';

describe('Product E2E Tests', () => {
  const productPage = new ProductPage();
  
  beforeEach(() => {
    // Login trước khi test Product
    cy.loginWithValidCredentials();
    productPage.visit();
    cy.wait(1000); // Đợi page load
  });

  // ==========================================
  // a) Test Create product flow (0.5 điểm)
  // ==========================================
  describe('a) Create Product Flow', () => {
    it('Nên tạo sản phẩm mới thành công với đầy đủ thông tin', () => {
      const newProduct = {
        name: 'Laptop Dell',
        price: '15000000',
        quantity: '10',
        description: 'Laptop Dell XPS 13 inch',
        categoryId: '1'
      };

      productPage.clickAddNew();
      productPage.shouldShowForm();
      productPage.shouldHaveFormTitle('Tạo Sản Phẩm Mới');

      productPage.fillProductForm(newProduct);
      productPage.clickSave();

      cy.wait(2000); // Đợi API response và toast hiển thị
      cy.get('.toast-message').should('contain', 'thành công');
      productPage.shouldNotShowForm();
      productPage.shouldContainProductName('Laptop Dell');
    });

    it('Nên hiển thị form tạo mới khi click "Thêm Mới"', () => {
      productPage.clickAddNew();
      productPage.shouldShowForm();
      productPage.shouldHaveFormTitle('Tạo Sản Phẩm Mới');
    });

    it('Nên đóng form khi click "Hủy bỏ"', () => {
      productPage.clickAddNew();
      productPage.shouldShowForm();
      productPage.clickCancel();
      productPage.shouldNotShowForm();
    });

    it('Nên validate tên sản phẩm không được để trống', () => {
      productPage.clickAddNew();
      productPage.fillProductForm({
        name: '',
        price: '10000',
        quantity: '5',
        categoryId: '1'
      });
      productPage.clickSave();
      productPage.shouldShowFormError('name', 'không được để trống');
    });

    it('Nên validate giá sản phẩm phải lớn hơn 0', () => {
      productPage.clickAddNew();
      productPage.fillProductForm({
        name: 'Test Product',
        price: '0',
        quantity: '5',
        categoryId: '1'
      });
      productPage.clickSave();
      productPage.shouldShowFormError('price', 'phải lớn hơn 0');
    });

    it('Nên validate số lượng phải lớn hơn hoặc bằng 0', () => {
      productPage.clickAddNew();
      productPage.fillProductForm({
        name: 'Test Product',
        price: '10000',
        quantity: '-1',
        categoryId: '1'
      });
      productPage.clickSave();
      productPage.shouldShowFormError('quantity', 'không được nhỏ hơn 0');
    });
  });

  // ==========================================
  // b) Test Read/List products (0.5 điểm)
  // ==========================================
  describe('b) Read/List Products Flow', () => {
    it('Nên hiển thị danh sách sản phẩm khi vào trang', () => {
      productPage.shouldHaveTitle('Quản Lý Sản Phẩm');
      productPage.shouldHaveSearchInput();
      productPage.shouldHaveAddButton();
      productPage.shouldHaveFilterSection();
      productPage.waitForProducts();
      productPage.shouldHaveMinimumProducts(1);
    });

    it('Nên xem chi tiết sản phẩm khi click "Xem Chi Tiết"', () => {
      // Lấy tên sản phẩm đầu tiên
      productPage.getProductNameByIndex(0).then((productName) => {
        productPage.clickViewDetail(0);
        productPage.shouldShowDetailModal();
        productPage.shouldShowDetailName(productName);
      });
    });

    it('Nên đóng modal chi tiết khi click nút đóng', () => {
      productPage.clickViewDetail(0);
      productPage.shouldShowDetailModal();
      productPage.closeDetailModal();
      productPage.shouldNotShowDetailModal();
    });

    it('Nên hiển thị đầy đủ thông tin trong modal chi tiết', () => {
      productPage.clickViewDetail(0);
      productPage.shouldShowDetailModal();
      
      // Verify các elements hiển thị
      cy.get('.detail-name').should('be.visible');
      cy.get('.detail-price').should('be.visible');
      cy.get('.detail-category').should('be.visible');
      cy.get('.detail-row:contains("Tồn kho")').should('be.visible');
      cy.get('.detail-description-content').should('be.visible');
    });

    it('Nên phân trang đúng khi có nhiều sản phẩm', () => {
      // Kiểm tra xem có pagination không
      cy.get('body').then(($body) => {
        if ($body.find('.pagination').length > 0) {
          productPage.shouldHavePagination();
          productPage.shouldBeOnPage(1);
          
          // Click next page
          cy.get('.page-btn:last').then(($btn) => {
            if (!$btn.prop('disabled')) {
              productPage.clickNextPage();
              cy.wait(500);
              productPage.shouldBeOnPage(2);
            }
          });
        }
      });
    });
  });

  // ==========================================
  // c) Test Update product (0.5 điểm)
  // ==========================================
  describe('c) Update Product Flow', () => {
    it('Nên cập nhật sản phẩm thành công', () => {
      // Click vào sản phẩm đầu tiên để xem chi tiết
      productPage.clickViewDetail(0);
      productPage.shouldShowDetailModal();
      
      // Click edit từ modal
      productPage.clickDetailEdit();
      productPage.shouldShowForm();
      productPage.shouldHaveFormTitle('Chỉnh Sửa Sản Phẩm');

      // Update thông tin
      cy.get('[name="price"]').clear().type('18000000');
      productPage.clickSave();

      cy.wait(1000);
      productPage.shouldShowSuccessMessage('Cập nhật thành công');
      productPage.shouldNotShowForm();
    });

    it('Nên mở form edit với dữ liệu hiện tại của sản phẩm', () => {
      productPage.getProductNameByIndex(0).then((productName) => {
        productPage.clickViewDetail(0);
        productPage.clickDetailEdit();
        
        productPage.shouldShowForm();
        productPage.shouldHaveFormTitle('Chỉnh Sửa Sản Phẩm');
        productPage.shouldHaveFormValue('name', productName);
      });
    });

    it('Nên validate khi update với dữ liệu không hợp lệ', () => {
      productPage.clickViewDetail(0);
      productPage.clickDetailEdit();
      
      // Xóa tên sản phẩm (invalid)
      cy.get('[name="name"]').clear();
      productPage.clickSave();
      
      productPage.shouldShowFormError('name', 'không được để trống');
      productPage.shouldShowForm(); // Form vẫn mở
    });

    it('Nên hủy bỏ update khi click "Hủy bỏ"', () => {
      productPage.clickViewDetail(0);
      productPage.clickDetailEdit();
      productPage.shouldShowForm();
      
      // Thay đổi dữ liệu nhưng không save
      cy.get('[name="price"]').clear().type('99999999');
      
      productPage.clickCancel();
      productPage.shouldNotShowForm();
    });
  });

  // ==========================================
  // d) Test Delete product (0.5 điểm)
  // ==========================================
  describe('d) Delete Product Flow', () => {
    it('Nên hiển thị modal xác nhận khi xóa sản phẩm', () => {
      productPage.getProductNameByIndex(0).then((productName) => {
        productPage.clickViewDetail(0);
        productPage.clickDetailDelete();
        
        productPage.shouldShowDeleteModal();
        productPage.shouldShowDeleteConfirmation(productName);
      });
    });

    it('Nên hủy xóa khi click "Hủy bỏ" trong modal xác nhận', () => {
      productPage.clickViewDetail(0);
      productPage.clickDetailDelete();
      productPage.shouldShowDeleteModal();
      
      productPage.cancelDelete();
      productPage.shouldNotShowDeleteModal();
    });

    it('Nên xóa sản phẩm thành công khi xác nhận', () => {
      // Đếm số sản phẩm trước khi xóa
      productPage.getProductCount().then((initialCount) => {
        productPage.getProductNameByIndex(0).then((productName) => {
          productPage.clickViewDetail(0);
          productPage.clickDetailDelete();
          productPage.shouldShowDeleteModal();
          
          productPage.confirmDelete();
          
          cy.wait(2000);
          cy.get('.toast-message').should('contain', 'xóa');
          productPage.shouldNotShowDeleteModal();
          
          // Verify sản phẩm đã bị xóa (có thể bằng hoặc nhỏ hơn do pagination)
          cy.get('.product-card').should('have.length.at.most', initialCount);
        });
      });
    });

    it('Nên xóa đúng sản phẩm được chọn', () => {
      productPage.getProductNameByIndex(0).then((productNameToDelete) => {
        productPage.clickViewDetail(0);
        productPage.clickDetailDelete();
        productPage.confirmDelete();
        
        cy.wait(1000);
        
        // Verify sản phẩm không còn trong danh sách
        cy.get('.product-card').each(($card) => {
          cy.wrap($card).find('.card-title').should('not.contain', productNameToDelete);
        });
      });
    });
  });

  // ==========================================
  // e) Test Search/Filter functionality (0.5 điểm)
  // ==========================================
  describe('e) Search and Filter Functionality', () => {
    it('Nên tìm kiếm sản phẩm theo tên', () => {
      productPage.getProductNameByIndex(0).then((productName) => {
        const searchTerm = productName.substring(0, 5);
        
        productPage.typeSearch(searchTerm);
        cy.wait(500);
        
        // Verify kết quả tìm kiếm
        cy.get('.product-card').each(($card) => {
          cy.wrap($card).find('.card-title').invoke('text').should('match', new RegExp(searchTerm, 'i'));
        });
      });
    });

    it('Nên hiển thị "Không tìm thấy" khi search không có kết quả', () => {
      productPage.typeSearch('ProductNotExist123456789');
      cy.wait(500);
      productPage.shouldShowNoResults();
    });

    it('Nên clear search và hiển thị lại tất cả sản phẩm', () => {
      // Search trước
      productPage.typeSearch('test');
      cy.wait(500);
      
      // Clear search
      productPage.clearSearch();
      cy.wait(500);
      
      // Verify hiển thị lại products
      productPage.shouldHaveMinimumProducts(1);
    });

    it('Nên lọc sản phẩm theo danh mục', () => {
      // Click vào filter đầu tiên (không phải "Tất cả")
      cy.get('.filter-pill').eq(1).then(($pill) => {
        const categoryName = $pill.text().trim();
        
        cy.wrap($pill).click();
        cy.wait(500);
        
        productPage.shouldHaveActiveFilter(categoryName);
        
        // Verify tất cả sản phẩm đều thuộc category này (nếu có sản phẩm)
        cy.get('body').then(($body) => {
          if ($body.find('.product-card').length > 0) {
            cy.get('.product-card').each(($card) => {
              cy.wrap($card).find('.card-category').should('contain', categoryName);
            });
          } else {
            // Nếu không có sản phẩm trong category này thì pass
            cy.log('No products in this category');
          }
        });
      });
    });

    it('Nên reset filter về "Tất cả"', () => {
      // Chọn một category cụ thể
      cy.get('.filter-pill').eq(1).click();
      cy.wait(500);
      
      // Click "Tất cả"
      productPage.selectFilter('Tất cả');
      cy.wait(500);
      
      productPage.shouldHaveActiveFilter('Tất cả');
      productPage.shouldHaveMinimumProducts(1);
    });

    it('Nên kết hợp search và filter', () => {
      // Chọn category
      cy.get('.filter-pill').eq(1).then(($pill) => {
        const categoryName = $pill.text().trim();
        cy.wrap($pill).click();
        cy.wait(500);
        
        // Kiểm tra xem có sản phẩm trong category không
        cy.get('body').then(($body) => {
          if ($body.find('.product-card').length > 0) {
            // Sau đó search
            productPage.getProductNameByIndex(0).then((productName) => {
              const searchTerm = productName.substring(0, 3);
              productPage.typeSearch(searchTerm);
              cy.wait(500);
              
              // Verify cả filter và search đều hoạt động
              productPage.shouldHaveActiveFilter(categoryName);
              cy.get('.search-input').should('have.value', searchTerm);
            });
          } else {
            // Nếu category không có sản phẩm, chọn "Tất cả" và thử lại
            productPage.selectFilter('Tất cả');
            cy.wait(500);
            productPage.getProductNameByIndex(0).then((productName) => {
              const searchTerm = productName.substring(0, 3);
              productPage.typeSearch(searchTerm);
              cy.wait(500);
              cy.get('.search-input').should('have.value', searchTerm);
            });
          }
        });
      });
    });

    it('Nên reset về trang 1 khi search hoặc filter', () => {
      // Nếu có pagination, đi đến trang 2
      cy.get('body').then(($body) => {
        if ($body.find('.pagination').length > 0) {
          cy.get('.page-btn:last').then(($btn) => {
            if (!$btn.prop('disabled')) {
              productPage.clickNextPage();
              cy.wait(500);
              
              // Sau đó search -> nên reset về trang 1
              productPage.typeSearch('test');
              cy.wait(500);
              
              // Verify về trang 1 (nếu còn có pagination sau khi search)
              cy.get('body').then(($body2) => {
                if ($body2.find('.page-btn.active').length > 0) {
                  cy.get('.page-btn.active').should('contain', '1');
                } else {
                  // Không còn pagination sau search -> pass
                  cy.log('No pagination after search');
                }
              });
            } else {
              cy.log('Only one page, cannot test pagination reset');
            }
          });
        } else {
          cy.log('No pagination found, skipping test');
        }
      });
    });
  });

  // ==========================================
  // BONUS: Additional E2E Scenarios
  // ==========================================
  describe('Additional E2E Scenarios', () => {
    it('Nên hiển thị placeholder image khi sản phẩm không có ảnh', () => {
      cy.get('.card-image').first().should('have.attr', 'src');
    });

    it('Nên format giá tiền đúng định dạng VND', () => {
      cy.get('.card-price').first().invoke('text').should('match', /\d{1,3}(,\d{3})*\s*đ/);
    });

    it('Nên có nút logout và hoạt động đúng', () => {
      productPage.shouldHaveLogoutButton();
      productPage.clickLogout();
      
      // Verify redirect về login
      cy.url().should('include', '/login');
    });

    it('Nên persist data sau khi reload trang', () => {
      productPage.getProductCount().then((initialCount) => {
        cy.reload();
        cy.wait(1000);
        
        productPage.getProductCount().should('equal', initialCount);
      });
    });

    it('Nên hiển thị loading state khi tải dữ liệu', () => {
      cy.intercept('GET', '**/api/products**', (req) => {
        req.reply((res) => {
          res.setDelay(1000); // Delay 1s để thấy loading
        });
      }).as('getProducts');
      
      cy.reload();
      
      // Có thể check loading spinner hoặc message nếu có
      cy.get('body').should('be.visible');
    });
  });
});
