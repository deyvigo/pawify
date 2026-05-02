# Pawify Front

Aplicación móvil frontend para Pawify - plataforma de productos para mascotas.

## Requisitos

- Node.js 18+
- Expo SDK 54+
- npm o yarn

## Instalación

```bash
cd pawify-front
npm install
```

## Configuración

### 1. Crear archivo de variables de entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env.local
```

### 2. Obtener el token de autenticación

1. Ejecuta la aplicación: `npx expo start`
2. Haz login en el backend (usando Postman o swagger)
3. Copia el `token` que recibes en la respuesta
4. Pégalo en tu archivo `.env.local`:

```bash
AUTH_TOKEN=tu_token_aqui
```

### 3. Iniciar la aplicación

```bash
npx expo start
```

## Estructura de archivos

```
pawify-front/
├── app.config.js        # Configuración de Expo (usa variables de entorno)
├── .env.local          # Tus datos sensibles (NO commitear)
├── .env.example        # Template de variables ( público)
├── src/
│   ├── screens/        # Pantallas de la app
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Custom hooks (useAuth, useProducts)
│   ├── utils/          # Utilidades (jwt decoder)
│   ├── services/       # Cliente API
│   ├── config/         # Configuración general
│   └── types/          # TypeScript types
```

## Variables de entorno

| Variable | Descripción | ¿Obligatorio? |
|----------|-------------|---------------|
| `AUTH_TOKEN` | Token JWT del usuario (obtenido del backend) | Sí |
| `API_BASE_URL` | URL del backend | No (tiene fallback) |

## Scripts disponibles

```bash
npm start          # Iniciar Expo
npm run android    # Iniciar para Android
npm run ios        # Iniciar para iOS
npm run web        # Iniciar para Web
```