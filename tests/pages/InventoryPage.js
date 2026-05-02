// tests/pages/InventoryPage.js
// Page Object Model (POM) para a página de produtos do SauceDemo

class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Seletores dos elementos da página de inventário
    this.pageTitle        = page.locator('.title');
    this.productList      = page.locator('.inventory_list');
    this.productItems     = page.locator('.inventory_item');
    this.sortDropdown     = page.locator('[data-test="product-sort-container"]');
    this.cartIcon         = page.locator('.shopping_cart_link');
    this.cartBadge        = page.locator('.shopping_cart_badge');
    this.menuButton       = page.locator('#react-burger-menu-btn');
    this.logoutLink       = page.locator('#logout_sidebar_link');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.productNames     = page.locator('.inventory_item_name');
    this.productPrices    = page.locator('.inventory_item_price');
  }

  /** Aguarda o carregamento completo da página de inventário */
  async waitForLoad() {
    await this.page.waitForURL('**/inventory.html');
    await this.productList.waitFor({ state: 'visible' });
  }

  /** Retorna a quantidade de produtos listados */
  async getProductCount() {
    return await this.productItems.count();
  }

  /** Adiciona o primeiro produto ao carrinho */
  async addFirstProductToCart() {
    await this.addToCartButtons.first().click();
  }

  /**
   * Ordena os produtos pelo critério especificado
   * @param {string} value - ex: 'az', 'za', 'lohi', 'hilo'
   */
  async sortProducts(value) {
    await this.sortDropdown.selectOption(value);
  }

  /** Abre o menu lateral */
  async openMenu() {
    await this.menuButton.click();
  }

  /** Realiza o logout */
  async logout() {
    await this.openMenu();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }

  /** Retorna o número de itens no carrinho */
  async getCartCount() {
    const badge = this.cartBadge;
    const visible = await badge.isVisible();
    if (!visible) return 0;
    const text = await badge.textContent();
    return parseInt(text || '0', 10);
  }

  /** Navega para o carrinho */
  async goToCart() {
    await this.cartIcon.click();
  }
}

module.exports = { InventoryPage };
