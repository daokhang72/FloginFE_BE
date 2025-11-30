describe("Login E2E Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("Hiển thị form login", () => {
    cy.get('[data-testid="username-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");
  });

  it("Login thành công", () => {
    cy.get('[data-testid="username-input"]').type("testuser");
    cy.get('[data-testid="password-input"]').type("Test123");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-message"]').should("contain", "thành công");
  });
});
