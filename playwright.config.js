// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Diretório raiz dos testes
  testDir: './tests',

  // Timeout por teste (30 segundos)
  timeout: 30_000,

  // Timeout para expect
  expect: {
    timeout: 5_000,
  },

  // Execução paralela de testes
  fullyParallel: true,

  // Falha o build em CI se deixar test.only acidentalmente
  forbidOnly: !!process.env.CI,

  // Sem retries em CI para evidenciar falhas reais
  retries: process.env.CI ? 0 : 1,

  // Workers paralelos
  workers: process.env.CI ? 2 : undefined,

  // Reporters: HTML para artefato + lista no terminal
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  use: {
    // URL base da aplicação alvo
    baseURL: 'https://www.saucedemo.com',

    // Captura screenshot apenas em falhas
    screenshot: 'only-on-failure',

    // Grava vídeo apenas em falhas
    video: 'retain-on-failure',

    // Trace apenas em falhas (para debugging)
    trace: 'on-first-retry',

    // Headless em CI, com UI localmente
    headless: true,

    // Viewport padrão
    viewport: { width: 1280, height: 720 },

    // User agent
    userAgent: 'Playwright-CI-Tests/1.0',
  },

  // Projetos de browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Pasta de saída dos artefatos de teste
  outputDir: 'test-results/',
});
