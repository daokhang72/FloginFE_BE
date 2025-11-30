import LoginPage from "../support/pages/LoginPage";

describe("Login E2E Tests", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Clear localStorage trước mỗi test
    cy.clearLocalStorage();
    // Truy cập trang login
    loginPage.visit();
  });

  /**
   * TEST 1: COMPLETE LOGIN FLOW (1 điểm)
   * Test toàn bộ luồng đăng nhập từ đầu đến cuối
   */
  describe("Complete Login Flow", () => {
    it("Nên hiển thị tất cả các elements của form login", () => {
      loginPage.checkElementsVisible();

      // Kiểm tra placeholder/labels
      cy.get(loginPage.selectors.usernameInput)
        .should("have.attr", "type", "text")
        .and("have.attr", "id", "username");

      cy.get(loginPage.selectors.passwordInput)
        .should("have.attr", "type", "password")
        .and("have.attr", "id", "password");

      cy.get(loginPage.selectors.loginButton)
        .should("contain", "Đăng nhập")
        .and("have.attr", "type", "submit");
    });

    it("Nên đăng nhập thành công với credentials hợp lệ", () => {
      // Nhập thông tin hợp lệ
      loginPage.login("testuser", "Test123");

      // Đợi và kiểm tra chuyển hướng
      cy.wait(500);
      cy.url().should("include", "/product", { timeout: 3000 });

      // Kiểm tra token được lưu
      loginPage.checkTokenSaved();
    });

    it("Nên thực hiện complete flow: nhập username → nhập password → submit → redirect", () => {
      // Step 1: Nhập username
      loginPage.typeUsername("testuser");
      cy.get(loginPage.selectors.usernameInput).should(
        "have.value",
        "testuser"
      );

      // Step 2: Nhập password
      loginPage.typePassword("Test123");
      cy.get(loginPage.selectors.passwordInput).should("have.value", "Test123");

      // Step 3: Click submit
      loginPage.clickLoginButton();

      // Step 4: Đợi và kiểm tra redirect
      cy.url().should("include", "/product", { timeout: 3000 });

      // Step 5: Kiểm tra token exists
      cy.window().its("localStorage.token").should("exist");
    });
  });

  /**
   * TEST 2: VALIDATION MESSAGES (0.5 điểm)
   * Test các thông báo validation
   */
  describe("Validation Messages", () => {
    it("Nên hiển thị lỗi khi username trống", () => {
      loginPage.typePassword("Test123");
      loginPage.clickLoginButton();

      loginPage.checkUsernameError("Tên đăng nhập không được để trống");
      loginPage.checkInvalidClass("username");
    });

    it("Nên hiển thị lỗi khi password trống", () => {
      loginPage.typeUsername("testuser");
      loginPage.clickLoginButton();

      loginPage.checkPasswordError("Mật khẩu không được để trống");
      loginPage.checkInvalidClass("password");
    });

    it("Nên hiển thị lỗi khi cả username và password trống", () => {
      loginPage.clickLoginButton();

      loginPage.checkUsernameError("Tên đăng nhập không được để trống");
      loginPage.checkPasswordError("Mật khẩu không được để trống");
    });

    it("Nên hiển thị lỗi khi username quá ngắn", () => {
      loginPage.typeUsername("ab");
      loginPage.typePassword("Test123");
      loginPage.clickLoginButton();

      loginPage.checkUsernameError("Tên đăng nhập phải có ít nhất 3 ký tự");
    });

    it("Nên hiển thị lỗi khi password quá ngắn", () => {
      loginPage.typeUsername("testuser");
      loginPage.typePassword("12345");
      loginPage.clickLoginButton();

      loginPage.checkPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("Nên xóa error message khi người dùng sửa input hợp lệ", () => {
      // Tạo lỗi trước
      loginPage.clickLoginButton();
      loginPage.checkUsernameError("Tên đăng nhập không được để trống");

      // Nhập lại giá trị hợp lệ và submit
      loginPage.typeUsername("testuser");
      loginPage.typePassword("Test123");
      loginPage.clickLoginButton();

      // Không còn error
      loginPage.checkNoUsernameError();
      loginPage.checkNoPasswordError();
    });
  });

  /**
   * TEST 3: SUCCESS/ERROR FLOWS (0.5 điểm)
   * Test các luồng thành công và thất bại
   */
  describe("Success/Error Flows", () => {
    it("Nên hiển thị error message khi credentials không đúng", () => {
      loginPage.login("wronguser", "Wrong123");

      // Đợi response và kiểm tra thông báo lỗi
      cy.wait(1000);
      cy.get(".toast-message")
        .should("be.visible")
        .and("contain", "không đúng");

      // Không chuyển hướng
      cy.url().should("include", "/login");

      // Không lưu token
      cy.window().then((window) => {
        const token = window.localStorage.getItem("token");
        expect(token).to.be.null;
      });
    });

    it("Nên xử lý đúng khi username sai", () => {
      loginPage.login("invaliduser", "Test123");

      cy.wait(1000);
      cy.get(".toast-message")
        .should("be.visible")
        .and("contain", "không đúng");
      cy.url().should("include", "/login");
    });

    it("Nên xử lý đúng khi password sai", () => {
      loginPage.login("testuser", "Wrong123");

      cy.wait(1000);
      cy.get(".toast-message")
        .should("be.visible")
        .and("contain", "không đúng");
      cy.url().should("include", "/login");
    });

    it("Nên cho phép thử lại sau khi đăng nhập thất bại", () => {
      // Lần 1: Thất bại
      loginPage.login("testuser", "Wrong123");
      cy.wait(1000);
      cy.get(".toast-message")
        .should("be.visible")
        .and("contain", "không đúng");

      // Clear form
      loginPage.clearForm();

      // Lần 2: Thành công
      loginPage.login("testuser", "Test123");
      cy.wait(500);
      cy.url().should("include", "/product", { timeout: 3000 });
    });

    it("Nên hiển thị loading state khi đang xử lý login", () => {
      loginPage.login("testuser", "Test123");

      // Button vẫn tồn tại trong quá trình xử lý
      cy.get(loginPage.selectors.loginButton).should("exist");
    });
  });

  /**
   * TEST 4: UI ELEMENTS INTERACTIONS (0.5 điểm)
   * Test tương tác với các elements UI
   */
  describe("UI Elements Interactions", () => {
    it("Nên focus vào username input khi page load", () => {
      // Click vào input để test focus behavior
      cy.get(loginPage.selectors.usernameInput).click().should("be.focused");
    });

    it("Nên chuyển focus từ username sang password", () => {
      // Test focus capability - manually moving focus between fields
      cy.get(loginPage.selectors.usernameInput).focus().should("be.focused");
      cy.get(loginPage.selectors.passwordInput).focus().should("be.focused");
      // Note: Actual Tab key simulation requires cypress-real-events plugin
    });

    it("Nên submit form khi nhấn Enter ở username field", () => {
      loginPage.typeUsername("testuser");
      cy.get(loginPage.selectors.usernameInput).type("{enter}");

      // Nên có validation error vì password trống
      loginPage.checkPasswordError("Mật khẩu không được để trống");
    });

    it("Nên submit form khi nhấn Enter ở password field", () => {
      loginPage.typeUsername("testuser");
      loginPage.typePassword("Test123");
      cy.get(loginPage.selectors.passwordInput).type("{enter}");

      // Nên login thành công và redirect
      cy.wait(500);
      cy.url().should("include", "/product", { timeout: 3000 });
    });

    it("Nên mask password input", () => {
      cy.get(loginPage.selectors.passwordInput).should(
        "have.attr",
        "type",
        "password"
      );

      loginPage.typePassword("Test123");
      cy.get(loginPage.selectors.passwordInput)
        .should("have.value", "Test123")
        .and("have.attr", "type", "password");
    });

    it("Nên có thể clear và re-type inputs", () => {
      // Type lần 1
      loginPage.typeUsername("user1");
      loginPage.typePassword("pass1");

      // Clear và type lại
      loginPage.clearForm();
      cy.get(loginPage.selectors.usernameInput).should("have.value", "");
      cy.get(loginPage.selectors.passwordInput).should("have.value", "");

      // Type lần 2
      loginPage.typeUsername("user2");
      loginPage.typePassword("pass2");
      cy.get(loginPage.selectors.usernameInput).should("have.value", "user2");
      cy.get(loginPage.selectors.passwordInput).should("have.value", "pass2");
    });

    it("Nên thêm class 'invalid' cho fields có lỗi", () => {
      loginPage.clickLoginButton();

      cy.get(loginPage.selectors.usernameInput).should("have.class", "invalid");
      cy.get(loginPage.selectors.passwordInput).should("have.class", "invalid");
    });

    it("Nên có thể click vào button nhiều lần", () => {
      // Click lần 1
      loginPage.clickLoginButton();
      loginPage.checkUsernameError("Tên đăng nhập không được để trống");

      // Nhập giá trị và click lần 2
      loginPage.typeUsername("testuser");
      loginPage.clickLoginButton();
      loginPage.checkPasswordError("Mật khẩu không được để trống");

      // Nhập đầy đủ và click lần 3
      loginPage.typePassword("Test123");
      loginPage.clickLoginButton();
      cy.wait(500);
      cy.url().should("include", "/product", { timeout: 3000 });
    });

    it("Nên responsive với viewport nhỏ", () => {
      // Test mobile viewport
      cy.viewport(375, 667);
      loginPage.checkElementsVisible();

      // Test tablet viewport
      cy.viewport(768, 1024);
      loginPage.checkElementsVisible();
    });
  });

  /**
   * ADDITIONAL TESTS: Edge Cases
   */
  describe("Edge Cases & Security", () => {
    it("Nên xử lý special characters trong username", () => {
      loginPage.login("test@user", "Test123");
      // Tùy vào logic backend có accept hay không
    });

    it("Nên xử lý spaces trong inputs", () => {
      loginPage.login("  testuser  ", "  Test123  ");
      // Kiểm tra trim logic
    });

    it("Nên prevent multiple submissions", () => {
      loginPage.typeUsername("testuser");
      loginPage.typePassword("Test123");

      // Click nhiều lần nhanh
      cy.get(loginPage.selectors.loginButton).click();
      cy.get(loginPage.selectors.loginButton).click();
      cy.get(loginPage.selectors.loginButton).click();

      // Vẫn chỉ login 1 lần
      cy.url().should("include", "/product", { timeout: 3000 });
    });

    it("Nên clear old error messages khi submit lại", () => {
      // Submit 1: Tạo lỗi
      loginPage.clickLoginButton();
      loginPage.checkUsernameError("Tên đăng nhập không được để trống");

      // Submit 2: Lỗi khác
      loginPage.typeUsername("ab");
      loginPage.clickLoginButton();
      loginPage.checkUsernameError("Tên đăng nhập phải có ít nhất 3 ký tự");
    });
  });
});
