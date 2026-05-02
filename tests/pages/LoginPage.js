// tests/pages/LoginPage.js
// Page Object Model (POM) para a página de login do SauceDemo
// Encapsula seletores e ações da página, facilitando manutenção

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Seletores dos elementos da página
    this.usernameInput   = page.locator('#user-name');
    this.passwordInput   = page.locator('#password');
    this.loginButton     = page.locator('#login-button');
    this.errorMessage    = page.locator('[data-test="error"]');
    this.loginContainer  = page.locator('.login_container');
  }

  /** Navega para a página de login */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Realiza o login com as credenciais fornecidas
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Retorna o texto da mensagem de erro visível */
  async getErrorText() {
    return await this.errorMessage.textContent();
  }

  /** Verifica se a mensagem de erro está visível */
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}

module.exports = { LoginPage };
