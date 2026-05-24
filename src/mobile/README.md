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

Se o `nvm use` informar que o Node 22 nao esta instalado:

```bash
nvm install 22
nvm use
```

## Configurar API

Por padrao, o servico usa:

```text
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Para criar seu arquivo local:

```bash
cp .env.example .env
```

Para celular fisico com Expo Go, `127.0.0.1` aponta para o proprio celular. Se o backend Laravel estiver rodando no computador, use o IP da maquina:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8000/api npm run start
```

Para Android Emulator apontar para o backend rodando no Mac:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api npm run android
```

## Passo a passo para testar

### 1. Atualizar o projeto

Na raiz do repositorio:

```bash
git checkout dev
git pull
```

### 2. Subir o backend Laravel

Em um terminal:

```bash
cd src/backend
docker compose up -d
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

Se o `.env` do backend ja existir, nao precisa copiar de novo. O `docker compose up -d` sobe os servicos locais usados pelo backend, como MongoDB.

Teste rapido da API:

```bash
curl -H "Accept: application/json" http://127.0.0.1:8000/api/me
```

O esperado sem token e receber uma resposta de nao autenticado.

### 3. Instalar o mobile

Em outro terminal:

```bash
cd src/mobile
nvm use
npm install
cp .env.example .env
```

### 4. Testar no navegador

Use este modo para validacao rapida das telas:

```bash
cd src/mobile
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api npm run web
```

Se o navegador nao abrir sozinho, acesse a URL exibida no terminal, normalmente `http://localhost:8081`.

### 5. Testar no Android Studio

Abra o Android Studio e inicie um emulador:

```text
Android Studio > More Actions > Virtual Device Manager
```

No terminal, confira se o emulador apareceu:

```bash
adb devices
```

O esperado e algo parecido com:

```text
emulator-5554	device
```

Depois rode:

```bash
cd src/mobile
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api npm run android
```

No Android Emulator, `10.0.2.2` e o endereco especial para acessar o `localhost` do Mac.

### 6. Testar no celular fisico com Expo Go

Este modo depende do app Expo Go e da rede local. Em caso de problema com QR Code ou versao do Expo Go, prefira web ou Android Emulator.

1. Conecte computador e celular na mesma rede Wi-Fi.
2. Descubra o IP do computador.
3. Rode o Expo usando esse IP na URL da API:

```bash
cd src/mobile
EXPO_PUBLIC_API_URL=http://SEU_IP:8000/api npm run start
```

Exemplo:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8000/api npm run start
```

Depois leia o QR Code pelo Expo Go.

### 7. Fluxo manual para validar

1. Abra o app.
2. Toque em `Criar conta`.
3. Cadastre nome, e-mail e senha com minimo de 8 caracteres.
4. Confirme se o app navega para o Dashboard.
5. Abra `Perfil`.
6. Toque em `Atualizar perfil`.
7. Toque em `Sair`.
8. Entre novamente pela tela de Login.

Se o app abrir direto no Dashboard, provavelmente existe um token salvo no AsyncStorage. Entre em `Perfil > Sair` ou limpe os dados do Expo Go/emulador.

## Expo Go x build instalada

Os comandos abaixo rodam o app via Expo/Metro:

```bash
npm run start
npm run web
npm run android
```

Nesse modo, o Android Studio pode mostrar o app como Expo Go, e nao como um APK standalone chamado Silver. Isso e esperado.

Para gerar um projeto Android nativo local e instalar uma build de desenvolvimento no emulador:

```bash
cd src/mobile
npx expo prebuild --platform android
npx expo run:android
```

Esse fluxo cria a pasta `android/`, que esta ignorada no Git e nao deve ser commitada nesta etapa.

Endpoints planejados no servico inicial:

- `POST /api/login`
- `POST /api/register`
- `GET /api/me`
- `GET /api/accounts`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/categorias`
- `GET /api/budgets`
- `GET /api/goals`

## Rodar com Expo manualmente

```bash
cd src/mobile
npm run start
```

Depois, leia o QR Code com o Expo Go ou use as opcoes do terminal para abrir em emulador.

## Testar na web manualmente

```bash
cd src/mobile
npm run web
```

Se o navegador nao abrir automaticamente, acesse a URL exibida no terminal, normalmente `http://localhost:8081`.

## Testar em celular fisico manualmente

1. Deixe computador e celular na mesma rede.
2. Rode `npm run start`.
3. Leia o QR Code no Expo Go.
4. Se for testar API local, troque `EXPO_PUBLIC_API_URL` pelo IP do computador.

## Testar em emulador manualmente

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
- Login, cadastro e perfil usam os endpoints reais de autenticacao.

## Fluxo de autenticacao

As telas de Login, Cadastro e Perfil ja estao preparadas para a API real:

- Login chama `POST /api/login`.
- Cadastro chama `POST /api/register`.
- O token retornado e salvo no AsyncStorage.
- O interceptor do Axios envia `Authorization: Bearer <token>`.
- Perfil chama `GET /api/me`.
- Sair remove o token local e volta para Login.

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
