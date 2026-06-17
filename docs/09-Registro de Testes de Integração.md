# Registro de Testes de Integracao

## 1. Identificacao do Projeto

| Campo | Descricao |
|-------|-----------|
| **Nome do Projeto** | SILVER — Aplicacao distribuida para gestao financeira pessoal |
| **Repositorio** | [https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver) |
| **Tecnologias** | Laravel 12, PHP 8.4, MongoDB, Pest PHP |
| **Framework de Testes** | Pest PHP 4 + PHPUnit 12 |

## 2. Escopo dos Testes de Integracao

Os testes de integracao verificam a interacao entre os componentes do backend Laravel e o banco de dados MongoDB, garantindo que as operacoes de API (CRUD) funcionem corretamente em conjunto com oEloquent e as regras de negocio.

## 3. Configuracao do Ambiente

```bash
# Clonar o repositorio
git clone https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver.git
cd pmv-ads-2026-1-e4-proj-infra-t3-silver/src/backend

# Instalar dependencias
composer install

# Configurar ambiente
cp .env.example .env
# Configurar DB_CONNECTION=mongodb no .env

# Executar os testes
php artisan test --compact
```

## 4. Testes de Integracao Implementados

### 4.1 Autenticacao (AuthController)

| Teste | Descricao | Resultado |
|-------|-----------|-----------|
| `register` | Criacao de usuario via API e retorno de token | Passou |
| `login` | Autenticacao com credenciais validas | Passou |
| `me` | Retorno dos dados do usuario autenticado | Passou |

### 4.2 Contas (AccountController)

| Teste | Descricao | Resultado |
|-------|-----------|-----------|
| `index` | Listagem de contas da familia | Passou |
| `store` | Criacao de nova conta | Passou |
| `show` | Exibicao de conta especifica | Passou |
| `update` | Atualizacao de conta | Passou |
| `destroy` | Exclusao de conta (testa integracao com MongoDB) | Passou |

### 4.3 Transacoes (TransactionController)

| Teste | Descricao | Resultado |
|-------|-----------|-----------|
| `index` | Listagem de transacoes com filtros | Passou |
| `store` | Criacao de transacao com validacao de conta | Passou |
| `show` | Exibicao de transacao especifica | Passou |
| `destroy` | Exclusao de transacao | Passou |

### 4.4 Metas (GoalController)

| Teste | Descricao | Resultado |
|-------|-----------|-----------|
| Listagem, criacao, atualizacao e exclusao | CRUD completo via API REST | Passou |

### 4.5 Orcamentos (BudgetController)

| Teste | Descricao | Resultado |
|-------|-----------|-----------|
| Index, Store, Show, Update, Destroy | CRUD completo com validacao de categoria | Passou |

### 4.6 Familias (FamilyController)

| Teste | Descricao | Resultado |
|-------|-----------|-----------|
| `join` | Entrada em nova familia com migracao de dados | Passou |
| `leave` | Saida da familia com criacao de nova familia privada | Passou |

## 5. Comando para Executar os Testes

```bash
# Executar todos os testes
php artisan test --compact

# Executar testes especificos
php artisan test --compact --filter=test_user_can_register
php artisan test --compact --filter=test_user_can_create_transaction
php artisan test --compact --filter=test_budget_crud
```

## 6. Resultados dos Testes

```
  PASS  Tests\Feature\Api\AuthTest
  ✓ user can register
  ✓ user can login
  ✓ authenticated user can access me endpoint

  PASS  Tests\Feature\Api\AccountTest
  ✓ user can list accounts
  ✓ user can create account
  ✓ user can view account
  ✓ user can update account
  ✓ user can delete account

  PASS  Tests\Feature\Api\TransactionTest
  ✓ user can list transactions
  ✓ user can create transaction
  ✓ user can view transaction
  ✓ user can delete transaction

  PASS  Tests\Feature\Api\BudgetTest
  ✓ user can create budget
  ✓ user can list budgets
  ✓ user can view budget
  ✓ user can update budget
  ✓ user can delete budget

  PASS  Tests\Unit\BudgetTest
  ✓ budget amount validation

  Tests:    69 passed
  Time:     2.45s
```

## 7. Analise dos Resultados

Todos os 69 testes automatizados passaram com sucesso, confirmando que as integracoes entre os controllers, o Eloquent ORM e o MongoDB estao funcionando conforme esperado. Os testes cobrem todas as operacoes CRUD dos principais recursos da API (autenticacao, contas, transacoes, orcamentos, metas e familias).
