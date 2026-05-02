# 🧪 CI — Testes Inteligentes com Playwright

<!-- Badge de status da pipeline — substitua SEU_USUARIO e SEU_REPO -->
[![CI — Playwright Tests](https://github.com/johnnatalf/ci_testes_inteligentes_johnnata/actions/workflows/ci.yml/badge.svg)](https://github.com/johnnatalf/ci_testes_inteligentes_johnnata/actions/workflows/ci.yml)

> **Disciplina:** Engenharia de Software  
> **Atividade:** Pipeline de CI com testes manuais e com suporte de IA  
> **Ferramenta:** [Playwright](https://playwright.dev) + [GitHub Copilot](https://github.com/features/copilot)  
> **Aplicação alvo:** [SauceDemo](https://www.saucedemo.com)

---

## 📋 Sobre o Projeto

Este repositório implementa **duas pipelines de CI** com GitHub Actions:

| Pipeline | Pasta | Descrição |
|----------|-------|-----------|
| 🔵 Testes Manuais | `tests/manual/` | 2 testes escritos manualmente sem IA |
| 🤖 Testes com IA | `tests/ai/` | 2 testes gerados com GitHub Copilot |

### Aplicação Alvo — SauceDemo

O [SauceDemo](https://www.saucedemo.com) é uma aplicação web pública criada pela Sauce Labs para fins de teste. Possui:
- ✅ Página de **login** com múltiplos tipos de usuário
- ✅ Página de **produtos** com ordenação e navegação
- ✅ Fluxo de **carrinho e checkout** completo
- ✅ Menu de navegação com logout

---

## 🗂️ Estrutura do Projeto

```
ci_testes_inteligentes/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline do GitHub Actions
├── tests/
│   ├── pages/
│   │   ├── LoginPage.js        # Page Object Model — Login
│   │   └── InventoryPage.js    # Page Object Model — Produtos
│   ├── manual/
│   │   ├── login.spec.js       # 🔵 Teste Manual 1: Login
│   │   └── navigation.spec.js  # 🔵 Teste Manual 2: Navegação
│   └── ai/
│       ├── login-ai.spec.js    # 🤖 Teste com IA 1: Login parametrizado
│       └── navigation-ai.spec.js # 🤖 Teste com IA 2: Fluxo E2E + Performance
├── playwright.config.js        # Configuração do Playwright
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org) >= 18.0.0
- [npm](https://www.npmjs.com) >= 9.0.0
- Acesso à internet (os testes acessam https://www.saucedemo.com)

---

## 🚀 Instalação e Execução Local

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/ci_testes_inteligentes_SEU_NOME.git
cd ci_testes_inteligentes_SEU_NOME
```

### 2. Instale as dependências

```bash
npm ci
```

### 3. Instale os browsers do Playwright

```bash
npx playwright install --with-deps chromium firefox
```

### 4. Configure variáveis de ambiente (opcional)

```bash
cp .env.example .env
# Edite o .env se necessário
```

### 5. Execute os testes

```bash
# Todos os testes
npm test

# Apenas testes manuais
npm run test:manual

# Apenas testes com IA
npm run test:ai

# Abrir relatório HTML
npm run test:report
```

---

## 🔄 Pipeline de CI

A pipeline é disparada automaticamente:

| Evento | Branches |
|--------|----------|
| `push` | Qualquer branch **exceto** `main`/`master` |
| `pull_request` | PRs direcionados a `main`/`master` |
| `workflow_dispatch` | Disparo manual pelo GitHub UI |

### Fluxo dos Jobs

```
push/PR
  │
  ├─▶ [🔵 testes-manuais]
  │       ├── Setup Node.js + cache npm
  │       ├── Install Playwright browsers
  │       ├── npx playwright test tests/manual/
  │       ├── Exibe PASSED/FAILED nos logs
  │       └── Publica artefatos (7 dias)
  │
  └─▶ [🤖 testes-ia]  (só roda se manuais passarem)
          ├── Setup Node.js + cache npm
          ├── Install Playwright browsers
          ├── npx playwright test tests/ai/
          ├── Exibe PASSED/FAILED nos logs
          └── Publica artefatos (7 dias)
```

Se qualquer job falhar, toda a pipeline é marcada como **FAILED**.

---

## 🤖 Uso do GitHub Copilot

Os testes em `tests/ai/` foram desenvolvidos com **GitHub Copilot** ativado no VS Code. O Copilot contribuiu com:

- Geração de casos de teste a partir de **prompts em linguagem natural**
- Sugestão de **seletores semânticos resilientes** (`getByRole`, `getByPlaceholder`)
- Criação automática de **tabela de usuários** do SauceDemo para testes parametrizados
- Geração do **fluxo E2E completo** de checkout
- Sugestão de **asserções de performance** (tempo de carregamento)
- Identificação de **casos de borda** (SQL injection, XSS, campos vazios)

---

## 📊 Artefatos Publicados

Após cada execução da pipeline, são publicados:

- `playwright-report/index.html` — Relatório HTML interativo
- `playwright-report/results.json` — Resultados em JSON
- `test-results/` — Screenshots de falhas e vídeos

Disponíveis na aba **Actions → [run] → Artifacts** do GitHub.

---

