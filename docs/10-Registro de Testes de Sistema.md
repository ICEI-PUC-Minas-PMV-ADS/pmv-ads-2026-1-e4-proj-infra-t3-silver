# 🧪 Registro de Testes de Sistema

## 1. Identificação do Projeto

| Campo | Detalhe |
|---|---|
| **Projeto** | Silver — Gestão Financeira Familiar |
| **Período** | Junho/2026 |
| **Stack** | Laravel 12 / MongoDB / Livewire Flux / React Native Expo |
| **Testes Automatizados (API)** | 73 cenários · ✅ 72 aprovados · ❌ 1 falha (texto mensagem duplicidade) |
| **Endpoint Base** | `http://127.0.0.1:8000/api` |

---

## 2. Requisitos

### 2.1 Funcionais

| ID | Descrição | Responsável |
|---|---|---|
| **RF01** | CRUD de transações (receitas/despesas) via API, Web e Mobile | Victor |
| **RF02** | Dashboard / Home com resumo financeiro | Aécio |
| **RF03** | Gerenciar grupos familiares | Nathan |
| **RF04** | CRUD de categorias financeiras | Yago |
| **RF05** | Gerenciamento de contas e saldo consolidado | Adrian |
| **RF06** | CRUD de metas financeiras com progresso | Vinícius |
| **RF07** | Autenticação (Login/Registro) e perfil | Aécio |
| **RF08** | Anexar comprovantes por câmera/galeria | Nathan |
| **RF09** | CRUD de orçamentos mensais | Adrian |
| **RF10** | Histórico filtrável de movimentações | Victor |
| **RF11** | Tema claro/escuro no Mobile | Nathan |
| **RF12** | Extrato mensal com saldo por período | Vinícius |
| **RF13** | Sincronização Web/Mobile via API | Nathan |
| **RF14** | Indicadores de gastos por categoria | Yago |

---

## 3. 🖥️ Testes — Aplicação Web (Laravel Livewire)

### 3.1 🔐 Autenticação / Login

**Responsável:** Aécio | **RF07**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Registrar novo usuário | 201 + token + user | ✅ Criado com familyId e token retornados | ✅ |
| 2 | Login com credenciais válidas | 200 + token Bearer | ✅ Token recebido, mesmo usuário retornado | ✅ |
| 3 | Login com senha inválida | 422 + mensagem de erro | ✅ "Credenciais invalidas." | ✅ |
| 4 | Acessar rota protegida sem token | 302 / 401 | ✅ Bloqueado | ✅ |
| 5 | Acessar `/me` com token válido | 200 + dados do usuário | ✅ Nome e email corretos | ✅ |

**Evidência:** *[Inserir print da tela de login web]*

---

### 3.2 📊 Dashboard / Home

**Responsável:** Aécio | **RF02**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Saldo consolidado no dashboard | Card com saldo total (R$) | — | 🔲 |
| 2 | Total de receitas do período | Card verde com soma | — | 🔲 |
| 3 | Total de despesas do período | Card vermelho com soma | — | 🔲 |
| 4 | Últimas transações (3-5) | Lista das mais recentes | — | 🔲 |
| 5 | Navegação pelos cards | Redirecionamento correto | — | 🔲 |

**Evidência:** *[Inserir print do dashboard web]*

---

### 3.3 💳 Transações (CRUD)

**Responsável:** Victor | **RF01, RF10**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar receita | 201, saldo aumenta, tabela atualiza | ✅ Criada com sucesso | ✅ |
| 2 | Criar despesa | 201, saldo diminui | ✅ Criada com sucesso | ✅ |
| 3 | Listar transações | Tabela com últimas por data | ✅ Lista funcional | ✅ |
| 4 | Excluir transação | Removida, saldo estornado | ✅ Excluída, saldo revertido | ✅ |
| 5 | Editar transação | PUT com novos dados | ✅ Descrição/valor alterados | ✅ |
| 6 | Validar obrigatórios | 5 campos obrigatórios | ✅ Erros exibidos | ✅ |
| 7 | Validar valor R$ 0,00 | Erro: mínimo R$ 0,01 | ✅ Validação OK | ✅ |
| 8 | Estado vazio | "Nenhuma transação" | ✅ Exibida | ✅ |

**Evidência:** *[Inserir print da tela de transações web]*

---

### 3.4 🏦 Contas Bancárias

**Responsável:** Adrian | **RF05**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar conta corrente | 201, conta criada | ✅ Criada, saldo R$ 1.500 | ✅ |
| 2 | Criar conta poupança | 201, conta criada | ✅ Criada | ✅ |
| 3 | Listar contas da família | 200, array com 2 contas | ✅ Listagem funcional | ✅ |
| 4 | Exibir saldo individual | 200, saldo correto | ✅ R$ 1.500,00 | ✅ |
| 5 | Editar nome e saldo | PUT com novos dados | ✅ Nome e saldo alterados | ✅ |
| 6 | Excluir conta | 200, removida | ✅ Excluída | ✅ |
| 7 | Criar conta inválida | 422, erros de validação | ✅ Validação OK | ✅ |

**Evidência:** *[Inserir print da tela de contas web]*

---

### 3.5 🏷️ Categorias

**Responsável:** Yago | **RF04, RF14**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar categoria (nome + cor + ícone) | 201, categoria criada | ✅ Criada | ✅ |
| 2 | Criar segunda categoria | 201, categoria criada | ✅ Criada | ✅ |
| 3 | Criar categoria duplicada | 422, mensagem de erro | ✅ Bloqueado | ✅ |
| 4 | Listar categorias | 200, array | ✅ Listagem funcional | ✅ |
| 5 | Editar nome da categoria | PUT com alteração | ✅ Nome alterado | ✅ |
| 6 | Excluir categoria | 200, removida (com fallback) | ✅ Excluída | ✅ |

**Evidência:** *[Inserir print da tela de categorias web]*

---

### 3.6 📉 Orçamentos Mensais

**Responsável:** Adrian | **RF09**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar orçamento por categoria | 201, orçamento salvo | ✅ Criado, limite R$ 1.000 | ✅ |
| 2 | Criar orçamento duplicado (mesma categoria/mês) | 422 | ✅ Bloqueado | ✅ |
| 3 | Criar segundo orçamento | 201 | ✅ Criado | ✅ |
| 4 | Listar orçamentos | 200, array | ✅ Listagem funcional | ✅ |
| 5 | Editar limite do orçamento | PUT, limite alterado | ✅ R$ 1.500 | ✅ |
| 6 | Mês inválido (`2026-13`) | 422 | ✅ Validação OK | ✅ |
| 7 | Excluir orçamento | 200, removido | ✅ Excluído | ✅ |

**Evidência:** *[Inserir print da tela de orçamentos web]*

---

### 3.7 🎯 Metas Financeiras

**Responsável:** Vinícius | **RF06, RF12**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar meta com valor alvo e prazo | 201, meta criada | ✅ R$ 10.000, dez/2026 | ✅ |
| 2 | Criar meta sem prazo | 201, criada | ✅ Criada | ✅ |
| 3 | Listar metas | 200, array | ✅ Listagem funcional | ✅ |
| 4 | Editar valor alvo | PUT com novo valor | ✅ R$ 12.000 | ✅ |
| 5 | Criar meta inválida (título vazio, valor 0) | 422 | ✅ Validação OK | ✅ |
| 6 | Excluir meta | 200, removida | ✅ Excluída | ✅ |
| 7 | Meta excluída retorna 404 | 404 | ✅ Confirmado | ✅ |

**Evidência:** *[Inserir print da tela de metas web]*

---

### 3.8 👨‍👩‍👧‍👦 Famílias

**Responsável:** Nathan | **RF03, RF13**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Visualizar dados da família | 200, dados retornados | ✅ Nome e dados da família | ✅ |
| 2 | Editar nome da família | PUT, 200 | ✅ Nome alterado | ✅ |
| 3 | Listar membros da família | 200, array | ✅ Membro(s) retornados | ✅ |
| 4 | Join com código inválido | 404 / 422 | ✅ Bloqueado | ✅ |

**Evidência:** *[Inserir print da tela de famílias web]*

---

### 3.9 📎 Anexar Comprovantes

**Responsável:** Nathan | **RF08**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Upload de imagem na transação | Anexo salvo e URL retornada | — | 🔲 |
| 2 | Visualizar comprovante | Imagem exibida nos detalhes | — | 🔲 |
| 3 | Excluir transação com anexo | Arquivo removido do storage | — | 🔲 |

**Evidência:** *[Inserir print do upload de comprovante]*

---

## 4. 📱 Testes — Aplicação Mobile (React Native / Expo)

### 4.1 🔐 Autenticação / Login

**Responsável:** Aécio | **RF07**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Registrar novo usuário | 201 + token | ✅ API respondeu 201 | ✅ |
| 2 | Login com credenciais válidas | 200 + token | ✅ Token Sanctum recebido | ✅ |
| 3 | Login com senha inválida | 422 + erro | ✅ "Credenciais invalidas." | ✅ |
| 4 | Rota protegida sem token | 401 bloqueado | ✅ Bloqueado | ✅ |
| 5 | Token persistente (fechar/reabrir) | Sessão mantida | — | 🔲 |

**Evidência:** *[Inserir print da tela de login mobile]*

---

### 4.2 📊 Dashboard

**Responsável:** Aécio | **RF02**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Resumo financeiro (saldo, receitas, despesas) | Cards carregados | — | 🔲 |
| 2 | Últimas transações | 3 últimas movimentações | — | 🔲 |
| 3 | Navegação | Botões redirecionam corretamente | — | 🔲 |

**Evidência:** *[Inserir print do dashboard mobile]*

---

### 4.3 💳 Lista de Transações

**Responsável:** Victor | **RF01, RF10**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Listar transações agrupadas por data | GET /api/transactions | ✅ API retorna lista | ✅ |
| 2 | Filtrar por tipo (receita/despesa) | GET com ?type=income/expense | ✅ Filtro funcional | ✅ |
| 3 | Buscar por texto na descrição | Filtro em tempo real | — | 🔲 |
| 4 | Criar transação inline | POST 201 | ✅ API real 201 | ✅ |
| 5 | Excluir transação | DELETE 200 | ✅ Exclusão real | ✅ |
| 6 | Pull-to-refresh | Indicador de sincronização | — | 🔲 |
| 7 | Estado vazio | "Nenhuma transação" | — | 🔲 |

**Evidência:** *[Inserir print da lista de transações mobile]*

---

### 4.4 ➕ Nova Transação

**Responsável:** Victor | **RF01, RF08**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar receita | POST 201 | ✅ API real | ✅ |
| 2 | Criar despesa | POST 201 | ✅ API real | ✅ |
| 3 | Anexar foto (câmera/galeria) | Multipart enviado | — | 🔲 |
| 4 | Selecionar conta na lista | Contas carregadas da API | ✅ Listagem funcional | ✅ |
| 5 | Validar campos obrigatórios | Mensagens de erro | ✅ Validação OK | ✅ |
| 6 | Validar valor inválido | "Informe um valor válido" | ✅ Validação OK | ✅ |
| 7 | Cancelar operação | Volta sem salvar | — | 🔲 |

**Evidência:** *[Inserir print do formulário de nova transação mobile]*

---

### 4.5 🔍 Detalhes da Transação

**Responsável:** Victor | **RF01**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Carregar detalhes da transação | GET /api/transactions/{id} | ✅ API real | ✅ |
| 2 | Badge de valor (↑ receita ↓ despesa) | Ícone + valor + tipo | ✅ Correto | ✅ |
| 3 | Card com dados completos | Descrição, data, tipo, valor | ✅ Exibidos | ✅ |
| 4 | Excluir pelos detalhes | DELETE via API | ✅ Exclusão real | ✅ |
| 5 | Erro com ID inválido | "Transação não encontrada" (404) | ✅ Tratado | ✅ |

**Evidência:** *[Inserir print da tela de detalhes mobile]*

---

### 4.6 🏦 Contas Bancárias

**Responsável:** Adrian | **RF05**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar conta | 201 | ✅ API OK | ✅ |
| 2 | Listar contas da família | 200 | ✅ API OK | ✅ |
| 3 | Editar conta | PUT 200/201 | ✅ API OK | ✅ |
| 4 | Excluir conta | DELETE 200/201 | ✅ API OK | ✅ |
| 5 | Validação de formulário | 422 | ✅ API OK | ✅ |

**Evidência:** *[Inserir print da tela de contas mobile]*

---

### 4.7 🏷️ Categorias

**Responsável:** Yago | **RF04, RF14**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar categoria | 201 | ✅ API OK | ✅ |
| 2 | Listar categorias | 200 | ✅ API OK | ✅ |
| 3 | Editar categoria | PUT 200/201 | ✅ API OK | ✅ |
| 4 | Excluir categoria (com fallback) | DELETE 200/201 | ✅ API OK | ✅ |
| 5 | Duplicidade bloqueada | 422 | ✅ API OK | ✅ |

**Evidência:** *[Inserir print da tela de categorias mobile]*

---

### 4.8 📉 Orçamentos Mensais

**Responsável:** Adrian | **RF09**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar orçamento | 201 | ✅ API OK | ✅ |
| 2 | Duplicidade (mesma categoria/mês) | 422 | ✅ API OK | ✅ |
| 3 | Listar orçamentos | 200 | ✅ API OK | ✅ |
| 4 | Editar limite | PUT 200/201 | ✅ API OK | ✅ |
| 5 | Mês inválido | 422 | ✅ API OK | ✅ |
| 6 | Excluir orçamento | DELETE 200/201 | ✅ API OK | ✅ |

**Evidência:** *[Inserir print da tela de orçamentos mobile]*

---

### 4.9 🎯 Metas Financeiras

**Responsável:** Vinícius | **RF06, RF12**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Criar meta com prazo | 201 | ✅ API OK | ✅ |
| 2 | Criar meta sem prazo | 201 | ✅ API OK | ✅ |
| 3 | Listar metas | 200 | ✅ API OK | ✅ |
| 4 | Editar valor alvo | PUT 200/201 | ✅ API OK | ✅ |
| 5 | Validação (título vazio, valor 0) | 422 | ✅ API OK | ✅ |
| 6 | Excluir meta | DELETE 200/201 | ✅ API OK | ✅ |
| 7 | Confirmar exclusão (GET 404) | 404 | ✅ API OK | ✅ |

**Evidência:** *[Inserir print da tela de metas mobile]*

---

### 4.10 👨‍👩‍👧‍👦 Famílias

**Responsável:** Nathan | **RF03, RF13**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Visualizar família | 200 + dados | ✅ API OK | ✅ |
| 2 | Editar nome da família | PUT 200 | ✅ API OK | ✅ |
| 3 | Listar membros | 200 + array | ✅ API OK | ✅ |
| 4 | Join com código inválido | 404/422 | ✅ API OK | ✅ |

**Evidência:** *[Inserir print da tela de famílias mobile]*

---

### 4.11 📸 Anexar Comprovantes (Câmera/Galeria)

**Responsável:** Nathan | **RF08**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Capturar foto pela câmera | Imagem anexada ao formulário | — | 🔲 |
| 2 | Selecionar foto da galeria | Imagem carregada | — | 🔲 |
| 3 | Enviar transação com foto | Multipart enviado, comprovante salvo | — | 🔲 |
| 4 | Remover foto antes de salvar | Anexo limpo | — | 🔲 |

**Evidência:** *[Inserir print da captura de comprovante mobile]*

---

### 4.12 🌗 Tema Claro/Escuro

**Responsável:** Nathan | **RF11**

| # | Cenário | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|
| 1 | Alternar para tema escuro | Interface escurece | — | 🔲 |
| 2 | Alternar para tema claro | Interface clareia | — | 🔲 |
| 3 | Tema persiste ao fechar/reabrir | Tema mantido | — | 🔲 |

**Evidência:** *[Inserir print do tema escuro mobile]*

---

## 5. 🤖 Testes de API Automatizados

**Arquivo:** `tests/System/TransactionSystemTest.php` (17 testes · 440 asserções) + Teste manual completo (73 cenários)  
**Total consolidado:** 90 cenários executados · ✅ 89 aprovados · ❌ 1 falha (texto de mensagem de duplicidade)

### Autenticação (RF07)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 1 | Registrar usuário | `POST /api/register` | 201 | ✅ |
| 2 | Login válido | `POST /api/login` | 200 | ✅ |
| 3 | Login inválido | `POST /api/login` senha errada | 422 | ✅ |
| 4 | Perfil do usuário | `GET /api/me` | 200 | ✅ |
| 5 | Rota sem token | `GET /api/me` sem auth | 302/401 | ✅ |
| 6 | Rota sem token (POST) | `POST /api/transactions` sem auth | 302/401 | ✅ |
| 7 | Rota sem token (DELETE) | `DELETE /api/goals/{id}` sem auth | 302/401 | ✅ |

### Contas Bancárias (RF05)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 8 | Criar conta | `POST /api/accounts` | 201 | ✅ |
| 9 | Listar contas | `GET /api/accounts` | 200 | ✅ |
| 10 | Exibir conta | `GET /api/accounts/{id}` | 200 | ✅ |
| 11 | Editar conta | `PUT /api/accounts/{id}` | 200/201 | ✅ |
| 12 | Excluir conta | `DELETE /api/accounts/{id}` | 200/201 | ✅ |
| 13 | Validação (nome vazio, tipo inválido) | `POST /api/accounts` | 422 | ✅ |

### Categorias (RF04)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 14 | Criar categoria | `POST /api/categorias` | 201 | ✅ |
| 15 | Criar duplicata | `POST /api/categorias` mesmo nome | 422 | ✅ |
| 16 | Listar categorias | `GET /api/categorias` | 200 | ✅ |
| 17 | Editar categoria | `PUT /api/categorias/{id}` | 200/201 | ✅ |
| 18 | Excluir categoria | `DELETE /api/categorias/{id}` | 200/201 | ✅ |

### Orçamentos (RF09)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 19 | Criar orçamento | `POST /api/budgets` | 201 | ✅ |
| 20 | Criar duplicata (mesma cat/mês) | `POST /api/budgets` | 422 | ✅ |
| 21 | Listar orçamentos | `GET /api/budgets` | 200 | ✅ |
| 22 | Editar limite | `PUT /api/budgets/{id}` | 200/201 | ✅ |
| 23 | Mês inválido | `POST /api/budgets` mês 13 | 422 | ✅ |
| 24 | Excluir orçamento | `DELETE /api/budgets/{id}` | 200/201 | ✅ |

### Metas (RF06)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 25 | Criar meta com prazo | `POST /api/goals` | 201 | ✅ |
| 26 | Criar meta sem prazo | `POST /api/goals` | 201 | ✅ |
| 27 | Listar metas | `GET /api/goals` | 200 | ✅ |
| 28 | Editar valor alvo | `PUT /api/goals/{id}` | 200/201 | ✅ |
| 29 | Validação (título vazio, valor 0) | `POST /api/goals` | 422 | ✅ |
| 30 | Excluir meta | `DELETE /api/goals/{id}` | 200/201 | ✅ |
| 31 | Confirmar exclusão | `GET /api/goals/{id}` | 404 | ✅ |

### Famílias (RF03, RF13)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 32 | Visualizar família | `GET /api/family` | 200 | ✅ |
| 33 | Editar família | `PUT /api/family` | 200 | ✅ |
| 34 | Listar membros | `GET /api/family/members` | 200 | ✅ |
| 35 | Join código inválido | `POST /api/family/join` | 404/422 | ✅ |

### Transações (RF01, RF10)

| # | Cenário | Método | Código | Status |
|---|---|---|---|---|
| 36 | Criar receita | `POST /api/transactions` | 201 | ✅ |
| 37 | Criar despesa | `POST /api/transactions` | 201 | ✅ |
| 38 | Listar transações | `GET /api/transactions` | 200 | ✅ |
| 39 | Filtrar por tipo (receita) | `GET /api/transactions?type=income` | 200 | ✅ |
| 40 | Filtrar por tipo (despesa) | `GET /api/transactions?type=expense` | 200 | ✅ |
| 41 | Exibir transação | `GET /api/transactions/{id}` | 200 | ✅ |
| 42 | Editar transação | `PUT /api/transactions/{id}` | 200/201 | ✅ |
| 43 | Excluir transação | `DELETE /api/transactions/{id}` | 200/201 | ✅ |
| 44 | Transação excluída → 404 | `GET /api/transactions/{id}` | 404 | ✅ |
| 45 | Tipo inválido | `POST /api/transactions` type=invalid | 422 | ✅ |
| 46 | Valor mínimo | `POST /api/transactions` amount=0 | 422 | ✅ |
| 47 | Validação de campos obrigatórios | `POST /api/transactions` vazio | 422 | ✅ |

---

## 6. 📸 Espaço para Evidências

### Web

- **Login:** *[Print da tela de login web]*
- **Dashboard:** *[Print do dashboard web]*
- **Transações (lista + formulário):** *[Print da tela de transações web]*
- **Contas:** *[Print da tela de contas web]*
- **Categorias:** *[Print da tela de categorias web]*
- **Orçamentos:** *[Print da tela de orçamentos web]*
- **Metas:** *[Print da tela de metas web]*
- **Famílias:** *[Print da tela de famílias web]*
- **Comprovantes:** *[Print do upload de comprovante web]*

### Mobile

- **Login / Registro:** *[Print da tela de login mobile]*
- **Dashboard:** *[Print do dashboard mobile]*
- **Lista de transações:** *[Print da lista mobile]*
- **Nova transação:** *[Print do formulário mobile]*
- **Detalhes:** *[Print dos detalhes mobile]*
- **Contas:** *[Print da tela de contas mobile]*
- **Categorias:** *[Print da tela de categorias mobile]*
- **Orçamentos:** *[Print da tela de orçamentos mobile]*
- **Metas:** *[Print da tela de metas mobile]*
- **Famílias:** *[Print da tela de famílias mobile]*
- **Comprovantes (câmera):** *[Print da captura mobile]*
- **Tema escuro:** *[Print do tema escuro mobile]*

---

## 7. 👥 Distribuição por Responsável

| Pessoa | Web | Mobile | Requisitos | Status |
|---|---|---|---|---|
| **Aécio** | Login · Dashboard | Login · Dashboard | RF02, RF07 | ✅ API testada |
| **Victor** | Transações CRUD | Lista · Nova · Detalhes | RF01, RF10 | ✅ API testada |
| **Adrian** | Contas · Orçamentos | Contas · Orçamentos | RF05, RF09 | ✅ API testada |
| **Nathan** | Famílias · Comprovantes | Famílias · Comprovantes · Tema | RF03, RF08, RF11, RF13 | ✅ API (exceto foto/tema UI) |
| **Vinícius** | Metas · Extrato | Metas · Extrato | RF06, RF12 | ✅ API testada |
| **Yago** | Categorias · Indicadores | Categorias · Indicadores | RF04, RF14 | ✅ API testada |

---

## 8. 🎯 Pontos a Melhorar

| # | Item | Prioridade |
|---|---|---|
| 1 | **Testar upload de imagem (comprovantes)** | Média |
| 2 | **Testar exclusão de categoria padrão** — retorna 422, mas verificar se o fallback "Sem Categoria" funciona corretamente nas queries | Média |
| 3 | **Testar paginação** — `GET /api/transactions` usa `paginate(20)`, testar com mais de 20 registros | Baixa |
| 4 | **Testar refresh de token** — verificar se token expirado retorna 401 com mensagem clara | Baixa |
| 5 | **Testar concorrência** — duas transações simultâneas podem causar race condition no saldo? | Baixa |
| 6 | **Mensagem de erro de duplicidade** — padronizar português vs inglês nas respostas | Baixa |
| 7 | **Cobertura de testes automatizados** — criar testes feature do Laravel para os CRUDs de Accounts, Categories, Budgets, Goals e Family (além de Transactions) | Média |
| 8 | **Testes de front-end** — Web (Livewire) e Mobile (React Native) ainda sem testes automatizados (E2E) | Alta |
| 9 | **Validação de deadline no passado** — meta pode ser criada com data retroativa | Média |
| 10 | **Campo `monthYear` nos budgets** — validar formato, mas não impede meses futuros distantes (ex: `2030-01`) | Baixa |

---

> *Documento gerado em Junho/2026 — 73 cenários testados manualmente via API · 90 no total (incluindo 17 testes PHPUnit) · ✅ 89 aprovados · ❌ 1 falha (texto de mensagem)*
