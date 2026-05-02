// tests/ai/login-ai.spec.js
// ============================================================
// TESTE COM IA 1 — Login com Geração Inteligente de Cenários
// Gerado com auxílio do GitHub Copilot
// Técnica: Geração de casos de teste a partir de descrição em
//          linguagem natural + sugestão automática de asserções
// Ferramenta: Playwright | Aplicação: SauceDemo
// ============================================================
//
// 🤖 NOTA SOBRE O USO DE IA:
// Este arquivo foi desenvolvido com GitHub Copilot ativado.
// O Copilot sugeriu automaticamente:
//   - Cenários de borda (usuário com nome vazio, só espaços)
//   - Asserções de acessibilidade (aria-label, role)
//   - Estrutura de parametrização via test.each
//   - Comentários explicativos inline
//   - Tratamento de estados de loading/redirect
// A geração foi guiada por prompts descritivos no estilo:
//   "test login with all SauceDemo user types and assert error messages"
// ============================================================

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

// 🤖 [IA] Tabela de usuários gerada pelo Copilot a partir da doc do SauceDemo
//    O Copilot identificou automaticamente todos os tipos de usuário disponíveis
const SAUCEDEMO_USERS = [
  {
    type: 'standard',
    username: 'standard_user',
    password: 'secret_sauce',
    expectSuccess: true,
    description: 'usuário padrão com acesso total',
  },
  {
    type: 'problem',
    username: 'problem_user',
    password: 'secret_sauce',
    expectSuccess: true,
    description: 'usuário com bugs visuais intencionais',
  },
  {
    type: 'performance_glitch',
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    expectSuccess: true,
    description: 'usuário com delay artificial na resposta',
  },
  {
    type: 'locked',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectSuccess: false,
    expectedError: 'Sorry, this user has been locked out',
    description: 'usuário bloqueado',
  },
];

// 🤖 [IA] Cenários de borda sugeridos pelo Copilot
const EDGE_CASES = [
  { label: 'username vazio',   username: '',         password: 'qualquer',     errorFragment: 'Username is required' },
  { label: 'password vazio',   username: 'qualquer', password: '',             errorFragment: 'Password is required' },
  { label: 'ambos vazios',     username: '',         password: '',             errorFragment: 'Username is required' },
  { label: 'SQL injection',    username: "' OR '1'='1", password: "' OR '1'='1", errorFragment: 'Username and password do not match' },
  { label: 'XSS no username',  username: '<script>alert(1)</script>', password: 'x', errorFragment: 'Username and password do not match' },
];

test.describe('🤖 [IA/Copilot] Login — Cenários Gerados com IA', () => {

  // ── Testes parametrizados para todos os tipos de usuário ──────────────────
  // 🤖 [IA] Estrutura test.each sugerida pelo Copilot para cobertura completa
  for (const user of SAUCEDEMO_USERS) {
    test(`CT-AI01 | Login como "${user.type}" (${user.description})`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Arrange
      await loginPage.goto();

      // 🤖 [IA] Asserção de acessibilidade sugerida pelo Copilot
      await expect(loginPage.usernameInput).toHaveAttribute('type', 'text');
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

      // Act
      // 🤖 [IA] Copilot sugeriu usar timeout maior para o performance_glitch_user
      const loginTimeout = user.type === 'performance_glitch' ? 15_000 : 5_000;
      await loginPage.login(user.username, user.password);

      if (user.expectSuccess) {
        // Assert: login bem-sucedido
        const inventoryPage = new InventoryPage(page);
        await page.waitForURL('**/inventory.html', { timeout: loginTimeout });
        await expect(inventoryPage.pageTitle).toHaveText('Products');

        // 🤖 [IA] Copilot sugeriu verificar o title da página via document.title
        const title = await page.title();
        expect(title).toBeTruthy();

        console.log(`✅ PASSED | Tipo: ${user.type} | Login OK | Timeout usado: ${loginTimeout}ms`);
      } else {
        // Assert: login falhou com mensagem esperada
        await expect(loginPage.errorMessage).toBeVisible();
        const errorText = await loginPage.getErrorText();
        expect(errorText).toContain(user.expectedError ?? 'error');

        console.log(`✅ PASSED | Tipo: ${user.type} | Erro esperado: "${errorText}"`);
      }
    });
  }

  // ── Testes de borda com inputs inválidos ──────────────────────────────────
  for (const edge of EDGE_CASES) {
    test(`CT-AI02 | Borda: "${edge.label}" exibe erro correto`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Arrange
      await loginPage.goto();

      // Act
      await loginPage.login(edge.username, edge.password);

      // Assert
      await expect(loginPage.errorMessage).toBeVisible();
      const errorText = await loginPage.getErrorText();
      expect(errorText).toContain(edge.errorFragment);

      // 🤖 [IA] Copilot sugeriu verificar que permanece na URL raiz
      await expect(page).toHaveURL(/.*saucedemo\.com\/?$/);

      console.log(`✅ PASSED | Borda "${edge.label}" | Erro: "${errorText}"`);
    });
  }

  // ── Teste de UI visual de login ───────────────────────────────────────────
  // 🤖 [IA] Cenário de inspeção visual sugerido pelo Copilot
  test('CT-AI03 | Elementos de UI do login são acessíveis e visíveis', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 🤖 [IA] Copilot gerou estas asserções de acessibilidade automaticamente
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();

    // Verifica placeholder dos campos
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');

    // Captura screenshot para evidência visual (artefato do CI)
    await page.screenshot({ path: 'test-results/login-ui-visual.png', fullPage: true });

    console.log('✅ PASSED | Elementos de UI validados | Screenshot salvo');
  });

});
