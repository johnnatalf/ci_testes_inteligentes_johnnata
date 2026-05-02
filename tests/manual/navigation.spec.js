// tests/manual/navigation.spec.js
// ============================================================
// TESTE MANUAL 2 — Navegação e Interação com Produtos
// Escrito manualmente sem auxílio de IA
// Ferramenta: Playwright | Aplicação: SauceDemo
// ============================================================

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

const VALID_USER = { username: 'standard_user', password: 'secret_sauce' };

// Hook: faz login antes de cada teste deste grupo
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(VALID_USER.username, VALID_USER.password);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.waitForLoad();
});

test.describe('🛒 [MANUAL] Navegação e Produtos', () => {

  // ── Cenário 1: Listagem de produtos na página de inventário ───────────────
  test('CT-M05 | Página de inventário exibe 6 produtos por padrão', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Assert: título correto
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // Assert: exatamente 6 produtos (catálogo padrão do SauceDemo)
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);

    // Assert: todos os produtos têm nome e preço visíveis
    const names  = await inventoryPage.productNames.allTextContents();
    const prices = await inventoryPage.productPrices.allTextContents();

    expect(names.length).toBe(6);
    expect(prices.length).toBe(6);

    // Assert: preços devem começar com "$"
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }

    console.log(`✅ PASSED | Produtos: ${names.join(', ')}`);
  });

  // ── Cenário 2: Adicionar produto ao carrinho ──────────────────────────────
  test('CT-M06 | Adicionar produto ao carrinho atualiza badge do carrinho', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Assert: carrinho começa vazio (sem badge)
    const initialCount = await inventoryPage.getCartCount();
    expect(initialCount).toBe(0);

    // Act: adiciona o primeiro produto ao carrinho
    await inventoryPage.addFirstProductToCart();

    // Assert: badge do carrinho deve mostrar "1"
    await expect(inventoryPage.cartBadge).toBeVisible();
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);

    console.log(`✅ PASSED | Produto adicionado | Carrinho: ${cartCount} item(s)`);
  });

  // ── Cenário 3: Ordenação de produtos ─────────────────────────────────────
  test('CT-M07 | Ordenação Z→A reordena lista de produtos corretamente', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Pega os nomes antes da ordenação
    const nomesBefore = await inventoryPage.productNames.allTextContents();

    // Act: ordena de Z para A
    await inventoryPage.sortProducts('za');

    // Pega os nomes após ordenação
    const nomesAfter = await inventoryPage.productNames.allTextContents();

    // Assert: a lista deve ter mudado de ordem
    expect(nomesAfter[0]).not.toBe(nomesBefore[0]);

    // Assert: primeiro item deve ser alfabeticamente maior que o último
    const first = nomesAfter[0].toLowerCase();
    const last  = nomesAfter[nomesAfter.length - 1].toLowerCase();
    expect(first > last).toBe(true);

    console.log(`✅ PASSED | Ordenado Z→A | Primeiro: "${nomesAfter[0]}" | Último: "${nomesAfter[nomesAfter.length - 1]}"`);
  });

  // ── Cenário 4: Logout funciona corretamente ───────────────────────────────
  test('CT-M08 | Logout redireciona para a página de login', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const loginPage     = new LoginPage(page);

    // Act: realiza logout
    await inventoryPage.logout();

    // Assert: deve voltar para a página de login
    await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();

    console.log('✅ PASSED | Logout bem-sucedido | Redirecionado para login');
  });

});
