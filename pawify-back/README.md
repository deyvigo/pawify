# pawify-back

Backend de **Pawify**, construido con **Spring Boot 4.0.5** sobre **Java 21**.

Sirve la API REST, autenticación con JWT, WebSockets y la documentación OpenAPI/Swagger. Se comunica con una base de datos **PostgreSQL 16** y usa servicios externos (Cloudinary, SendGrid, Stripe).

---

## 📋 Requisitos previos

| Herramienta | Versión mínima | Para qué |
|-------------|----------------|----------|
| [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) | — | Levantar la API y la base de datos en contenedores (recomendado) |
| [JDK 21](https://adoptium.net/) | 21 | Ejecutar la app localmente con Maven |
| [Maven](https://maven.apache.org/) (o usar el wrapper `mvnw`) | 3.9+ | Compilar y ejecutar la app localmente |
| PostgreSQL 16 | 16 | Solo si corres la app **sin Docker** para la DB |

---

## 🚀 Formas de levantarlo

### Opción 1: Docker Compose (recomendado para desarrollo local)

1. Crea el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

2. Edita `.env` con tus propios valores. Usa `.env.example` como plantilla:

```env
POSTGRES_DB=pawify-db
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=password

SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/pawify-db
SPRING_DATASOURCE_USERNAME=dbuser
SPRING_DATASOURCE_PASSWORD=password

JWT_SECRET_KEY=tu-clave-secreta-muy-larga-y-aleatoria
JWT_EXPIRATION_TIME=604800000

CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

STRIPE_PUBLISHABLE_KEY=pk_test_dummy
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy
SENDGRID_API_KEY=dummy
```

> ⚠️ **Nunca subas credenciales reales a control de versión.** El archivo `.env` **no se versiona** (está en `.gitignore`). Cada desarrollador debe crear su propio `.env` a partir de `.env.example` con sus valores personales. Los valores mostrados arriba son solo ejemplos ilustrativos.

3. Levanta los servicios:

```bash
docker compose up --build
```

Esto levanta dos contenedores:

| Servicio | Puerto expuesto | Notas |
|----------|-----------------|-------|
| `pawify-db` (PostgreSQL) | `5432:5432` | Accesible desde el IDE/pgAdmin |
| `pawify-backend` (API) | `8080:8080` | Perfil `dev` activo |

La configuración de desarrollo está en `compose.override.yaml` (se carga automáticamente con `docker compose up`).

4. Verifica que esté funcionando:

```bash
# Salud de la API (Swagger)
curl http://localhost:8080/api-docs

# Base de datos
psql -h localhost -U dbuser -d pawify-db
```

Para detener y limpiar:

```bash
docker compose down
```

---

### Opción 2: Producción (detrás de Traefik)

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

- No publica puertos al host; el tráfico entra por la red externa `web` (debe existir ya en el servidor).
- Perfil `prod` activo.
- Routing por Traefik en `pawify.deyvigo.online` con redirección HTTP → HTTPS.

---

### Opción 3: Local con Maven (solo la API)

Si ya tienes una PostgreSQL corriendo (local o remota) y solo quieres levantar la API con Maven:

1. Asegúrate de tener el `.env` configurado con la URL correcta de tu base de datos, por ejemplo:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/pawify-db
SPRING_DATASOURCE_USERNAME=dbuser
SPRING_DATASOURCE_PASSWORD=password
```

2. Exporta las variables (o ciéralas en tu IDE):

```bash
# PowerShell
Get-Content .env | ForEach-Object { if ($_ -match '=') { $parts = $_ -split '='; [Environment]::SetEnvironmentVariable($parts[0], $parts[1]) } }

# CMD / Bash (ejemplo)
export $(grep -v '^#' .env | xargs)
```

3. Ejecuta la app con el perfil `dev`:

```bash
# Con el wrapper de Maven (recomendado si no tienes Maven instalado)
.\mvnw spring-boot:run -Dspring-boot.run.profiles=dev   # Windows
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev   # Linux/Mac

# O con Maven instalado
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

La API quedará disponible en `http://localhost:8080`.

---

## 📚 Perfiles de Spring

| Perfil | Archivo | Uso |
|--------|---------|-----|
| `dev` | `application-dev.yaml` | Desarrollo local (puerto 8080 expuesto, logs DEBUG) |
| `prod` | `application-prod.yaml` | Producción (detrás de Traefik) |
| `test` | `application-test.yaml` | Tests automáticos (H2) |

El archivo base es `application.yaml`. Todas las propiedades sensibles se leen de variables de entorno (`${...}`), definidas en `.env`.

---

## 🛠 Scripts útiles

| Script | Descripción |
|--------|-------------|
| `scripts/reupload-seed-images.mjs` | Sube las imágenes de semilla (seed) a Cloudinary. Úsalo si necesitas volver a cargar recursos estáticos en el bucket. |

---

## 📦 Estructura de carpetas

```
pawify-back/
├── src/
│   ├── main/               # Código fuente principal (Java + recursos)
│   └── test/               # Tests
├── database/
│   └── init/               # Scripts SQL de inicialización de la BD (montados en PostgreSQL)
├── scripts/                # Scripts de utilidad (Node.js)
├── .mvn/                   # Wrapper de Maven
├── target/                 # Build generado (no se versiona)
├── .env                    # Variables de entorno locales (no se versiona)
├── .env.example            # Plantilla de variables de entorno
├── compose.yaml            # Docker Compose base (local + prod)
├── compose.override.yaml   # Overlay de desarrollo (expone puertos, perfil dev)
├── compose.prod.yaml       # Overlay de producción (Traefik, perfil prod)
├── Dockerfile              # Imagen de la API (Maven build + JRE 21)
├── mvnw / mvnw.cmd         # Wrapper de Maven
├── pom.xml                 # Dependencias y configuración de Maven
└── README.md               # Este archivo
```

---

## 🔗 Endpoints principales

Una vez levantada la API en el puerto `8080`:

| Recurso | URL |
|---------|-----|
| Documentación OpenAPI (Swagger UI) | `http://localhost:8080/api-docs` |
| API REST | `http://localhost:8080/api/...` |
| WebSocket | `ws://localhost:8080/...` |

Consulta `/api-docs` para ver todos los endpoints disponibles y sus esquemas de request/response.

---

## 🧪 Ejecutar tests

```bash
.\mvnw test      # Windows
./mvnw test      # Linux/Mac
```

Los tests usan el perfil `test` y base de datos H2 en memoria.

---

## 📌 Notas rápidas

- El proyecto usa **Java 21**. Asegúrate de que tu `JAVA_HOME` apunte a JDK 21 si corres Maven fuera de Docker.
- Las claves de Stripe y SendGrid incluidas en `.env` son **dummies** (solo para que la app arranque en local); no se usan para operaciones reales en desarrollo.
- La imagen de Docker se construye con el `Dockerfile` usando el `maven:3.9.9-eclipse-temurin-21` para compilar y `eclipse-temurin:21-jre-alpine` para correr.