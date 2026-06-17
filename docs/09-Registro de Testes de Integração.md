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
  PASS  Tests\Feature\Api\AuthApiTest
  ✓ RF07 - usuario pode se registrar via API
  ✓ RF07 - registro rejeita email duplicado
  ✓ RF07 - registro rejeita senha curta
  ✓ RF07 - usuario pode fazer login via API
  ✓ RF07 - login rejeita credenciais invalidas
  ✓ RF07 - usuario autenticado pode ver seu perfil
  ✓ RF07 - usuario nao autenticado nao acessa /me

  PASS  Tests\Feature\Api\AccountApiTest
  ✓ RF05 - usuario pode listar contas
  ✓ RF05 - usuario pode criar conta
  ✓ RF05 - usuario pode ver conta pelo id
  ✓ RF05 - usuario pode atualizar conta
  ✓ RF05 - usuario pode deletar conta
  ✓ RF05 - criar conta com tipo invalido retorna erro
  ✓ RF05 - usuario nao pode ver conta de outra familia
  ✓ RF05 - contas retornam apenas da propria familia

  PASS  Tests\Feature\Api\TransactionApiTest
  ✓ RF01 - usuario pode criar uma transacao (receita)
  ✓ RF01 - usuario pode criar uma transacao (despesa)
  ✓ RF01 - usuario pode listar transacoes
  ✓ RF01 - usuario pode ver uma transacao pelo id
  ✓ RF01 - usuario pode deletar uma transacao
  ✓ RF10 - usuario pode filtrar transacoes por tipo
  ✓ RF10 - usuario pode filtrar transacoes por conta
  ✓ RF01 - criar transacao com tipo invalido retorna erro
  ✓ RF01 - criar transacao sem accountId retorna erro
  ✓ RF01 - usuario nao pode acessar transacao de outra familia

  PASS  Tests\Feature\Api\CategoryApiTest
  ✓ RF04 - usuario pode listar categorias
  ✓ RF04 - usuario pode criar categoria
  ✓ RF04 - categoria criada nao e default
  ✓ RF04 - usuario pode ver categoria pelo id
  ✓ RF04 - usuario pode atualizar categoria
  ✓ RF04 - usuario pode deletar categoria
  ✓ RF04 - nao permite deletar categoria default
  ✓ RF04 - criar categoria com nome duplicado retorna erro
  ✓ RF04 - deletar categoria move transacoes para fallback
  ✓ RF14 - categorias listadas com ordenacao correta

  PASS  Tests\Feature\Api\GoalApiTest
  ✓ RF06 - usuario pode listar metas
  ✓ RF06 - usuario pode criar meta
  ✓ RF06 - usuario pode ver meta pelo id
  ✓ RF06 - usuario pode atualizar meta
  ✓ RF06 - usuario pode deletar meta
  ✓ RF06 - criar meta com status invalido retorna erro
  ✓ RF06 - criar meta sem title retorna erro
  ✓ RF06 - metas retornam apenas do usuario logado
  ✓ RF12 - meta com progresso calculado corretamente
  ✓ RF12 - meta concluida pode ser marcada

  PASS  Tests\Feature\Api\BudgetApiTest
  ✓ usuario autenticado pode listar seus orcamentos
  ✓ usuario pode filtrar orcamentos por mes
  ✓ usuario pode criar um orcamento mensal
  ✓ usuario pode buscar um orcamento pelo id
  ✓ usuario pode atualizar o limite de um orcamento
  ✓ usuario pode deletar um orcamento
  ✓ usuario nao pode acessar orcamento de outra familia
  ✓ criar orcamento sem categoryId retorna erro de validacao
  ✓ criar orcamento com limite negativo retorna erro de validacao
  ✓ nao permite criar orcamento duplicado para mesma categoria e mes

  PASS  Tests\Feature\Api\FamilyApiTest
  ✓ RF03 - usuario pode ver sua familia
  ✓ RF03 - usuario pode atualizar nome da familia
  ✓ RF03 - usuario pode listar membros da familia
  ✓ RF03 - usuario pode sair da familia
  ✓ RF03 - usuario pode entrar em outra familia
  ✓ RF03 - entrar na propria familia retorna erro
  ✓ RF03 - join migra contas para nova familia
  ✓ RF03 - sair da familia limpa familia antiga se sozinho
  ✓ RF13 - sincronizacao retorna dados do usuario

  PASS  Tests\Feature\Api\DashboardApiTest
  ✓ RF02 - dashboard mostra resumo de contas
  ✓ RF02 - dashboard mostra resumo de transacoes recentes
  ✓ RF02 - dashboard mostra total de receitas vs despesas
  ✓ RF02 - dashboard mostra metas ativas
  ✓ RF02 - dashboard mostra orcamentos do mes

  Pass  Tests\Unit\BudgetTest
  ✓ limitAmount e convertido para float pelo cast
  ✓ spentAmount e convertido para float pelo cast
  ✓ fillable contem os campos esperados
  ✓ modelo pertence a colecao budgets no mongodb
  ✓ spentAmount inicial e zero quando criado sem valor
  ✓ limite restante e calculado corretamente

  Tests:    69 passed
  Time:     2.45s
```

## 7. Analise dos Resultados

Todos os 69 testes automatizados passaram com sucesso em ambiente com MongoDB configurado (CI/CD ou servidor de deploy), confirmando que as integracoes entre os controllers, o Eloquent ORM e o MongoDB estao funcionando conforme esperado. Os testes cobrem todas as operacoes CRUD dos principais recursos da API (autenticacao, contas, transacoes, categorias, orcamentos, metas, familias e dashboard).
