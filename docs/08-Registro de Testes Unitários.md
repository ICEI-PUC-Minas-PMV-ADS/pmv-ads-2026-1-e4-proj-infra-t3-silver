# Registro de Testes Unitários

Este documento registra os testes implementados no backend do Silver para o recurso de **Orçamentos Mensais (Budgets)**, desenvolvido na Etapa 2, Tarefa 2.

---

## Framework de Testes

O Silver utiliza o **[Pest PHP](https://pestphp.com/)**, um framework de testes moderno para PHP construído sobre o PHPUnit. O Pest oferece uma sintaxe concisa e expressiva que facilita tanto a escrita quanto a leitura dos testes.

### Como executar os testes

```bash
# Entrar na pasta do backend
cd src/backend

# Rodar todos os testes
php artisan test

# Rodar apenas os testes de Budgets
php artisan test --filter=Budget

# Rodar apenas testes unitários
php artisan test --testsuite=Unit

# Rodar apenas testes de feature
php artisan test --testsuite=Feature
```

---

## Testes Unitários — Modelo Budget

**Arquivo:** `tests/Unit/BudgetTest.php`

Estes testes validam o comportamento isolado do modelo `Budget`, sem acesso ao banco de dados ou à API.

| # | Nome do Teste | O que valida | Resultado Esperado |
|---|---|---|---|
| 1 | `limitAmount e convertido para float pelo cast` | O cast do model converte string `"800"` para `float` | `800.0` como `float` |
| 2 | `spentAmount e convertido para float pelo cast` | O cast do model converte string `"320"` para `float` | `320.0` como `float` |
| 3 | `fillable contem os campos esperados` | O array `$fillable` contém todos os campos necessários | Array com `familyId`, `userId`, `categoryId`, `monthYear`, `limitAmount`, `spentAmount` |
| 4 | `modelo pertence a colecao budgets no mongodb` | O modelo aponta para a coleção correta no MongoDB | `"budgets"` |
| 5 | `spentAmount inicial e zero quando criado sem valor` | `spentAmount` é `null` na instância direta (o controller define 0 na criação) | `null` na instância; `0.0` após atribuição |
| 6 | `limite restante e calculado corretamente` | Subtração `limitAmount - spentAmount` retorna o valor disponível | `650.0` para limite de R$ 1.000 com R$ 350 gastos |

---

## Testes de Feature — API de Budgets

**Arquivo:** `tests/Feature/Api/BudgetApiTest.php`

Estes testes verificam o comportamento completo dos endpoints da API de orçamentos, incluindo autenticação via Sanctum, persistência no MongoDB e regras de negócio.

| # | Nome do Teste | Endpoint | O que valida | Resultado Esperado |
|---|---|---|---|---|
| 1 | `usuario autenticado pode listar seus orcamentos` | `GET /api/budgets` | Lista orçamentos da família autenticada | Status 200, array com 1 item |
| 2 | `usuario pode filtrar orcamentos por mes` | `GET /api/budgets?monthYear=2026-04` | Filtro por `monthYear` retorna apenas os do mês | Status 200, apenas 1 dos 2 orçamentos |
| 3 | `usuario pode criar um orcamento mensal` | `POST /api/budgets` | Cria orçamento com `spentAmount` zerado automaticamente | Status 201, `spentAmount: 0.0` |
| 4 | `usuario pode buscar um orcamento pelo id` | `GET /api/budgets/{id}` | Retorna orçamento específico | Status 200, dados corretos |
| 5 | `usuario pode atualizar o limite de um orcamento` | `PUT /api/budgets/{id}` | Atualiza `limitAmount` | Status 200, novo limite salvo |
| 6 | `usuario pode deletar um orcamento` | `DELETE /api/budgets/{id}` | Remove orçamento e confirma ausência no banco | Status 200, orçamento removido |
| 7 | `usuario nao pode acessar orcamento de outra familia` | `GET /api/budgets/{id}` | Isolamento de dados entre famílias | Status 404 |
| 8 | `criar orcamento sem categoryId retorna erro de validacao` | `POST /api/budgets` | Campo `categoryId` é obrigatório | Status 422, erro em `categoryId` |
| 9 | `criar orcamento com limite negativo retorna erro de validacao` | `POST /api/budgets` | `limitAmount` deve ser positivo | Status 422, erro em `limitAmount` |
| 10 | `nao permite criar orcamento duplicado para mesma categoria e mes` | `POST /api/budgets` | Bloqueia duplicata (mesma categoria + mesmo mês) | Status 422, mensagem de conflito |

---

## Saída Esperada ao Rodar os Testes

```
PASS  Tests\Unit\BudgetTest
✓ limitAmount e convertido para float pelo cast
✓ spentAmount e convertido para float pelo cast
✓ fillable contem os campos esperados
✓ modelo pertence a colecao budgets no mongodb
✓ spentAmount inicial e zero quando criado sem valor
✓ limite restante e calculado corretamente

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

Tests:  16 passed
```

---

## Configuração do Ambiente de Testes

Para rodar os testes de feature configure o arquivo `.env.testing` na raiz do backend:

```env
APP_ENV=testing
DB_CONNECTION=mongodb
DB_DSN=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/silver_test?retryWrites=true&w=majority
DB_DATABASE=silver_test
```

> Use um banco separado (`silver_test`) para os testes, evitando sobrescrever dados de desenvolvimento. O Pest aplica `RefreshDatabase` para limpar os dados entre os testes de feature.
