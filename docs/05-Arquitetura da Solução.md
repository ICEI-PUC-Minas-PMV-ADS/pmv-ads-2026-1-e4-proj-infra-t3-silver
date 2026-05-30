# Arquitetura da Solução

**Pré-requisitos:** [Especificação do Projeto](02-Especificação%20do%20Projeto.md)

Esta seção descreve como o Silver é estruturado em termos de componentes de software, tecnologias envolvidas, modelagem de dados e estratégia de hospedagem, com foco em sua natureza distribuída e multiplataforma.

---

## Status de Implementação (18/03/2026)

- Backend Laravel ativo em `src/backend` (Laravel 12.55.1).
- Autenticação via Sanctum implementada para API (`/api/register`, `/api/login`, `/api/me`).
- Integração do pacote MongoDB no backend já concluída.
- Conexão ao MongoDB Atlas pendente apenas de provisionamento do cluster e preenchimento de `DB_DSN` no `.env`.

---

## Visão Geral da Arquitetura Distribuída

O Silver adota uma **arquitetura distribuída baseada em API REST**, na qual um backend centralizado (API Laravel) serve como núcleo de processamento, sendo consumido por diferentes clientes: um Dashboard Web, um aplicativo Mobile e um serviço de integração com o WhatsApp. Essa abordagem garante que os dados estejam sempre sincronizados entre as plataformas, independentemente do canal utilizado pelo usuário para registrar ou consultar suas informações financeiras.

```
┌─────────────────────────────────────────────────────────┐
│                      USUÁRIO FINAL                      │
└────────────┬──────────────────┬──────────────┬──────────┘
             │                  │              │
    ┌───────▼──────┐   ┌───────▼──────┐  ┌───▼──────────┐
    │ Dashboard Web│   │  App Mobile  │  │   WhatsApp   │
    │  (React/JS)  │   │ (React Nat.) │  │  (Usuário)   │
    └───────┬──────┘   └───────┬──────┘  └───┬──────────┘
            │                  │              │
            │        REST API (HTTPS/JSON)    │
            │                  │         ┌───▼──────────┐
            │                  │         │ WhatsApp     │
            │                  │         │ Bridge       │
            │                  │         │ (Node.js /   │
            │                  │         │  Webhook)    │
            └──────────┬───────┘         └───┬──────────┘
                       │                     │
               ┌────────▼─────────────────────▼────────┐
               │        API Backend (Laravel/PHP)       │
               │  Autenticação · Regras de Negócio      │
               │  Gerenciamento de Dados · Relatórios   │
               └────────────────────┬──────────────────┘
│
                         ┌─────────▼─────────┐
                         │  Banco de Dados   │
                         │    (MongoDB)      │
                         └───────────────────┘
```

> **Nota:** O diagrama acima representa o fluxo lógico da arquitetura distribuída do Silver. Um diagrama visual complementar em formato de imagem pode ser adicionado na pasta `docs/img/`.

---

## Componentes da Arquitetura

### 1. API Backend (Laravel/PHP)
Núcleo central da plataforma. Responsável por:
- Processar e validar todas as transações financeiras
- Gerenciar autenticação e autorização de usuários (Laravel Sanctum)
- Expor endpoints REST consumidos pelos clientes Web, Mobile e WhatsApp Bridge
- Calcular saldos consolidados, metas e orçamentos
- Gerar relatórios em PDF/CSV sob demanda

### 2. Dashboard Web (React/JavaScript)
Interface frontend voltada para análise e planejamento financeiro detalhado. Responsável por:
- Exibir saldo consolidado e gráficos de desempenho financeiro
- Permitir o cadastro e a gestão de categorias, metas e orçamentos mensais
- Oferecer visualizações filtráveis do histórico de transações
- Possibilitar a exportação de relatórios em PDF e CSV

### 3. WhatsApp Bridge (Node.js / Webhook)
Microsserviço intermediário que conecta o WhatsApp à API principal. Responsável por:
- Receber mensagens enviadas pelo usuário no WhatsApp via webhook
- Interpretar o conteúdo da mensagem (valor, descrição, categoria) utilizando **Processamento de Linguagem Natural (NLP)** via API de Inteligência Artificial (ex: Google Gemini ou OpenAI)
- Encaminhar as informações estruturadas para a API Laravel criar o registro de transação
- Retornar confirmação ou resumo financeiro ao usuário via WhatsApp em tempo real

---

## Localização e Moeda

Para garantir consistência nos cálculos de saldo consolidado e orçamentos planejados, o Silver adota:
- **Moeda:** Real Brasileiro (BRL / R$) como padrão fixo em toda a plataforma.
- **Idioma:** Português (Brasil).
- **Fuso Horário:** Horário de Brasília (UTC-3).

### 4. Aplicativo Mobile (React Native)
Interface mobile voltada para consultas rápidas e registros em mobilidade. Responsável por:
- Exibir saldo e extrato de forma simplificada
- Permitir o registro rápido de transações
- Sincronizar dados em tempo real com a API backend

---

## Diagrama de Classes

O diagrama de classes representa as principais entidades do domínio do Silver e seus relacionamentos. Como o projeto utiliza MongoDB (banco orientado a documentos), o diagrama a seguir representa as classes de domínio da aplicação conforme implementadas na camada de backend (Laravel Models).

```
+------------------+        +----------------------+
|     Family       |        |     Transaction      |
+------------------+        +----------------------+
| - id             |1      *| - id                 |
| - name           |----+---| - familyId           |
| - createdAt      |    |   | - accountId          |
+------------------+    |   | - userId             |
      |1                |   | - type (income/exp.) |
      |                 |   | - amount             |
      |*                |   | - description        |
+------------------+    |   | - categoryId         |
|     Account      |    |   | - source             |
+------------------+    |   | - attachmentUrl      |
| - id             |    |   | - date               |
| - familyId       |    |   +----------------------+
| - name           |    |              |
| - type           |    |              |*
| - balance        |    |   +--------▼---------+
+------------------+    |   |    Category      |
          |             |   +------------------+
          |1            |   | - id             |
          |             +---| - familyId       |
          |*            |   | - userId         |
+------------------+    |   | - name           |
|      User        |    |   | - color          |
+------------------+    |   | - icon           |
| - id             |    |   +------------------+
| - familyId       |    |
| - name           |    |   +------------------+
| - email          |    +---|      Goal        |
| - passwordHash   |    |   +------------------+
| - settings       |    |   | - id             |
| - whatsappNumber |    |   | - familyId       |
+------------------+    |   | - userId         |
                        |   | - name           |
                        |   | - targetAmount   |
                        |   | - currentAmount  |
                        |   | - deadline       |
                        |   +------------------+
                        |
                        |   +------------------+
                        +---|     Budget       |
          +-----------------|------------------|
                            | - id             |
                            | - familyId       |
                            | - userId         |
                            | - categoryId     |
                            | - monthYear      |
                            | - limitAmount    |
                            | - spentAmount    |
                            +------------------+
```

---

## Documentação do Banco de Dados (MongoDB)

O Silver utiliza o **MongoDB** como banco de dados principal, aproveitando sua flexibilidade de esquema para armazenar diferentes tipos de registros financeiros. A seguir são descritas as coleções principais do sistema.

### Coleção: `families`
Armazena os grupos familiares/casais que compartilham o controle financeiro.

```json
{
  "_id": "ObjectId('...')",
  "name": "Família Silva",
  "createdAt": "2026-03-01T10:00:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único da família |
| `name` | Nome descritivo do grupo familiar |

---

### Coleção: `accounts`
Armazena as diferentes contas financeiras (bancos, carteira, investimentos) de uma família.

```json
{
  "_id": "ObjectId('...')",
  "familyId": "ObjectId('...')",
  "name": "Nubank Principal",
  "type": "checking_account",
  "balance": 1500.50,
  "createdAt": "2026-03-01T10:00:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único da conta |
| `familyId` | Referência à família proprietária da conta |
| `name` | Nome da conta (ex: Itaú, Nubank, Dinheiro em Espécie) |
| `type` | Tipo da conta: `checking`, `savings`, `investment`, `cash` |
| `balance` | Saldo atual da conta (consolidado via transações) |

---

### Coleção: `users`
Armazena os dados de cadastro e autenticação dos usuários.

```json
{
  "_id": "ObjectId('...')",
  "familyId": "ObjectId('...')",
  "name": "Maria da Silva",
  "email": "maria@example.com",
  "passwordHash": "hash_bcrypt_da_senha",
  "whatsappNumber": "+5531999999999",
  "settings": {
    "whatsapp_alerts": true,
    "daily_summary": true,
    "summary_time": "08:00"
  },
  "createdAt": "2026-03-01T10:00:00Z",
  "updatedAt": "2026-03-01T10:00:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único gerado automaticamente pelo MongoDB |
| `familyId` | Referência à família a que o usuário pertence |
| `name` | Nome completo do usuário |
| `email` | E-mail utilizado para login no Dashboard Web |
| `passwordHash` | Hash bcrypt da senha do usuário |
| `whatsappNumber` | Número vinculado para integração com o WhatsApp |
| `settings` | Objeto JSON com preferências de notificações e sistema |

---

### Coleção: `transactions`
Armazena todas as movimentações financeiras (receitas e despesas).

```json
{
  "_id": "ObjectId('...')",
  "familyId": "ObjectId('...')",
  "accountId": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "type": "expense",
  "amount": 45.90,
  "description": "Almoço no restaurante",
  "categoryId": "ObjectId('...')",
  "source": "whatsapp",
  "attachmentUrl": null,
  "date": "2026-03-08T13:30:00Z",
  "createdAt": "2026-03-08T13:31:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único da transação |
| `familyId` | Referência à família dona da transação (quem visualiza) |
| `accountId` | Referência à conta de onde o recurso saiu/entrou |
| `userId` | Referência ao usuário que criou o registro (auditoria) |
| `type` | Tipo da transação: `income` (receita) ou `expense` (despesa) |
| `amount` | Valor em reais da transação |
| `description` | Descrição textual informada pelo usuário |
| `categoryId` | Referência à categoria associada |
| `source` | Canal de origem: `web`, `mobile` ou `whatsapp` |
| `attachmentUrl` | URL do comprovante anexado (opcional) |
| `date` | Data e hora em que a transação ocorreu |

---

### Coleção: `categories`
Armazena as categorias financeiras personalizadas por família.

```json
{
  "_id": "ObjectId('...')",
  "familyId": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "name": "Alimentação",
  "color": "#FF6B6B",
  "icon": "utensils",
  "createdAt": "2026-03-01T10:00:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único da categoria |
| `familyId` | Referência à família dona da categoria |
| `userId` | Referência ao usuário que criou a categoria |
| `name` | Nome da categoria (ex: Alimentação, Transporte) |
| `color` | Cor em hexadecimal para identificação visual |
| `icon` | Ícone representativo da categoria |

---

### Coleção: `goals`
Armazena as metas financeiras de economia definidas pela família.

```json
{
  "_id": "ObjectId('...')",
  "familyId": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "name": "Reserva de Emergência",
  "targetAmount": 5000.00,
  "currentAmount": 1200.00,
  "deadline": "2026-12-31T00:00:00Z",
  "createdAt": "2026-03-01T10:00:00Z",
  "updatedAt": "2026-03-08T10:00:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único da meta |
| `familyId` | Referência à família dona da meta |
| `userId` | Referência ao usuário que criou a meta |
| `name` | Nome ou descrição da meta financeira |
| `targetAmount` | Valor alvo a ser atingido |
| `currentAmount` | Valor economizado até o momento |
| `deadline` | Data limite para conclusão da meta |

---

### Coleção: `budgets`
Armazena os orçamentos mensais com limite de gastos por categoria da família.

```json
{
  "_id": "ObjectId('...')",
  "familyId": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "categoryId": "ObjectId('...')",
  "monthYear": "2026-03",
  "limitAmount": 800.00,
  "spentAmount": 320.00,
  "createdAt": "2026-03-01T10:00:00Z"
}
```

| Campo | Descrição |
|---|---|
| `_id` | Identificador único do orçamento |
| `familyId` | Referência à família dona do orçamento |
| `userId` | Referência ao usuário que definiu o orçamento |
| `categoryId` | Referência à categoria com limite definido |
| `monthYear` | Mês de referência do orçamento (formato `YYYY-MM`) |
| `limitAmount` | Limite máximo de gastos para a categoria no mês |
| `spentAmount` | Total gasto na categoria até o momento |

---

### Regras de Agrupamento Familiar

Para garantir que o Silver suporte o crescimento da estrutura familiar de forma fluida, as seguintes regras de negócio foram estabelecidas para a gestão de dados:

1.  **Afiliação Solo (Padrão):** Todo novo usuário recebe uma `familyId` única e privada no momento do cadastro.
2.  **Convite e Unificação:** Quando um usuário aceita um convite para entrar em uma família já existente:
    *   **Merge de Histórico:** O sistema executa uma atualização em lote para trocar o `familyId` de todos os registros prévios do novo membro (**Contas, Transações, Categorias, Metas**) pelo ID da nova família.
    *   **Saldo Compartilhado:** As contas bancárias do novo membro passam a compor o saldo consolidado da família receptora.
3.  **Preservação de Autoria:** O campo `userId` é **imutável**, mesmo após a troca de família. Isso permite que, em uma tela de extrato familiar, o sistema identifique claramente quem realizou cada transação (ex: "Almoço - Pago por Maria" ou "Internet - Pago por João").
4.  **Merge de Categorias:** No processo de unificação, as categorias personalizadas do novo membro são integralmente anexadas à lista de categorias da família receptora. Isso garante a preservação do histórico de classificação das transações importadas, evitando que registros fiquem sem categoria definida.

---

### Integridade de Dados em Ambiente NoSQL

Diferente de bancos relacionais que utilizam triggers ou chaves estrangeiras rígidas, o Silver garante a integridade dos dados através da camada da aplicação (Laravel):

- **Database Observers (Hooks):** O sistema utiliza *Observers* na model `Transaction`. Sempre que uma transação é **criada, editada ou excluída**, eventos no backend disparam automaticamente:
    - Atualização do `balance` na coleção `accounts`.
    - Recálculo do `spentAmount` na coleção `budgets` para o mês correspondente.
- **Atomicidade via Aplicação:** Garante que o usuário sempre visualize saldos atualizados sem a necessidade de processamentos pesados de agregação no momento da leitura.

### Boas Práticas NoSQL

- **Validação de Dados:** toda entrada de dados é validada na camada da API Laravel antes de ser persistida no MongoDB, garantindo consistência e prevenindo registros inválidos.
- **Desnormalização para Performance:** O campo `spentAmount` na coleção `budgets` e `balance` em `accounts` são exemplos de desnormalização intencional. Em arquiteturas NoSQL, preferimos replicar dados que exigem leitura frequente para evitar agregações complexas, garantindo integridade através de eventos no backend durante a criação de transações.
- **Escalabilidade:** o MongoDB Atlas suporta estratégias de replicação automática, garantindo alta disponibilidade. Em cenários de crescimento, podem ser adotadas estratégias de sharding para distribuição de carga.
- **Segurança:** o acesso ao banco de dados é restrito por autenticação com usuário e senha, e o cluster é configurado para aceitar conexões apenas de IPs autorizados (whitelist).

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Backend | Laravel (PHP 8.x) | Framework robusto com suporte a autenticação, ORM Eloquent, filas e geração de relatórios |
| Autenticação | Laravel Sanctum / JWT | Gerenciamento seguro de tokens de acesso para a API REST |
| Dashboard Web | React.js + JavaScript | Biblioteca moderna para construção de interfaces reativas e responsivas |
| App Mobile | React Native | Permite compartilhamento de lógica entre Web e Mobile com uma única base de código |
| WhatsApp Bridge | Node.js + Webhook | Leveza e eficiência no processamento assíncrono de mensagens do WhatsApp |
| Banco de Dados | MongoDB Atlas (Free Tier) | Flexibilidade de esquema para acomodar diferentes tipos de transações e metadados financeiros |
| Hospedagem Backend | Render / Azure (Free Tier) | Disponibilidade sem custo inicial adequada ao ciclo acadêmico |
| Hospedagem Frontend | Netlify / GitHub Pages | Deploy contínuo integrado ao repositório GitHub |
| Comunicação | REST API (HTTPS / JSON) | Padrão amplamente adotado, compatível com todos os clientes da arquitetura |
| Controle de Versão | Git + GitHub | Colaboração e rastreabilidade de código entre os 6 membros da equipe |
| IDE | Visual Studio Code | Editor leve, gratuito e com suporte a todas as linguagens do projeto |

O fluxo de uma interação típica ocorre da seguinte forma: o usuário envia uma mensagem ao WhatsApp informando um gasto → o **WhatsApp Bridge** recebe via webhook e extrai os dados → a **API Laravel** valida, persiste no **MongoDB** e retorna confirmação → o **Dashboard Web** e o **App Mobile** consultam a API e exibem os dados atualizados em tempo real.

---

## Hospedagem

A estratégia de hospedagem do Silver foi definida para operar inteiramente em planos gratuitos (free tiers) durante o ciclo acadêmico, sem gerar custos para a equipe:

- **Backend (API Laravel):** hospedado no **Render** ou **Microsoft Azure** (plano gratuito), com deploy contínuo ativado via webhook integrado ao repositório GitHub. A cada novo commit na branch `main`, um novo deploy é iniciado automaticamente.
- **Dashboard Web (React):** hospedado no **Netlify** ou **GitHub Pages**, com build automático a cada push. O acesso público se dá via HTTPS com domínio fornecido pela plataforma.
- **Banco de Dados (MongoDB):** utilizado o **MongoDB Atlas M0** (cluster gratuito), com acesso restrito por autenticação e whitelist de IPs, garantindo segurança sem custo adicional.
- **WhatsApp Bridge (Node.js):** hospedado como serviço separado no **Render** (free tier), exposto via URL pública para receber os webhooks enviados pela API do WhatsApp.

---

## Qualidade de Software

Com base na norma **ISO/IEC 25010**, a equipe do Silver selecionou as seguintes subcaracterísticas de qualidade como diretrizes para o desenvolvimento, justificadas pelos requisitos não funcionais definidos na Especificação do Projeto:

| Característica | Subcaracterística | Justificativa | Métrica |
|---|---|---|---|
| **Adequação Funcional** | Completude funcional | O sistema deve cobrir todos os RF01 a RF12 definidos na especificação | % de requisitos implementados e validados por sprint |
| **Desempenho** | Tempo de resposta | RNF05: a API deve responder em até 3 segundos em condições normais de uso | Tempo médio de resposta medido com ferramentas de teste de carga (ex: k6, JMeter) |
| **Segurança** | Confidencialidade | RNF04: dados sensíveis trafegam exclusivamente via HTTPS | 100% das rotas protegidas com HTTPS; autenticação JWT obrigatória em todas as rotas privadas |
| **Compatibilidade** | Interoperabilidade | RNF03: arquitetura REST para integração multiplataforma (Web, Mobile, WhatsApp) | Número de clientes integrados e funcionando com a mesma API |
| **Usabilidade** | Operabilidade | RNF02: interface Web responsiva e otimizada para navegadores modernos | Taxa de conclusão de tarefas em testes com usuários reais; ausência de erros de layout |
| **Confiabilidade** | Integridade de dados | RNF06: o banco de dados deve garantir integridade e atomicidade das transações | Zero inconsistências detectadas nos testes de integração entre serviços |
| **Manutenibilidade** | Modularidade | Separação clara entre API, frontend e Bridge facilita evolução independente de cada serviço | Ausência de acoplamento direto entre serviços; comunicação exclusivamente via API REST |
