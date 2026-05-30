# Documentação da implementação da Web API Rest

Esta seção detalha a implementação da API Backend desenvolvida em **Laravel**, responsável por processar as regras de negócio e centralizar os dados no **MongoDB**.

## Configurações de Ambiente

A API requer as seguintes variáveis de ambiente configuradas no arquivo `.env`:

```env
APP_NAME=Silver
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mongodb
DB_DSN=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/silver_db?retryWrites=true&w=majority
DB_DATABASE=silver_db
```

### Instalação e Execução
1. `composer install`
2. `php artisan key:generate`
3. `php artisan serve`

---

## Autenticação

A API utiliza o **Laravel Sanctum** para autenticação baseada em tokens.
- **Formato:** Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Content-Type:** `application/json`

---

## Recursos e Rotas

### 1. Autenticação

#### **Registrar Novo Usuário**
- **URL:** `/api/register`
- **Método:** `POST`
- **Body:**
  ```json
  {
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```
- **Resposta (201):**
  ```json
  {
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "..."
  }
  ```

#### **Login**
- **URL:** `/api/login`
- **Método:** `POST`
- **Body:**
  ```json
  {
    "email": "joao@example.com",
    "password": "password123"
  }
  ```
- **Resposta (200):** Token de acesso válido.

#### **Perfil Atual (Me)**
- **URL:** `/api/me`
- **Método:** `GET`
- **Proteção:** Ativa (`auth:sanctum`)
- **Resposta (200):** Dados do usuário logado e sua `familyId`.

---

### 2. Contas (Accounts) [Implementação em andamento]

#### **Listar Contas da Família**
- **URL:** `/api/accounts`
- **Método:** `GET`
- **Resposta:** Lista de contas (Itaú, Nubank, etc.) vinculadas à `familyId` do usuário.

---

### 3. Transações (Transactions) [Implementação em andamento]

#### **Registrar Transação**
- **URL:** `/api/transactions`
- **Método:** `POST`
- **Body:**
  ```json
  {
    "accountId": "...",
    "categoryId": "...",
    "type": "expense",
    "amount": 50.00,
    "description": "Jantar",
    "date": "2026-04-03"
  }
  ```

---

### 4. Família (Family)

#### **Obter dados da família**
- **URL:** `/api/family`
- **Método:** `GET`
- **Proteção:** Ativa (`auth:sanctum`)
- **Resposta (200):**
  ```json
  {
    "_id": "...",
    "name": "Família Silva",
    "users": [{ "_id": "...", "name": "...", "email": "..." }]
  }
  ```

#### **Atualizar nome da família**
- **URL:** `/api/family`
- **Método:** `PUT`
- **Proteção:** Ativa (`auth:sanctum`)
- **Body:**
  ```json
  { "name": "Família Silva & Souza" }
  ```
- **Resposta (200):** Dados atualizados da família.

#### **Entrar em outra família**
- **URL:** `/api/family/join`
- **Método:** `POST`
- **Proteção:** Ativa (`auth:sanctum`)
- **Body:**
  ```json
  { "family_id": "..." }
  ```
- **Descrição:** Migra todas as contas, transações, categorias e metas do usuário para a família de destino.
- **Resposta (200):** Confirmação e dados da nova família.

#### **Listar membros da família**
- **URL:** `/api/family/members`
- **Método:** `GET`
- **Proteção:** Ativa (`auth:sanctum`)
- **Resposta (200):** Array de membros com `_id`, `name` e `email`.

---

### 5. Orçamentos Mensais (Budgets)

Os orçamentos mensais permitem que a família defina um limite de gastos por categoria em cada mês. O campo `spentAmount` é atualizado automaticamente pelo sistema sempre que uma transação de despesa é registrada ou removida.

> Implementado por: Adrian Sodré da Silva — Etapa 2, Tarefa 2.

#### **Listar orçamentos**
- **URL:** `/api/budgets`
- **Método:** `GET`
- **Proteção:** Ativa (`auth:sanctum`)
- **Query params opcionais:** `?monthYear=2026-04`
- **Descrição:** Retorna todos os orçamentos da família. Quando `monthYear` é informado, filtra apenas os orçamentos daquele mês.
- **Resposta (200):**
  ```json
  [
    {
      "_id": "ObjectId('...')",
      "familyId": "ObjectId('...')",
      "userId": "ObjectId('...')",
      "categoryId": "ObjectId('...')",
      "monthYear": "2026-04",
      "limitAmount": 800.00,
      "spentAmount": 320.00,
      "createdAt": "2026-04-01T10:00:00.000000Z",
      "updatedAt": "2026-04-10T15:00:00.000000Z"
    }
  ]
  ```

#### **Criar orçamento**
- **URL:** `/api/budgets`
- **Método:** `POST`
- **Proteção:** Ativa (`auth:sanctum`)
- **Body:**
  ```json
  {
    "categoryId": "ObjectId('...')",
    "monthYear": "2026-04",
    "limitAmount": 800.00
  }
  ```
- **Campos obrigatórios:** `categoryId`, `monthYear`, `limitAmount`
- **Regras de validação:**
  - `categoryId`: string obrigatória
  - `monthYear`: formato `YYYY-MM` (ex: `2026-04`)
  - `limitAmount`: numérico, mínimo R$ 0,01
  - Não é permitido criar dois orçamentos para a mesma categoria no mesmo mês
- **Resposta (201):**
  ```json
  {
    "_id": "ObjectId('...')",
    "familyId": "ObjectId('...')",
    "categoryId": "ObjectId('...')",
    "monthYear": "2026-04",
    "limitAmount": 800.00,
    "spentAmount": 0.00,
    "createdAt": "2026-04-12T10:00:00.000000Z"
  }
  ```
- **Erros (422):** Campos obrigatórios ausentes, formato de mês inválido, limite negativo, orçamento duplicado.

#### **Buscar orçamento por ID**
- **URL:** `/api/budgets/{id}`
- **Método:** `GET`
- **Proteção:** Ativa (`auth:sanctum`)
- **Descrição:** Retorna um orçamento específico. Retorna 404 se não pertencer à família do usuário.
- **Resposta (200):** Objeto completo do orçamento.
- **Erros (404):** Orçamento não encontrado ou pertence a outra família.

#### **Atualizar limite do orçamento**
- **URL:** `/api/budgets/{id}`
- **Método:** `PUT`
- **Proteção:** Ativa (`auth:sanctum`)
- **Descrição:** Atualiza o limite de gastos do orçamento. O `spentAmount` não é alterado manualmente — é gerenciado automaticamente pelas transações.
- **Body:**
  ```json
  { "limitAmount": 1200.00 }
  ```
- **Resposta (200):** Objeto atualizado do orçamento.
- **Erros (404):** Orçamento não encontrado ou pertence a outra família.
- **Erros (422):** `limitAmount` ausente ou inválido.

#### **Remover orçamento**
- **URL:** `/api/budgets/{id}`
- **Método:** `DELETE`
- **Proteção:** Ativa (`auth:sanctum`)
- **Descrição:** Remove o orçamento permanentemente. O `spentAmount` histórico das transações não é afetado.
- **Resposta (200):**
  ```json
  { "message": "Orçamento removido com sucesso." }
  ```
- **Erros (404):** Orçamento não encontrado ou pertence a outra família.

---

## Modelagem NoSQL

A implementação no MongoDB segue o padrão de **Documentos Embutidos** onde pertinente e **Referências** via ID para coleções principais (Transactions -> Accounts, Users -> Families). A flexibilidade do NoSQL é utilizada para permitir campos dinâmicos nas transações originadas pelo WhatsApp.

### Coleção `budgets` — Decisões de Modelagem

A coleção `budgets` utiliza **referências por ID** (`familyId`, `categoryId`) e adota **desnormalização intencional** com o campo `spentAmount`. Essa decisão se justifica porque:

- Calcular o total gasto por categoria a cada requisição exigiria uma agregação sobre toda a coleção `transactions`, o que seria custoso em famílias com histórico extenso.
- Manter `spentAmount` pré-calculado permite que o dashboard exiba o progresso de cada orçamento com uma única leitura, sem necessidade de joins ou aggregations.
- A consistência é garantida pelo `TransactionObserver` no backend, que atualiza `spentAmount` automaticamente a cada transação criada ou removida.