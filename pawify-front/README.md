# Pawify Front

Aplicación móvil frontend para Pawify - plataforma de productos para mascotas.

## Requisitos

- **Node.js**: versión 18 o superior
- **Expo SDK**: versión 54 o superior
- **npm** o **yarn** como gestor de paquetes

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

El token JWT es necesario para autenticar las requests al backend. Sigue estos pasos:

1. Asegúrate de que el backend esté ejecutándose
2. Realiza una solicitud de login al endpoint de autenticación (usando Postman, curl o swagger)
3. En la respuesta del login, busca el campo `token`
4. Copia ese token y pégalo en tu archivo `.env.local`:

```bash
AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Configurar la URL del backend (opcional)

Por defecto, la aplicación usa `http://localhost:3000` como URL del backend. Si necesitas cambiarla:

```bash
API_BASE_URL=http://localhost:3000
```

**Nota**: Si no configuras `API_BASE_URL`, se usará el valor por defecto (`http://localhost:3000`).

### 4. Iniciar la aplicación

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
| `AUTH_TOKEN` | Token JWT del usuario (obtenido del backend tras hacer login) | **Sí** |
| `API_BASE_URL` | URL base del backend. Valor por defecto: `http://localhost:3000` | No |

## Scripts disponibles

```bash
npm start          # Iniciar Expo (método recomendado)
npm run android    # Iniciar para Android
npm run ios        # Iniciar para iOS
npm run web        # Iniciar para Web
```

## Notas importantes

- **No commitees** el archivo `.env.local` - contiene tu token de autenticación y otros datos sensibles
- Si tu backend usa un puerto diferente, asegúrate de actualizar `API_BASE_URL`
- Para ejecutar en un dispositivo físico, escanea el código QR con la app de Expo Go