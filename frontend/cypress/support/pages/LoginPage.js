/**
 * Page Object Model cho trang Login
 * Áp dụng pattern tách biệt selectors và actions
 */
class LoginPage {
  // Selectors
  selectors = {
    usernameInput: '[data-testid="username-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    usernameError: '[data-testid="username-error"]',
    passwordError: '[data-testid="password-error"]',
    toastMessage: ".toast-message",
    toastError: ".toast-message.error",
    toastSuccess: ".toast-message:not(.error)",
    loginForm: ".login-form",
    loginTitle: ".login-title",
  };

  /**
   * Truy cập trang login
   */
  visit() {
    cy.visit("/login");
    cy.url().should("include", "/login");
  }

  /**
   * Kiểm tra các elements có hiển thị không
   */
  checkElementsVisible() {
    cy.get(this.selectors.loginTitle).should("be.visible");
    cy.get(this.selectors.usernameInput).should("be.visible");
    cy.get(this.selectors.passwordInput).should("be.visible");
    cy.get(this.selectors.loginButton).should("be.visible");
  }

  /**
   * Nhập username
   * @param {string} username - Tên đăng nhập
   */
  typeUsername(username) {
    cy.get(this.selectors.usernameInput).clear().type(username);
    return this;
  }

  /**
   * Nhập password
   * @param {string} password - Mật khẩu
   */
  typePassword(password) {
    cy.get(this.selectors.passwordInput).clear().type(password);
    return this;
  }

  /**
   * Click nút đăng nhập
   */
  clickLoginButton() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  /**
   * Thực hiện login với credentials
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   */
  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLoginButton();
    return this;
  }

  /**
   * Kiểm tra username error message
   * @param {string} expectedMessage - Thông báo lỗi mong đợi
   */
  checkUsernameError(expectedMessage) {
    cy.get(this.selectors.usernameError)
      .should("be.visible")
      .and("contain", expectedMessage);
    return this;
  }

  /**
   * Kiểm tra password error message
   * @param {string} expectedMessage - Thông báo lỗi mong đợi
   */
  checkPasswordError(expectedMessage) {
    cy.get(this.selectors.passwordError)
      .should("be.visible")
      .and("contain", expectedMessage);
    return this;
  }

  /**
   * Kiểm tra không có username error
   */
  checkNoUsernameError() {
    cy.get(this.selectors.usernameError).should("not.exist");
    return this;
  }

  /**
   * Kiểm tra không có password error
   */
  checkNoPasswordError() {
    cy.get(this.selectors.passwordError).should("not.exist");
    return this;
  }

  /**
   * Kiểm tra toast success message
   * @param {string} expectedMessage - Thông báo thành công mong đợi
   */
  checkSuccessMessage(expectedMessage) {
    cy.get(this.selectors.toastSuccess)
      .should("be.visible")
      .and("include", expectedMessage);
    return this;
  }

  /**
   * Kiểm tra toast error message
   * @param {string} expectedMessage - Thông báo lỗi mong đợi
   */
  checkErrorMessage(expectedMessage) {
    cy.get(this.selectors.toastError)
      .should("be.visible")
      .and("include", expectedMessage);
    return this;
  }

  /**
   * Kiểm tra chuyển hướng sau khi login thành công
   */
  checkRedirectToProduct() {
    cy.url().should("include", "/product", { timeout: 3000 });
    return this;
  }

  /**
   * Kiểm tra token được lưu trong localStorage
   */
  checkTokenSaved() {
    cy.window().then((window) => {
      const token = window.localStorage.getItem("token");
      expect(token).to.exist;
      expect(token).to.not.be.empty;
    });
    return this;
  }

  /**
   * Clear form inputs
   */
  clearForm() {
    cy.get(this.selectors.usernameInput).clear();
    cy.get(this.selectors.passwordInput).clear();
    return this;
  }

  /**
   * Kiểm tra input field có class invalid
   * @param {string} field - 'username' hoặc 'password'
   */
  checkInvalidClass(field) {
    const selector =
      field === "username"
        ? this.selectors.usernameInput
        : this.selectors.passwordInput;
    cy.get(selector).should("have.class", "invalid");
    return this;
  }
}

export default LoginPage;
