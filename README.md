<div align="center">
  <img src="./docs/img/logo.jpeg" alt="Silver Logo" width="140">

  # SILVER

  **Aplicação distribuída para gestão financeira pessoal**

  [![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)]()
  [![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white)]()
  [![Expo](https://img.shields.io/badge/Expo_SDK-55-000?logo=expo&logoColor=white)]()
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)]()
  [![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php&logoColor=white)]()
  [![License](https://img.shields.io/badge/license-MIT-green)]()
</div>

---

## Sobre o Projeto

O **Silver** é uma plataforma distribuída de controle financeiro pessoal e familiar, composta por uma **API REST** (Laravel), um **Dashboard Web** (Livewire) e um **aplicativo Mobile** (React Native / Expo). A solução permite registrar receitas e despesas, definir orçamentos, acompanhar metas financeiras, gerenciar categorias e compartilhar o controle com membros da família.

## Funcionalidades

| Funcionalidade | Web | Mobile | API |
| :--- | :---: | :---: | :---: |
| Autenticação (Sanctum) | ✅ | ✅ | ✅ |
| CRUD de Transações | ✅ | ✅ | ✅ |
| CRUD de Categorias | ✅ | ✅ | ✅ |
| CRUD de Orçamentos | ✅ | ✅ | ✅ |
| CRUD de Metas | ✅ | ✅ | ✅ |
| Módulo de Famílias | ✅ | ✅ | ✅ |
| Tema Claro/Escuro | — | ✅ | — |
| Biometria (Face ID) | — | ✅ | — |
| Anexo de Fotos | — | ✅ | ✅ |
| Dashboards e Indicadores | ✅ | — | — |

## Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Backend** | Laravel 12, PHP 8.4, Laravel Sanctum |
| **Banco de Dados** | MongoDB Atlas (NoSQL) |
| **Frontend Web** | Livewire, Alpine.js, Tailwind CSS |
| **Mobile** | React Native, Expo SDK 55, Expo Router, TypeScript |
| **Hospedagem** | Render (API), MongoDB Atlas (DB) |
| **Ferramentas** | GitHub Projects, Figma, Slack, VS Code |

## Repositório

```text
.
├── docs/              # Documentação acadêmica
├── src/
│   ├── backend/       # API Laravel
│   └── mobile/        # App React Native / Expo
├── presentation/      # Slides da apresentação
└── videos/            # Vídeos de entrega
```

## Início Rápido

- **Guia do código:** [src/README.md](src/README.md)
- **Documentação acadêmica:** [docs/](docs/)
- **Arquitetura da solução:** [docs/05-Arquitetura da Solução.md](docs/05-Arquitetura%20da%20Solução.md)
- **Apresentação do projeto:** [docs/12-Apresentação do Projeto.md](docs/12-Apresentação%20do%20Projeto.md)
- **API hospedada:** [silver-api.onrender.com](https://silver-api.onrender.com)

## Equipe

| Papel | Membro |
| :--- | :--- |
| **Scrum Master** | Aécio Ribeiro Dantas Neto |
| **Product Owner** | Nathan David Reis |
| **Desenvolvedor** | Adrian Sodré da Silva |
| **Desenvolvedor** | Victor da Silva Folgado |
| **Desenvolvedor** | Vinícius Soares Pires e Luz |
| **Desenvolvedor** | Yago Lopes Miranda |

**Orientadora:** Carolina Stephanie Jerônimo de Almeida

---

<div align="center">
  <sub>Projeto acadêmico — PUC Minas · Curso de Análise e Desenvolvimento de Sistemas</sub>
</div>
