# Testes de Sistema

## 1. Identificacao do Projeto

| Campo | Detalhe |
|---|---|
| **Projeto** | Silver — Gestao Financeira Familiar |
| **Periodo** | Junho/2026 |
| **Stack** | Laravel 12 / MongoDB / Livewire Flux / React Native Expo |
| **Testes Automatizados (API)** | 69 cenarios · aprovados |
| **Endpoint Base** | `https://silver-backed-deploy-main-fgsfuz.free.laravel.cloud/api` |

---

## 2. Requisitos

### 2.1 Funcionais

| ID | Descricao | Responsavel |
|---|---|---|
| **RF01** | CRUD de transacoes (receitas/despesas) via API, Web e Mobile | Victor |
| **RF02** | Dashboard / Home com resumo financeiro | Aecio |
| **RF03** | Gerenciar grupos familiares | Nathan |
| **RF04** | CRUD de categorias financeiras | Yago |
| **RF05** | Gerenciamento de contas e saldo consolidado | Adrian |
| **RF06** | CRUD de metas financeiras com progresso | Vinicius |
| **RF07** | Autenticacao (Login/Registro) e perfil | Aecio |
| **RF08** | Anexar comprovantes por camera/galeria | Nathan |
| **RF09** | CRUD de orcamentos mensais | Adrian |
| **RF10** | Historico filtrável de movimentacoes | Victor |
| **RF11** | Tema claro/escuro no Mobile | Nathan |
| **RF12** | Extrato mensal com saldo por periodo | Vinicius |
| **RF13** | Sincronizacao Web/Mobile via API | Nathan |
| **RF14** | Indicadores de gastos por categoria | Yago |

---

## 3. Testes — Aplicacao Web (Laravel Livewire)

### 3.1 Autenticacao / Login

**Responsavel:** Aecio | **RF07**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Registrar novo usuario | Criado com familyId e token retornados | ✅ |
| 2 | Login com credenciais validas | Token recebido, mesmo usuario retornado | ✅ |
| 3 | Login com senha invalida | "Credenciais invalidas." | ✅ |
| 4 | Acessar rota protegida sem token | Bloqueado | ✅ |
| 5 | Acessar `/me` com token valido | Nome e email corretos | ✅ |

---

### 3.2 Transacoes (CRUD)

**Responsavel:** Victor | **RF01, RF10**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar receita | Criada com sucesso | ✅ |
| 2 | Criar despesa | Criada com sucesso | ✅ |
| 3 | Listar transacoes | Lista funcional | ✅ |
| 4 | Excluir transacao | Excluida, saldo revertido | ✅ |
| 5 | Editar transacao | Descricao/valor alterados | ✅ |
| 6 | Validar obrigatorios | Erros exibidos | ✅ |
| 7 | Validar valor R$ 0,00 | Validacao OK | ✅ |
| 8 | Estado vazio | "Nenhuma transacao" | ✅ |

---

### 3.3 Contas Bancarias

**Responsavel:** Adrian | **RF05**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar conta corrente | Criada, saldo R$ 1.500 | ✅ |
| 2 | Criar conta poupanca | Criada | ✅ |
| 3 | Listar contas da familia | Listagem funcional | ✅ |
| 4 | Exibir saldo individual | R$ 1.500,00 | ✅ |
| 5 | Editar nome e saldo | Nome e saldo alterados | ✅ |
| 6 | Excluir conta | Excluida | ✅ |
| 7 | Criar conta invalida | Validacao OK | ✅ |

---

### 3.4 Categorias

**Responsavel:** Yago | **RF04, RF14**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar categoria (nome + cor + icone) | Criada | ✅ |
| 2 | Criar segunda categoria | Criada | ✅ |
| 3 | Criar categoria duplicada | Bloqueado | ✅ |
| 4 | Listar categorias | Listagem funcional | ✅ |
| 5 | Editar nome da categoria | Nome alterado | ✅ |
| 6 | Excluir categoria | Excluida | ✅ |

---

### 3.5 Orcamentos Mensais

**Responsavel:** Adrian | **RF09**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar orcamento por categoria | Criado, limite R$ 1.000 | ✅ |
| 2 | Criar orcamento duplicado (mesma categoria/mes) | Bloqueado | ✅ |
| 3 | Criar segundo orcamento | Criado | ✅ |
| 4 | Listar orcamentos | Listagem funcional | ✅ |
| 5 | Editar limite do orcamento | R$ 1.500 | ✅ |
| 6 | Mes invalido (`2026-13`) | Validacao OK | ✅ |
| 7 | Excluir orcamento | Excluido | ✅ |

---

### 3.6 Metas Financeiras

**Responsavel:** Vinicius | **RF06, RF12**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar meta com valor alvo e prazo | R$ 10.000, dez/2026 | ✅ |
| 2 | Criar meta sem prazo | Criada | ✅ |
| 3 | Listar metas | Listagem funcional | ✅ |
| 4 | Editar valor alvo | R$ 12.000 | ✅ |
| 5 | Criar meta invalida (titulo vazio, valor 0) | Validacao OK | ✅ |
| 6 | Excluir meta | Excluida | ✅ |
| 7 | Meta excluida retorna 404 | Confirmado | ✅ |

---

### 3.7 Familias

**Responsavel:** Nathan | **RF03, RF13**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Visualizar dados da familia | Nome e dados da familia | ✅ |
| 2 | Editar nome da familia | Nome alterado | ✅ |
| 3 | Listar membros da familia | Membro(s) retornados | ✅ |
| 4 | Join com codigo invalido | Bloqueado | ✅ |

---

## 4. Testes — Aplicacao Mobile (React Native / Expo)

### 4.1 Autenticacao / Login

**Responsavel:** Aecio | **RF07**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Registrar novo usuario | API respondeu 201 | ✅ |
| 2 | Login com credenciais validas | Token Sanctum recebido | ✅ |
| 3 | Login com senha invalida | "Credenciais invalidas." | ✅ |
| 4 | Rota protegida sem token | Bloqueado | ✅ |

---

### 4.2 Lista de Transacoes

**Responsavel:** Victor | **RF01, RF10**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Listar transacoes agrupadas por data | API retorna lista | ✅ |
| 2 | Filtrar por tipo (receita/despesa) | Filtro funcional | ✅ |
| 3 | Criar transacao inline | API real 201 | ✅ |
| 4 | Excluir transacao | Exclusao real | ✅ |

---

### 4.3 Nova Transacao

**Responsavel:** Victor | **RF01, RF08**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar receita | API real | ✅ |
| 2 | Criar despesa | API real | ✅ |
| 3 | Selecionar conta na lista | Listagem funcional | ✅ |
| 4 | Validar campos obrigatorios | Validacao OK | ✅ |
| 5 | Validar valor invalido | Validacao OK | ✅ |

---

### 4.4 Detalhes da Transacao

**Responsavel:** Victor | **RF01**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Carregar detalhes da transacao | API real | ✅ |
| 2 | Badge de valor (↑ receita ↓ despesa) | Correto | ✅ |
| 3 | Card com dados completos | Exibidos | ✅ |
| 4 | Excluir pelos detalhes | Exclusao real | ✅ |
| 5 | Erro com ID invalido | Tratado | ✅ |

---

### 4.5 Contas Bancarias

**Responsavel:** Adrian | **RF05**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar conta | API OK | ✅ |
| 2 | Listar contas da familia | API OK | ✅ |
| 3 | Editar conta | API OK | ✅ |
| 4 | Excluir conta | API OK | ✅ |
| 5 | Validacao de formulario | API OK | ✅ |

---

### 4.6 Categorias

**Responsavel:** Yago | **RF04, RF14**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar categoria | API OK | ✅ |
| 2 | Listar categorias | API OK | ✅ |
| 3 | Editar categoria | API OK | ✅ |
| 4 | Excluir categoria (com fallback) | API OK | ✅ |
| 5 | Duplicidade bloqueada | API OK | ✅ |

---

### 4.7 Orcamentos Mensais

**Responsavel:** Adrian | **RF09**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar orcamento | API OK | ✅ |
| 2 | Duplicidade (mesma categoria/mes) | API OK | ✅ |
| 3 | Listar orcamentos | API OK | ✅ |
| 4 | Editar limite | API OK | ✅ |
| 5 | Mes invalido | API OK | ✅ |
| 6 | Excluir orcamento | API OK | ✅ |

---

### 4.8 Metas Financeiras

**Responsavel:** Vinicius | **RF06, RF12**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Criar meta com prazo | API OK | ✅ |
| 2 | Criar meta sem prazo | API OK | ✅ |
| 3 | Listar metas | API OK | ✅ |
| 4 | Editar valor alvo | API OK | ✅ |
| 5 | Validacao (titulo vazio, valor 0) | API OK | ✅ |
| 6 | Excluir meta | API OK | ✅ |
| 7 | Confirmar exclusao (GET 404) | API OK | ✅ |

---

### 4.9 Familias

**Responsavel:** Nathan | **RF03, RF13**

| # | Cenario | Resultado Obtido | Status |
|---|---|---|---|
| 1 | Visualizar familia | API OK | ✅ |
| 2 | Editar nome da familia | API OK | ✅ |
| 3 | Listar membros | API OK | ✅ |
| 4 | Join com codigo invalido | API OK | ✅ |

---

## 5. Testes de API Automatizados

### Como rodar

```bash
# Backend (necessita MongoDB configurado — executar no CI/CD ou servidor de deploy)
cd src/backend
php artisan test tests/Feature/Api/

# Mobile
cd src/mobile
npx jest
```

# Resultados dos Testes Automatizados

## Backend (Laravel + Pest) — 69 testes | 150 assertions

### RF01 / RF10 — CRUD de transacoes e historico filtrável (Victor)
- `TransactionApiTest.php` — 11 testes
- Criar receita, criar despesa, listar, ver por ID, deletar
- Filtrar por tipo (`income`/`expense`)
- Filtrar por conta (`accountId`)
- Validacao de tipo invalido, campo obrigatorio, escopo por familia

### RF02 — Dashboard / Home com resumo financeiro (Aecio)
- `DashboardApiTest.php` — 5 testes
- Resumo de contas (saldo total)
- Transacoes recentes
- Total de receitas vs despesas
- Metas ativas
- Orcamentos do mes

### RF03 / RF13 — Grupos familiares e sincronizacao (Nathan)
- `FamilyApiTest.php` — 8 testes
- Visualizar familia, atualizar nome, listar membros
- Sair da familia (cria nova familia privada)
- Entrar em outra familia (merge de historico)
- Migracao de contas ao trocar de familia
- Prevencao de entrar na propria familia
- Sincronizacao (acesso a todos os endpoints)

### RF04 / RF14 — CRUD de categorias e indicadores (Yago)
- `CategoryApiTest.php` — 10 testes
- Listar, criar, ver, atualizar, deletar categoria
- Categoria criada nao e default
- Nao permite deletar categoria padrao
- Nome duplicado rejeitado
- Delecao move transacoes para fallback ("Sem Categoria")
- Categorias default aparecem primeiro na listagem

### RF05 / RF09 — Contas e orcamentos (Adrian)
- `AccountApiTest.php` — 7 testes
- Listar, criar, ver, atualizar, deletar conta
- Tipo invalido rejeitado
- Escopo por familia (nao ve contas de outras familias)

### RF06 / RF12 — Metas financeiras e extrato mensal (Vinicius)
- `GoalApiTest.php` — 9 testes
- Listar, criar, ver, atualizar, deletar meta
- Status invalido rejeitado
- Metas sao por usuario (nao ve metas de outros)
- Progresso calculado corretamente (75%)
- Marcar meta como concluida

### RF07 — Autenticacao e perfil (Aecio)
- `AuthApiTest.php` — 7 testes
- Registro de novo usuario
- Email duplicado rejeitado
- Senha curta rejeitada
- Login com credenciais validas
- Login com credenciais invalidas
- Perfil (`/api/me`) autenticado
- Perfil bloqueado sem autenticacao

### RF09 — Orcamentos (Adrian) — testes existentes corrigidos
- `BudgetApiTest.php` — 8 testes
- CRUD completo, filtro por mes, validacoes, duplicatas

---

## Mobile (Jest) — 13 testes

### Utilitarios
- `formatters.test.ts` — 4 testes
  - `formatCurrency` (R$ 1.500,50)
  - `formatCurrency` (R$ 0,00)
  - `formatDate` (dd/mm/aaaa)
  - `formatPercent` (75%)

### Tratamento de erros
- `api-error.test.ts` — 3 testes
  - Mensagem de erro de validacao
  - Mensagem generica (fallback)
  - Mensagem de erro de rede

### RF11 — Tema claro/escuro
- `theme.test.ts` — 6 testes
  - Tema claro possui todas as chaves
  - Tema escuro possui todas as chaves
  - Temas claro e escuro tem valores diferentes
  - `spacing`, `radius`, `typography` com valores corretos

---

## 6. Evidencias

### Web
<img width="521" alt="silvertestes" src="https://github.com/user-attachments/assets/ce6c61cc-73d0-4820-be5b-7f207b0c62c3" />
<img width="510" alt="teste4" src="https://github.com/user-attachments/assets/e196abed-8278-40ab-a093-02cbe00fb487" />
<img width="426" alt="teste3" src="https://github.com/user-attachments/assets/1526bd9f-3b54-447f-a3fa-36fd50097f24" />
<img width="462" alt="teste2" src="https://github.com/user-attachments/assets/2b4b43bf-9786-4a46-900a-4cd62ef23cb1" />
<img width="388" alt="mobiletest" src="https://github.com/user-attachments/assets/028e597e-c352-4f9a-beee-529cefa1eeb9" />

---

## 7. Distribuicao por Responsavel

| Pessoa | Web | Mobile | Requisitos | Status |
|---|---|---|---|---|
| **Aecio** | Login | Login | RF02, RF07 | ✅ API testada |
| **Victor** | Transacoes CRUD | Lista · Nova · Detalhes | RF01, RF10 | ✅ API testada |
| **Adrian** | Contas · Orcamentos | Contas · Orcamentos | RF05, RF09 | ✅ API testada |
| **Nathan** | Familias | Familias | RF03, RF13 | ✅ API testada |
| **Vinicius** | Metas · Extrato | Metas · Extrato | RF06, RF12 | ✅ API testada |
| **Yago** | Categorias · Indicadores | Categorias · Indicadores | RF04, RF14 | ✅ API testada |

---

> *Documento gerado em Junho/2026 — Total: 82 cenarios de teste aprovados.
> - 69 no backend (Laravel/Pest) — requisicoes reais na API
> - 13 no mobile (Jest) — formatacao, erros, tema*
