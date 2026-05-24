# Silver Mobile

Base inicial do app mobile do projeto Silver, criada com React Native, Expo SDK 55, TypeScript e Expo Router.

Esta versao esta mockada para acelerar a entrega da Etapa 4 e deixar a estrutura pronta para trocar dados locais por chamadas reais da API Laravel.

## Requisitos

- Node.js 22 LTS ou versao compativel com o Expo SDK 55.
- npm.
- Expo Go instalado no celular ou emulador Android/iOS configurado.

Observacao: a base foi mantida no Expo SDK 55 para facilitar testes no Expo Go. Em SDK mais novo, o app do celular pode exigir uma versao ainda nao disponivel na loja.

## Instalar dependencias

```bash
cd src/mobile
nvm use
npm install
```

## Configurar API

Por padrao, o servico usa:

```text
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Para celular fisico com Expo Go, `127.0.0.1` aponta para o proprio celular. Se o backend Laravel estiver rodando no computador, use o IP da maquina:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8000/api npm run start
```

Endpoints planejados no servico inicial:

- `POST /api/login`
- `GET /api/me`
- `GET /api/accounts`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/categorias`
- `GET /api/budgets`
- `GET /api/goals`

## Rodar com Expo

```bash
cd src/mobile
npm run start
```

Depois, leia o QR Code com o Expo Go ou use as opcoes do terminal para abrir em emulador.

## Testar na web

```bash
cd src/mobile
npm run web
```

Se o navegador nao abrir automaticamente, acesse a URL exibida no terminal, normalmente `http://localhost:8081`.

## Testar em celular fisico

1. Deixe computador e celular na mesma rede.
2. Rode `npm run start`.
3. Leia o QR Code no Expo Go.
4. Se for testar API local, troque `EXPO_PUBLIC_API_URL` pelo IP do computador.

## Testar em emulador

```bash
npm run android
```

ou, em macOS com Xcode:

```bash
npm run ios
```

## Validacoes usadas na entrega

```bash
npx expo install --check
npx tsc --noEmit
npx expo export --platform android --output-dir /private/tmp/silver-mobile-export
```

Tambem foi validado manualmente que:

- `npm run start` abre o QR Code do Expo.
- `npm run web` abre o app no navegador.
- Login mockado navega para o Dashboard.

## Estrutura

```text
src/mobile/
├── app/                 # Rotas e telas do Expo Router
├── src/components/      # Componentes reutilizaveis
├── src/mocks/           # Dados financeiros mockados
├── src/services/        # Cliente HTTP e integracao com API
├── src/theme/           # Cores, espacamentos e tipografia
├── src/types/           # Tipos TypeScript compartilhados
└── src/utils/           # Formatadores e helpers
```

## Proximos passos

- Trocar mocks por chamadas reais da API.
- Implementar validacao dos formularios.
- Adicionar estados de loading, erro e vazio.
- Separar CRUDs por responsavel da equipe.

## Docker

No momento, nao ha necessidade de Docker para o app Expo em si. O caminho recomendado e manter Docker para dependencias do backend e servicos locais, como banco de dados, e usar Node/npm diretamente para o mobile.

Se a equipe tiver problemas de versao do Node, uma opcao simples e adicionar um arquivo `.nvmrc` ou `.node-version` apontando para Node 22 LTS antes de criar um container para o Expo.
