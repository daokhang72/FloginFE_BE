// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command để login
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 */
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login");
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

/**
 * Custom command để login thành công và lưu token
 */
Cypress.Commands.add("loginWithValidCredentials", () => {
  cy.login("testuser", "Test123");
  cy.url().should("include", "/product");
});

/**
 * Custom command để clear localStorage
 */
Cypress.Commands.add("clearAuth", () => {
  cy.clearLocalStorage("token");
});
