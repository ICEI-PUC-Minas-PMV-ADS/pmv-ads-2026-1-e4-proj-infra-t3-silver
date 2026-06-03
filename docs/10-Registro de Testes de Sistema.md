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

## Como rodar

```bash
# Backend
cd src/backend
php artisan test tests/Feature/Api/

# Mobile
cd src/mobile
npx jest
```

# Resultados dos Testes Automatizados

## Backend (Laravel + Pest) — 69 testes | 150 assertions

### RF01 / RF10 — CRUD de transações e histórico filtrável (Victor)
- `TransactionApiTest.php` — 11 testes
- Criar receita, criar despesa, listar, ver por ID, deletar
- Filtrar por tipo (`income`/`expense`)
- Filtrar por conta (`accountId`)
- Validação de tipo inválido, campo obrigatório, escopo por família

### RF02 — Dashboard / Home com resumo financeiro (Aécio)
- `DashboardApiTest.php` — 5 testes
- Resumo de contas (saldo total)
- Transações recentes
- Total de receitas vs despesas
- Metas ativas
- Orçamentos do mês

### RF03 / RF13 — Grupos familiares e sincronização (Nathan)
- `FamilyApiTest.php` — 8 testes
- Visualizar família, atualizar nome, listar membros
- Sair da família (cria nova família privada)
- Entrar em outra família (merge de histórico)
- Migração de contas ao trocar de família
- Prevenção de entrar na própria família
- Sincronização (acesso a todos os endpoints)

### RF04 / RF14 — CRUD de categorias e indicadores (Yago)
- `CategoryApiTest.php` — 10 testes
- Listar, criar, ver, atualizar, deletar categoria
- Categoria criada não é default
- Não permite deletar categoria padrão
- Nome duplicado rejeitado
- Deleção move transações para fallback ("Sem Categoria")
- Categorias default aparecem primeiro na listagem

### RF05 / RF09 — Contas e orçamentos (Adrian)
- `AccountApiTest.php` — 7 testes
- Listar, criar, ver, atualizar, deletar conta
- Tipo inválido rejeitado
- Escopo por família (não vê contas de outras famílias)

### RF06 / RF12 — Metas financeiras e extrato mensal (Vinícius)
- `GoalApiTest.php` — 9 testes
- Listar, criar, ver, atualizar, deletar meta
- Status inválido rejeitado
- Metas são por usuário (não vê metas de outros)
- Progresso calculado corretamente (75%)
- Marcar meta como concluída

### RF07 — Autenticação e perfil (Aécio)
- `AuthApiTest.php` — 7 testes
- Registro de novo usuário
- Email duplicado rejeitado
- Senha curta rejeitada
- Login com credenciais válidas
- Login com credenciais inválidas
- Perfil (`/api/me`) autenticado
- Perfil bloqueado sem autenticação

### RF09 — Orçamentos (Adrian) — testes existentes corrigidos
- `BudgetApiTest.php` — 8 testes
- CRUD completo, filtro por mês, validações, duplicatas

---

## Mobile (Jest) — 13 testes

### Utilitários
- `formatters.test.ts` — 4 testes
  - `formatCurrency` (R$ 1.500,50)
  - `formatCurrency` (R$ 0,00)
  - `formatDate` (dd/mm/aaaa)
  - `formatPercent` (75%)

### Tratamento de erros
- `api-error.test.ts` — 3 testes
  - Mensagem de erro de validação
  - Mensagem genérica (fallback)
  - Mensagem de erro de rede

### RF11 — Tema claro/escuro
- `theme.test.ts` — 6 testes
  - Tema claro possui todas as chaves
  - Tema escuro possui todas as chaves
  - Temas claro e escuro têm valores diferentes
  - `spacing`, `radius`, `typography` com valores corretos

---

## Como rodar

```bash
# Backend
cd src/backend
php artisan test tests/Feature/Api/

# Mobile
cd src/mobile
npx jest
```

## 6. 📸 Espaço para Evidências

### Web
<img width="521" height="552" alt="silvertestes" src="https://github.com/user-attachments/assets/ce6c61cc-73d0-4820-be5b-7f207b0c62c3" />
<img width="388" height="172" alt="mobiletest" src="https://github.com/user-attachments/assets/028e597e-c352-4f9a-beee-529cefa1eeb9" />
<img width="510" height="593" alt="teste4" src="https://github.com/user-attachments/assets/e196abed-8278-40ab-a093-02cbe00fb487" />
<img width="426" height="601" alt="teste3" src="https://github.com/user-attachments/assets/1526bd9f-3b54-447f-a3fa-36fd50097f24" />
<img width="462" height="602" alt="teste2" src="https://github.com/user-attachments/assets/2b4b43bf-9786-4a46-900a-4cd62ef23cb1" />
 
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

> *Documento gerado em Junho/2026 — Total: 82 cenários de teste — todos passando.
- 69 no backend (Laravel/Pest) — requisições reais na API
- 13 no mobile (Jest) — formatação, erros, tema*
