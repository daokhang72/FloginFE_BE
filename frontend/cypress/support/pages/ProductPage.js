/**
 * ProductPage - Page Object Model cho Product Page
 * Quản lý tất cả selectors và actions cho trang quản lý sản phẩm
 */

class ProductPage {
  constructor() {
    this.selectors = {
      // Header elements
      pageTitle: "h1",
      searchInput: ".search-input",
      addNewButton: "button.btn-primary",
      logoutButton: "button.btn-danger",

      // Filter section
      filterSection: ".filter-section",
      filterLabel: ".filter-label",
      filterAllButton: ".filter-pill",
      activeFilterPill: ".filter-pill.active",

      // Product grid
      productGrid: ".product-grid",
      productCard: ".product-card",
      productCardTitle: ".card-title",
      productCardPrice: ".card-price",
      productCardCategory: ".card-category",
      productCardImage: ".card-image",
      viewDetailButton: ".view-btn",

      // Pagination
      pagination: ".pagination",
      pageButton: ".page-btn",
      activePageButton: ".page-btn.active",
      prevPageButton: ".page-btn:first",
      nextPageButton: ".page-btn:last",

      // Toast messages
      toastMessage: ".toast-message",
      toastError: ".toast-message.error",

      // Product Form Modal
      formModal: ".modal-overlay",
      formContainer: ".form-container",
      formTitle: "form h3",
      nameInput: 'input[name="name"]',
      priceInput: 'input[name="price"]',
      quantityInput: 'input[name="quantity"]',
      descriptionTextarea: 'textarea[name="description"]',
      categorySelect: 'select[name="categoryId"]',
      imageInput: 'input[name="image"]',
      previewImage: ".image-preview img",
      errorMessage: ".error-message",
      saveButton: 'button[type="submit"]',
      cancelButton: ".btn-secondary",

      // Detail Modal
      detailModal: ".modal-content.detail-modal-width",
      detailHeader: ".detail-header",
      detailTitle: ".detail-header h2",
      detailCloseButton: ".detail-header button",
      detailImage: ".detail-image",
      detailName: ".detail-name",
      detailPrice: ".detail-price",
      detailCategory: ".detail-category",
      detailQuantity: '.detail-row:contains("Tồn kho") span',
      detailDescription: ".detail-description-content",
      detailEditButton: ".detail-footer .btn-warning",
      detailDeleteButton: ".detail-footer .btn-danger",

      // Delete Confirmation Modal
      deleteModal: ".delete-modal-content",
      deleteIcon: ".delete-icon",
      deleteTitle: ".delete-title",
      deleteText: ".delete-text",
      confirmDeleteButton: ".delete-actions .btn-danger",
      cancelDeleteButton: ".delete-actions .btn-secondary",

      // Loading & Error states
      loadingMessage: ".loading-message",
      noResultsMessage: 'p:contains("Không tìm thấy sản phẩm")',
    };
  }

  // Navigation
  visit() {
    cy.visit("/product");
    return this;
  }

  // Header actions
  clickAddNew() {
    cy.get(this.selectors.addNewButton).click();
    return this;
  }

  clickLogout() {
    cy.get(this.selectors.logoutButton).click();
    return this;
  }

  typeSearch(text) {
    cy.get(this.selectors.searchInput).clear().type(text);
    return this;
  }

  clearSearch() {
    cy.get(this.selectors.searchInput).clear();
    return this;
  }

  // Filter actions
  selectFilter(categoryName) {
    if (categoryName === "ALL" || categoryName === "Tất cả") {
      cy.get(this.selectors.filterAllButton).first().click();
    } else {
      cy.get(this.selectors.filterSection)
        .contains(".filter-pill", categoryName)
        .click();
    }
    return this;
  }

  // Product grid actions
  clickProductCard(index = 0) {
    cy.get(this.selectors.productCard).eq(index).click();
    return this;
  }

  clickViewDetail(index = 0) {
    cy.get(this.selectors.productCard)
      .eq(index)
      .find(this.selectors.viewDetailButton)
      .click({ force: true });
    return this;
  }

  // Form actions
  fillProductForm(product) {
    if (product.name) {
      cy.get(this.selectors.nameInput).clear().type(product.name);
    }
    if (product.price) {
      cy.get(this.selectors.priceInput).clear().type(product.price.toString());
    }
    if (product.quantity) {
      cy.get(this.selectors.quantityInput)
        .clear()
        .type(product.quantity.toString());
    }
    if (product.description) {
      cy.get(this.selectors.descriptionTextarea)
        .clear()
        .type(product.description);
    }
    if (product.categoryId) {
      cy.get(this.selectors.categorySelect).select(
        product.categoryId.toString()
      );
    }
    if (product.image) {
      cy.get(this.selectors.imageInput).selectFile(product.image, {
        force: true,
      });
    }
    return this;
  }

  clickSave() {
    cy.get(this.selectors.saveButton).click();
    return this;
  }

  clickCancel() {
    cy.get(this.selectors.cancelButton).first().click();
    return this;
  }

  // Detail modal actions
  clickDetailEdit() {
    cy.get(this.selectors.detailEditButton).click();
    return this;
  }

  clickDetailDelete() {
    cy.get(this.selectors.detailDeleteButton).click();
    return this;
  }

  closeDetailModal() {
    cy.get(this.selectors.detailCloseButton).click();
    return this;
  }

  // Delete modal actions
  confirmDelete() {
    cy.get(this.selectors.confirmDeleteButton).click();
    return this;
  }

  cancelDelete() {
    cy.get(this.selectors.cancelDeleteButton).click();
    return this;
  }

  // Pagination actions
  goToPage(pageNumber) {
    cy.get(this.selectors.pageButton).contains(pageNumber.toString()).click();
    return this;
  }

  clickNextPage() {
    cy.get(this.selectors.nextPageButton).click();
    return this;
  }

  clickPrevPage() {
    cy.get(this.selectors.prevPageButton).click();
    return this;
  }

  // Assertions - Page elements
  shouldHaveTitle(title) {
    cy.get(this.selectors.pageTitle).should("contain", title);
    return this;
  }

  shouldHaveSearchInput() {
    cy.get(this.selectors.searchInput).should("be.visible");
    return this;
  }

  shouldHaveAddButton() {
    cy.get(this.selectors.addNewButton).should("be.visible");
    return this;
  }

  shouldHaveLogoutButton() {
    cy.get(this.selectors.logoutButton).should("be.visible");
    return this;
  }

  // Assertions - Filters
  shouldHaveFilterSection() {
    cy.get(this.selectors.filterSection).should("be.visible");
    return this;
  }

  shouldHaveActiveFilter(categoryName) {
    cy.get(this.selectors.activeFilterPill).should("contain", categoryName);
    return this;
  }

  // Assertions - Products
  shouldHaveProducts(count) {
    if (count === 0) {
      cy.get(this.selectors.noResultsMessage).should("be.visible");
    } else {
      cy.get(this.selectors.productCard).should("have.length", count);
    }
    return this;
  }

  shouldHaveMinimumProducts(minCount) {
    cy.get(this.selectors.productCard).should("have.length.at.least", minCount);
    return this;
  }

  shouldContainProductName(name) {
    cy.get(this.selectors.productCardTitle).should("contain", name);
    return this;
  }

  shouldShowNoResults() {
    cy.get(this.selectors.noResultsMessage).should("be.visible");
    return this;
  }

  // Assertions - Form
  shouldShowForm() {
    cy.get(this.selectors.formModal).should("be.visible");
    cy.get(this.selectors.formContainer).should("be.visible");
    return this;
  }

  shouldNotShowForm() {
    cy.get(this.selectors.formModal).should("not.exist");
    return this;
  }

  shouldHaveFormTitle(title) {
    cy.get(this.selectors.formTitle).should("contain", title);
    return this;
  }

  shouldShowFormError(fieldName, message) {
    cy.get(`[name="${fieldName}"]`)
      .parent()
      .find(this.selectors.errorMessage)
      .should("contain", message);
    return this;
  }

  shouldHaveFormValue(fieldName, value) {
    cy.get(`[name="${fieldName}"]`).should("have.value", value);
    return this;
  }

  // Assertions - Detail Modal
  shouldShowDetailModal() {
    cy.get(this.selectors.detailModal).should("be.visible");
    return this;
  }

  shouldNotShowDetailModal() {
    cy.get(this.selectors.detailModal).should("not.exist");
    return this;
  }

  shouldShowDetailName(name) {
    cy.get(this.selectors.detailName).should("contain", name);
    return this;
  }

  shouldShowDetailPrice(price) {
    cy.get(this.selectors.detailPrice).should("contain", price);
    return this;
  }

  // Assertions - Delete Modal
  shouldShowDeleteModal() {
    cy.get(this.selectors.deleteModal).should("be.visible");
    return this;
  }

  shouldNotShowDeleteModal() {
    cy.get(this.selectors.deleteModal).should("not.exist");
    return this;
  }

  shouldShowDeleteConfirmation(productName) {
    cy.get(this.selectors.deleteText).should("contain", productName);
    return this;
  }

  // Assertions - Messages
  shouldShowSuccessMessage(message) {
    cy.get(this.selectors.toastMessage)
      .should("be.visible")
      .and("contain", message);
    return this;
  }

  shouldShowErrorMessage(message) {
    cy.get(this.selectors.toastError)
      .should("be.visible")
      .and("contain", message);
    return this;
  }

  // Assertions - Pagination
  shouldHavePagination() {
    cy.get(this.selectors.pagination).should("be.visible");
    return this;
  }

  shouldNotHavePagination() {
    cy.get(this.selectors.pagination).should("not.exist");
    return this;
  }

  shouldBeOnPage(pageNumber) {
    cy.get(this.selectors.activePageButton).should("contain", pageNumber);
    return this;
  }

  // Utility methods
  waitForProducts() {
    cy.get(this.selectors.productGrid).should("be.visible");
    return this;
  }

  waitForToastToDisappear() {
    cy.get(this.selectors.toastMessage, { timeout: 5000 }).should("not.exist");
    return this;
  }

  getProductCount() {
    return cy.get(this.selectors.productCard).its("length");
  }

  getProductNameByIndex(index) {
    return cy
      .get(this.selectors.productCard)
      .eq(index)
      .find(this.selectors.productCardTitle)
      .invoke("text");
  }
}

export default ProductPage;
