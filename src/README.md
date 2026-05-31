# Código Fonte

Este diretório concentra os módulos executáveis do projeto.

## Estrutura

```text
src/
├── backend/   # API Laravel
└── mobile/    # App mobile (em evolução)
```

## Backend (`src/backend`)

### Requisitos

- PHP 8.4 (ou 8.3+) com extensão `mongodb` habilitada
- Composer
- Docker (para o MongoDB local)
- Herd (opcional, macOS)

### Instalação e execução local

```bash
cd src/backend

# 1. Subir o MongoDB via Docker
docker compose up -d

# 2. Instalar dependências PHP
composer install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate

# 4. Criar tabelas SQLite (sessões, cache, etc.)
php artisan migrate

# 5. Subir o servidor
php artisan serve
```

Acesso: `http://127.0.0.1:8000`

### Execução com Herd (opcional, macOS)

```bash
cd src/backend
docker compose up -d
herd link
```

Importante: o Herd deve apontar para `src/backend` (não para a raiz do monorepo).

### Rotas de autenticação da API

- `POST /api/register`
- `POST /api/login`
- `GET /api/me` (Bearer token / `auth:sanctum`)

### Nota para usuários Herd + Composer

Se houver conflito de binário PHP/Composer no terminal, execute via caminho do Herd:

```bash
HERD_BIN="$HOME/Library/Application Support/Herd/bin"
"$HERD_BIN/php84" "$HERD_BIN/composer" install
```

## Mobile (`src/mobile`)

App mobile em React Native com Expo SDK 55, TypeScript, Expo Router, AsyncStorage e Axios.

### Instalação

```bash
cd src/mobile
nvm use
npm install
cp .env.example .env
```

### Testar no navegador

```bash
cd src/mobile
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api npm run web
```

### Testar no Android Studio

Abra um emulador no Android Studio e confirme:

```bash
adb devices
```

Depois rode:

```bash
cd src/mobile
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api npm run android
```

### Testar em celular físico com Expo Go

Use o IP da máquina na rede local:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8000/api npm run start
```

Se o QR Code ou o Expo Go der problema, use web ou Android Emulator para validar a entrega.

### Backend local para o mobile

Em outro terminal, suba a API:

```bash
cd src/backend
docker compose up -d
php artisan serve --host=0.0.0.0 --port=8000
```

Instruções completas: [`src/mobile/README.md`](mobile/README.md).
