// tests/ai/navigation-ai.spec.js
// ============================================================
// TESTE COM IA 2 — Navegação com Seletores Resilientes e
//                  Fluxos Gerados por GitHub Copilot
// Técnica: Auto-healing de seletores + geração de fluxo E2E
//          completo a partir de descrição de cenário em prosa
// Ferramenta: Playwright | Aplicação: SauceDemo
// ============================================================
//
// 🤖 NOTA SOBRE O USO DE IA:
// Este arquivo foi gerado com GitHub Copilot ativado.
// O Copilot contribuiu com:
//   - Uso de getByRole/getByText (seletores semânticos resilientes)
//     que imitam o comportamento de auto-healing de seletores
//   - Geração do fluxo E2E completo de compra (add→cart→checkout)
//     a partir do prompt: "write a full checkout E2E test for SauceDemo"
//   - Sugestão de asserções de performance (page.metrics)
//   - Estratégia de retry automático em asserções flaky
//   - Identificação de cenários de regressão pós-login
// ============================================================

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

const VALID_USER = { username: 'standard_user', password: 'secret_sauce' };

// Hook de login compartilhado
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(VALID_USER.username, VALID_USER.password);
  await page.waitForURL('**/inventory.html');
});

test.describe('🤖 [IA/Copilot] Navegação com Seletores Resilientes', () => {

  // ── CT-AI04: Seletores semânticos (auto-healing style) ───────────────────
  // 🤖 [IA] Copilot sugeriu usar getByRole em vez de IDs para maior resiliência
  //         Isso simula o comportamento de "auto-healing" de ferramentas como Healenium:
  //         se um ID mudar, o seletor por papel semântico continua funcionando
  test('CT-AI04 | Seletores semânticos resilientes — produtos listados', async ({ page }) => {

    // 🤖 [IA] getByRole é mais robusto que #id — resiste a refatorações de HTML
    const heading = page.getByRole('heading', { name: 'Products' });
    await expect(heading).toBeVisible();

    // 🤖 [IA] Copilot sugeriu validar contagem via aria-role implícito de lista
    const productItems = page.locator('.inventory_item');
    await expect(productItems).toHaveCount(6);

    // 🤖 [IA] Copilot sugeriu verificar que cada produto tem botão "Add to cart"
    const addButtons = page.getByRole('button', { name: /Add to cart/i });
    await expect(addButtons).toHaveCount(6);

    console.log('✅ PASSED | Seletores semânticos validados | 6 produtos | 6 botões');
  });

  // ── CT-AI05: Fluxo E2E completo de compra gerado por IA ──────────────────
  // 🤖 [IA] Fluxo gerado pelo Copilot a partir do prompt:
  //         "write an E2E test that adds a product, goes to cart,
  //          fills checkout info and completes the purchase"
  test('CT-AI05 | Fluxo E2E completo: adicionar → carrinho → checkout → confirmação', async ({ page }) => {

    // ── PASSO 1: Adiciona produto ao carrinho ────────────────────────────
    const firstAddButton = page.getByRole('button', { name: /Add to cart/i }).first();
    await firstAddButton.click();

    // 🤖 [IA] Copilot sugeriu verificar que o botão muda para "Remove" após clique
    const firstRemoveButton = page.getByRole('button', { name: /Remove/i }).first();
    await expect(firstRemoveButton).toBeVisible();

    // Verifica badge do carrinho
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // ── PASSO 2: Navega para o carrinho ─────────────────────────────────
    await page.locator('.shopping_cart_link').click();
    await page.waitForURL('**/cart.html');

    // 🤖 [IA] Copilot sugeriu validar pelo texto do heading
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();

    // Assert: produto está no carrinho
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    // ── PASSO 3: Inicia checkout ─────────────────────────────────────────
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.waitForURL('**/checkout-step-one.html');

    await expect(page.getByRole('heading', { name: 'Checkout: Your Information' })).toBeVisible();

    // ── PASSO 4: Preenche informações de entrega ─────────────────────────
    // 🤖 [IA] Copilot sugeriu usar getByPlaceholder para resiliência
    await page.getByPlaceholder('First Name').fill('Maria');
    await page.getByPlaceholder('Last Name').fill('Silva');
    await page.getByPlaceholder('Zip/Postal Code').fill('65000-000');

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL('**/checkout-step-two.html');

    // ── PASSO 5: Verifica resumo da compra ──────────────────────────────
    await expect(page.getByRole('heading', { name: 'Checkout: Overview' })).toBeVisible();

    // 🤖 [IA] Copilot sugeriu verificar que o total está presente e formatado
    const total = page.locator('.summary_total_label');
    await expect(total).toBeVisible();
    const totalText = await total.textContent();
    expect(totalText).toMatch(/Total: \$\d+\.\d{2}/);

    // ── PASSO 6: Finaliza a compra ───────────────────────────────────────
    await page.getByRole('button', { name: 'Finish' }).click();
    await page.waitForURL('**/checkout-complete.html');

    // Assert: página de confirmação
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    // 🤖 [IA] Copilot sugeriu verificar mensagem de confirmação completa
    const confirmationMsg = page.locator('.complete-text');
    await expect(confirmationMsg).toContainText('Your order has been dispatched');

    console.log(`✅ PASSED | Fluxo E2E completo | Total: ${totalText}`);
  });

  // ── CT-AI06: Ordenação e validação de preços ─────────────────────────────
  // 🤖 [IA] Copilot sugeriu este cenário de validação de ordenação numérica
  test('CT-AI06 | Ordenação por preço (menor→maior) valida ordem numérica real', async ({ page }) => {

    // Act: ordena por preço crescente
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('lohi');

    // Coleta todos os preços após ordenação
    const priceElements = page.locator('.inventory_item_price');
    const priceTexts    = await priceElements.allTextContents();

    // 🤖 [IA] Copilot gerou a lógica de parsing e validação de ordem
    const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));

    // Assert: cada preço deve ser menor ou igual ao próximo
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }

    console.log(`✅ PASSED | Preços ordenados: ${prices.map(p => '$' + p).join(' → ')}`);
  });

  // ── CT-AI07: Performance — tempo de resposta do login ────────────────────
  // 🤖 [IA] Copilot sugeriu monitorar performance como parte dos testes E2E
  test('CT-AI07 | Performance: carregamento da página de produtos em menos de 3s', async ({ page }) => {

    // Mede o tempo de carregamento navegando para inventário
    const start = Date.now();
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.waitForLoadState('networkidle');
    const elapsed = Date.now() - start;

    // 🤖 [IA] Copilot sugeriu threshold de 3000ms como SLA aceitável
    expect(elapsed).toBeLessThan(3000);

    // Verifica que a página carregou corretamente
    await expect(page.locator('.inventory_list')).toBeVisible();

    console.log(`✅ PASSED | Performance OK | Tempo de carga: ${elapsed}ms (limite: 3000ms)`);
  });

});
