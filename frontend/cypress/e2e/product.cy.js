describe("Product E2E Tests", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");

    // login trước
    cy.get('[data-testid="username-input"]').type("testuser");
    cy.get('[data-testid="password-input"]').type("Test123");
    cy.get('[data-testid="login-button"]').click();

    cy.visit("http://localhost:3000/products");
  });

  it("Tạo sản phẩm mới", () => {
    cy.get('[data-testid="add-product-btn"]').click();

    cy.get('[data-testid="product-name"]').type("Laptop Dell");
    cy.get('[data-testid="product-price"]').type("15000000");
    cy.get('[data-testid="product-quantity"]').type("10");

    cy.get('[data-testid="submit-btn"]').click();

    cy.get('[data-testid="success-message"]').should("contain", "thành công");
    cy.contains('[data-testid="product-item"]', "Laptop Dell").should("exist");
  });
});
