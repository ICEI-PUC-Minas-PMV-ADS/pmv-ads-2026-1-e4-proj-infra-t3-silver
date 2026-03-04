# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Este capítulo detalha as especificações do projeto **Silver** a partir da perspectiva do usuário. A definição do problema e a concepção da solução são aprofundadas por meio da criação de personas, histórias de usuário, requisitos funcionais e não funcionais, além das restrições e da arquitetura distribuída que nortearão o desenvolvimento.

## Personas

Para compreender as necessidades e dores dos usuários, foram desenvolvidas três personas baseadas no público-alvo identificado.

| Foto | Perfil | Detalhes | Motivações e Comportamento |
| :--- | :--- | :--- | :--- |
| ![Maria](https://i.pravatar.cc/150?u=maria) | **Nome:** Maria da Silva<br>**Idade:** 38 anos<br>**Profissão:** Auxiliar Administrativa | **Renda:** R$ 2.400,00<br>**Tecnologia:** Familiarizada com WhatsApp e utiliza celular Android. | **Dores:** Esquece de anotar pequenos gastos e acha planilhas complicadas.<br>**Objetivos:** Usar o WhatsApp para registros instantâneos e ver relatórios simples no celular. |
| ![João](https://i.pravatar.cc/150?u=joao) | **Nome:** João Pereira<br>**Idade:** 24 anos<br>**Profissão:** Vendedor Autônomo | **Renda:** R$ 1.800,00<br>**Tecnologia:** Usuário ativo de aplicativos e redes sociais. | **Dores:** Dificuldade em separar gastos pessoais de profissionais no dia a dia.<br>**Objetivos:** Registrar tudo rápido pelo WhatsApp e usar o Dashboard Web para planejamento mensal. |
| ![Carlos](https://i.pravatar.cc/150?u=carlos) | **Nome:** Carlos Santos<br>**Idade:** 32 anos<br>**Profissão:** Técnico de TI | **Renda:** R$ 4.500,00<br>**Tecnologia:** Confortável com Dashboards complexos e múltiplas janelas. | **Dores:** Precisa de uma visão analítica potente para gerir investimentos e metas.<br>**Objetivos:** Usar o Dashboard Web para análises profundas e integração total entre dispositivos. |

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR` |
|--------------------|------------------------------------|----------------------------------------|
|Maria da Silva | Registrar uma despesa enviando um valor pelo WhatsApp | Não esquecer o gasto logo após a compra. |
|João Pereira | Visualizar meu Dashboard Web consolidado | Analisar meus lucros e despesas do mês em uma tela grande. |
|Carlos Santos | Definir metas de economia para o final do ano | Acompanhar meu progresso de forma automática. |
|João Pereira | Receber um resumo diário via WhatsApp | Ter consciência do quanto ainda posso gastar no dia. |
|Maria da Silva | Categorizar minhas contas por cor e ícone | Facilitar a identificação visual dos meus gastos no app. |

## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto, distribuídos entre os membros da equipe para desenvolvimento completo (Backend e Frontend).

### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade | Responsável |
| :--- | :--- | :--- | :--- |
| **RF01** | Permitir o registro de transações (receitas/despesas) via API e WhatsApp. | Alta | Aécio |
| **RF02** | Fornecer um Dashboard Web principal para visualização de saldo e extrato. | Alta | Adrian |
| **RF03** | Permitir a sincronização em tempo real entre Web e Mobile. | Alta | Nathan |
| **RF04** | Permitir a criação, edição e exclusão de categorias financeiras. | Média | Victor |
| **RF05** | Realizar o cálculo e exibição de saldo consolidado de múltiplas contas. | Alta | Vinícius |
| **RF06** | Permitir o cadastro de metas financeiras com acompanhamento de progresso. | Média | Yago |
| **RF07** | Gerenciar autenticação (Login/Registro) e perfil de usuário. | Alta | Aécio |
| **RF08** | Possibilitar a exportação de relatórios em PDF/CSV no Dashboard Web. | Baixa | Adrian |
| **RF09** | Disparar alertas ou resumos diários de orçamento via WhatsApp. | Média | Nathan |
| **RF10** | Permitir a anexação de comprovantes (imagens/recibos) nas transações. | Baixa | Victor |
| **RF11** | Permitir a criação de orçamentos mensais com limites de gastos. | Alta | Vinícius |
| **RF12** | Manter e exibir um histórico filtrável de movimentações financeiras. | Média | Yago |

### Requisitos Não Funcionais

| ID | Descrição do Requisito | Prioridade |
| :--- | :--- | :--- |
| **RNF01** | O backend da aplicação deve ser desenvolvido utilizando o framework Laravel (PHP). | Alta |
| **RNF02** | O Dashboard Web deve ser responsivo e otimizado para navegadores modernos. | Alta |
| **RNF03** | O sistema deve adotar uma arquitetura distribuída (API REST) para integração multiplataforma. | Média |
| **RNF04** | Todas as comunicações contendo dados sensíveis devem trafegar via HTTPS. | Alta |
| **RNF05** | O tempo de processamento padrão da API não deve exceder 3 segundos. | Alta |
| **RNF06** | O banco de dados relacional deve garantir integridade e atomicidade das transações. | Alta |

## Restrições

O projeto está restrito pelas condições apresentadas na tabela a seguir:

|ID| Restrição |
|--|-------------------------------------------------------|
|01| O projeto deve ser entregue até o final das 16 semanas letivas do semestre. |
|02| A infraestrutura deve usar apenas planos gratuitos (*free tiers*), como Render/Azure para backend e Netlify para frontend, além de cotas gratuitas para a API do WhatsApp. |
|03| O desenvolvimento do backend é estritamente obrigatório utilizando Laravel. |

## Arquitetura Distribuída

O **Silver** utiliza uma arquitetura distribuída composta pelos seguintes componentes principais:
1. **API Gateway / Backend (Laravel)**: Núcleo central que processa as regras de negócio, autenticação e comunicação com o banco de dados relacional.
2. **Dashboard Web**: Interface frontend consumindo a API Laravel para análises detalhadas.
3. **WhatsApp Bridge (Node.js/Webhook)**: Microsserviço que processa mensagens enviadas pelo usuário no WhatsApp e as direciona para a API principal criar os registros.
4. **App Mobile**: Aplicativo auxiliar para consultas rápidas na palma da mão.

## Diagrama de Casos de Uso

O diagrama de casos de uso ilustra a fronteira do sistema e o detalhamento das principais interações dos usuários com os serviços distribuídos oferecidos pelo Silver.

![Diagrama de Caso de Uso](img/usecase.svg)

*(Nota: O arquivo `usecase.svg` será gerado e inserido na pasta de imagens do projeto durante a fase de prototipação).*

# Gerenciamento de Projeto

## Gerenciamento de Tempo

O desenvolvimento foi estruturado em um cronograma macro de 16 semanas, dividido em quatro ciclos principais (Sprints Mensais):

- **Semanas 1-4 (Mês 1)**: Concepção do projeto, Planejamento da Especificação e Setup do Backend (Laravel).
- **Semanas 5-8 (Mês 2)**: Construção do Dashboard Web e implementação do banco de dados relacional.
- **Semanas 9-12 (Mês 3)**: Desenvolvimento da integração com WhatsApp (Bridge) e rotas de API.
- **Semanas 13-16 (Mês 4)**: Desenvolvimento do App Mobile, testes de sincronização, correções e entrega final.

## Gerenciamento de Equipe

O gerenciamento ágil de tarefas e a coordenação da equipe serão realizados por meio do **GitHub Projects**. O quadro da equipe conterá o fluxo de cada requisito da funcionalidade, passando pelas fases de *Todo*, *In Progress*, *Review* e *Done*, vinculando PRs (Pull Requests) diretamente às entregas de cada um dos 6 desenvolvedores responsáveis.

