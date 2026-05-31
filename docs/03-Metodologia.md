# Metodologia

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a></span>

Descreva aqui a metodologia de trabalho do grupo para atacar o problema. Definições sobre os ambientes de trabalho utilizados pela equipe para desenvolver o projeto. Abrange a relação de ambientes utilizados, a estrutura para gestão do código fonte, além da definição do processo e ferramenta através dos quais a equipe se organiza (Gestão de Times).

## Relação de Ambientes de Trabalho

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas e a relação dos ambientes com seu respectivo propósito é apresentada na tabela abaixo:

| Ambiente | Plataforma | Link de Acesso |
| :--- | :--- | :--- |
| Repositório de Código | GitHub | [GitHub - Silver](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver) |
| Backend (API Laravel) | Render | [API Silver (Hospedagem)](https://silver-api.onrender.com) |
| Banco de Dados NoSQL | MongoDB Atlas | [Cluster MongoDB M0](https://cloud.mongodb.com) |
| Gestão de Projeto | GitHub Projects | [Quadro Kanban Silver](https://github.com/orgs/ICEI-PUC-Minas-PMV-ADS/projects/...) |
| Documentação / Wiki | GitHub Docs | [Docs Silver](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/tree/main/docs) |
| Protótipo de Interface | Figma | [Figma Silver UI/UX](https://www.figma.com/...) |

## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `unstable`: versão já testada do software, porém instável
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

O projeto utiliza o fluxo de trabalho **GitHub Flow**, onde a branch `main` mantém o código de produção estável, e as funcionalidades são desenvolvidas em branches curtas (ex: `feature/api-auth`) antes de serem revisadas e integradas via Pull Requests. A gerência de issues é feita através do Kanban do GitHub, categorizando tarefas por dificuldade e tipo (bug, enhancement, documentation).
> **Links Úteis**:
> - [Microfundamento: Gerência de Configuração](https://pucminas.instructure.com/courses/87878/)
> - [Tutorial GitHub](https://guides.github.com/activities/hello-world/)
> - [Git e Github](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
>  - [Comparando fluxos de trabalho](https://www.atlassian.com/br/git/tutorials/comparing-workflows)
> - [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
> - [The gitflow workflow - in less than 5 mins](https://www.youtube.com/watch?v=1SXpE08hvGs)

## Gerenciamento de Projeto

A equipe utiliza metodologias ágeis, tendo escolhido o Scrum como base para definição do processo de desenvolvimento. A equipe está organizada da seguinte maneira:
- **Scrum Master:** Aécio Santos;
- **Product Owner:** Nathan Reis;
- **Equipe de Desenvolvimento:** Vinícius Silva, Yago Oliveira, Adrian Martins;
- **Equipe de Design:** Victor Hugo.

> **Links Úteis**:
> - [11 Passos Essenciais para Implantar Scrum no seu Projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)
> - [Os papéis do Scrum e a verdade sobre cargos nessa técnica](https://www.atlassian.com/br/agile/scrum/roles)

### Processo

A equipe utiliza o **GitHub Projects** como principal ferramenta de gestão. As Sprints são mensais, com reuniões de planejamento e revisão ao final de cada etapa. O quadro Kanban é dividido em *Backlog*, *To Do*, *In Progress*, *Review* e *Done*, permitindo visibilidade total do progresso dos requisitos funcionais (RF01 a RF12).
 
> **Links Úteis**:
> - [Planejamento e Gestão Ágil de Projetos](https://pucminas.instructure.com/courses/87878/pages/unidade-2-tema-2-utilizacao-de-ferramentas-para-controle-de-versoes-de-software)
> - [Sobre quadros de projeto](https://docs.github.com/pt/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards)
> - [Project management, made simple](https://github.com/features/project-management/)
> - [Sobre quadros de projeto](https://docs.github.com/pt/github/managing-your-work-on-github/about-project-boards)
> - [Como criar Backlogs no Github](https://www.youtube.com/watch?v=RXEy6CFu9Hk)
> - [Tutorial Slack](https://slack.com/intl/en-br/)

As ferramentas empregadas no projeto são:

- **Editor de Código (VS Code):** Escolhido pela leveza e vasta gama de extensões para PHP/Laravel e React.
- **Backend Framework (Laravel):** Utilizado para a Web API devido à sua robustez e facilidade de integração com MongoDB.
- **Banco de Dados (MongoDB Atlas):** Selecionado pela flexibilidade do esquema NoSQL para registros financeiros dinâmicos.
- **Comunicação (Slack/WhatsApp):** Para alinhamento rápido e assíncrono entre os membros.
- **Hospedagem (Render/Azure):** Pelas cotas gratuitas ideais para o ciclo acadêmico.
- **Ferramentas de Design (Figma):** Para prototipação de alta fidelidade das interfaces Web e Mobile.
 
> **Possíveis Ferramentas que auxiliarão no gerenciamento**: 
> - [Slack](https://slack.com/)
> - [Github](https://github.com/) 
