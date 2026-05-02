// tests/manual/login.spec.js
// ============================================================
// TESTE MANUAL 1 — Validação de Login
// Escrito manualmente sem auxílio de IA
// Ferramenta: Playwright | Aplicação: SauceDemo
// ============================================================

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

// Credenciais válidas e inválidas do SauceDemo
const CREDENTIALS = {
  valid:   { username: 'standard_user',  password: 'secret_sauce' },
  locked:  { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'usuario_errado', password: 'senha_errada' },
};

test.describe('🔐 [MANUAL] Login — Validação de Autenticação', () => {

  // ── Cenário 1: Login com credenciais válidas ──────────────────────────────
  test('CT-M01 | Login com credenciais válidas redireciona para inventário', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Arrange: navega até a página de login
    await loginPage.goto();

    // Assert: confirma que a página de login está visível
    await expect(loginPage.loginContainer).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Act: realiza login com credenciais válidas
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);

    // Assert: deve redirecionar para a página de inventário
    await inventoryPage.waitForLoad();
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // Assert: lista de produtos deve estar visível
    await expect(inventoryPage.productList).toBeVisible();

    // Assert: deve haver pelo menos 1 produto listado
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    console.log(`✅ PASSED | Login bem-sucedido | Produtos listados: ${productCount}`);
  });

  // ── Cenário 2: Login com usuário bloqueado exibe erro ─────────────────────
  test('CT-M02 | Login com usuário bloqueado exibe mensagem de erro', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();

    // Act: tenta login com usuário bloqueado
    await loginPage.login(CREDENTIALS.locked.username, CREDENTIALS.locked.password);

    // Assert: mensagem de erro deve estar visível
    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBe(true);

    // Assert: mensagem deve mencionar bloqueio
    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('locked out');

    // Assert: deve permanecer na página de login (URL não muda)
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);

    console.log(`✅ PASSED | Erro exibido corretamente: "${errorText}"`);
  });

  // ── Cenário 3: Login com credenciais inválidas exibe erro ─────────────────
  test('CT-M03 | Login com credenciais inválidas exibe mensagem de erro', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();

    // Act: tenta login com credenciais incorretas
    await loginPage.login(CREDENTIALS.invalid.username, CREDENTIALS.invalid.password);

    // Assert: mensagem de erro deve aparecer
    await expect(loginPage.errorMessage).toBeVisible();

    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('Username and password do not match');

    console.log(`✅ PASSED | Erro de credencial exibido: "${errorText}"`);
  });

  // ── Cenário 4: Campos obrigatórios — login sem preencher nada ─────────────
  test('CT-M04 | Login sem preencher campos exibe erro de validação', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();

    // Act: clica em login sem preencher nada
    await loginPage.loginButton.click();

    // Assert: deve exibir erro solicitando username
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('Username is required');

    console.log(`✅ PASSED | Validação de campo obrigatório funcionando: "${errorText}"`);
  });

});
