# Template Padrão da Aplicação

<span style="color:red">Pré-requisitos: <a href="02-Especificação do Projeto.md"> Especificação do Projeto</a></span>, <a href="04-Projeto de Interface.md"> Projeto de Interface</a>, <a href="03-Metodologia.md"> Metodologia</a>

Layout padrao das aplicacoes Web e Mobile utilizadas em todas as paginas, com definicao de identidade visual, aspectos de responsividade e iconografia.

## Identidade Visual

- **Paleta de Cores**: Fundo neutro (#F4EFE7), verde institucional (#1B7F73), dourado de destaque (#F0B548)
- **Tipografia**: Space Grotesk (titulos), Manrope (corpo de texto)
- **Iconografia**: Conjunto de icones do Flux UI, consistentes entre Web e Mobile
- **Responsividade**: Layout adaptativo com breakpoints em 840px e 1080px

## Layout Web (Laravel + Flux UI)

O dashboard Web segue o padrao de sidebar a esquerda com navegacao principal (Painel, Contas, Orcamentos, Transacoes, Metas, Configuracoes) e header superior com busca e menu do usuario.

### Web

| Tela | Preview |
|------|---------|
| Home | ![home1](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/home1.png?raw=true) |
| Dashboard | ![home](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/home.png?raw=true) |
| Login | ![login](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/login.png?raw=true) |
| Landing Page | ![landing](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/landing.png?raw=true) |
| Configuracoes | ![config](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/config.png?raw=true) |
| Categorias | ![categor](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/categor.png?raw=true) |
| Cadastro | ![cadastt](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/cadastt.png?raw=true) |

## Layout Mobile (React Native / Expo)

A versao Mobile utiliza navegacao por abas inferiores com as secoes: Dashboard, Transacoes, Contas, Metas e Perfil. O tema segue o sistema operacional do dispositivo (claro/escuro) com consistencia de cores e espacamento.

### Mobile

| Tela | Preview |
|------|---------|
| Dashboard | ![Mobile-1](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/Mobile-1.png?raw=true) |
| Transacoes | ![Mobile-2](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/Mobile-2.png?raw=true) |
| Contas | ![Mobile-3](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/Mobile-3.png?raw=true) |
| Metas | ![Mobile-4](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/Mobile-4.png?raw=true) |
| Perfil | ![Mobile-5](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-silver/blob/main/docs/img/Mobile-5.png?raw=true) |
