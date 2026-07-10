# Pruebas Unitarias - Frontend Pawify

Este documento describe las pruebas unitarias implementadas para el frontend de Pawify, ubicado en `src/__tests__/`.

## Ejecución de Tests

```bash
cd pawify-front
npm test
```

---

## Resumen de Tests

| Archivo | Pruebas | Descripción |
|---------|---------|-------------|
| `utils/jwt.test.ts` | 5 | Utilidades de decodificación de JWT |
| `hooks/useAuthentication.test.ts` | 8 | Hook de autenticación (login) |
| `hooks/useRegister.test.ts` | 7 | Hook de registro de usuarios |
| `services/authService.test.ts` | 5 | Servicio de autenticación |
| `services/authService.test.ts` | 2 | Cobertura adicional de servicios |
| **Total** | **27** | |

---

## utils/jwt.test.ts

**Ubicación:** `__tests__/utils/jwt.test.ts`

### decodeToken (4 tests)

| Test | Descripción |
|------|-------------|
| `decodes a valid token and returns UserPayload` | Verifica que se decodifique correctamente un token JWT válido retornando el payload con username, first_name, last_name y role |
| `returns null for invalid/malformed token` | Verifica que retorne null para tokens mal formados |
| `returns null for empty string` | Verifica que retorne null para string vacío |
| `returns null for token with invalid base64` | Verifica que retorne null para tokens con base64 inválido |

### getFullName (3 tests)

| Test | Descripción |
|------|-------------|
| `returns full name combining first_name and last_name` | Verifica que retorne "Juan Perez" al combinar first_name y last_name |
| `handles missing names gracefully` | Verifica que retorne string vacío cuando los nombres están vacíos |
| `trims outer whitespace from names` | Verifica que se preserve el whitespace interno pero se manejen los espacios externos |

---

## hooks/useAuthentication.test.ts

**Ubicación:** `__tests__/hooks/useAuthentication.test.ts`

| Test | Descripción |
|------|-------------|
| `shows alert when username is empty` | Verifica que se muestre alerta cuando el username está vacío |
| `shows alert when username has less than 6 characters` | Verifica que se muestre alerta cuando el username tiene menos de 6 caracteres |
| `shows alert when password has less than 8 characters` | Verifica que se muestre alerta cuando la contraseña tiene menos de 8 caracteres |
| `calls loginUser on valid input` | Verifica que se llame al servicio con username y password válidos |
| `sets isLoading true during request` | Verifica que isLoading sea true durante la petición |
| `calls onLoginSuccess on successful login` | Verifica que se llame a onLoginSuccess con token y username al tener éxito |
| `shows error alert on login failure` | Verifica que se muestre alerta de error cuando el login falla |
| `sets isLoading false after completion (success or failure)` | Verifica que isLoading sea false al completar (éxito o error) |

---

## hooks/useRegister.test.ts

**Ubicación:** `__tests__/hooks/useRegister.test.ts`

| Test | Descripción |
|------|-------------|
| `shows alert if terms are not accepted` | Verifica que se muestre alerta si no se aceptan los términos y condiciones |
| `shows alert if passwords do not match` | Verifica que se muestre alerta si las contraseñas no coinciden |
| `shows alert if required fields are missing` | Verifica que se muestre alerta si algún campo requerido está vacío |
| `calls registerUser on valid data` | Verifica que se llame al servicio con datos válidos |
| `sets isLoading true during request` | Verifica que isLoading sea true durante la petición |
| `calls onSuccess on successful registration` | Verifica que se llame a onSuccess al registrar exitosamente |
| `shows error alert on registration failure` | Verifica que se muestre alerta de error cuando el registro falla |

---

## services/authService.test.ts

**Ubicación:** `__tests__/services/authService.test.ts`

### loginUser (1 test)

| Test | Descripción |
|------|-------------|
| `calls POST /auth/login with username and password` | Verifica que se llame a POST /auth/login con las credenciales y retorne el token |

### registerUser (1 test)

| Test | Descripción |
|------|-------------|
| `calls POST /auth/register/buyer with user data` | Verifica que se llame a POST /auth/register/buyer con los datos del usuario |

### requestRecoveryCode (1 test)

| Test | Descripción |
|------|-------------|
| `calls POST /auth/recovery/request-code with username` | Verifica que se llame a POST /auth/recovery/request-code con el username y retorne el email |

### resetPassword (1 test)

| Test | Descripción |
|------|-------------|
| `calls POST /auth/recovery/reset-password with credentials` | Verifica que se llame a POST /auth/recovery/reset-password con username, code y new_password |

### verifyRecoveryCode (1 test)

| Test | Descripción |
|------|-------------|
| `calls POST /auth/recovery/verify-code with username and code` | Verifica que se llame a POST /auth/recovery/verify-code con username y code |

---

## Validaciones Cubiertas

| Validación | Ubicación |
|------------|-----------|
| Username no vacío | `useAuthentication` |
| Username mínimo 6 caracteres | `useAuthentication` |
| Password mínimo 8 caracteres | `useAuthentication` |
| Términos y condiciones aceptados | `useRegister` |
| Contraseñas coincidentes | `useRegister` |
| Campos obligatorios llenos | `useRegister` |

---

## Endpoints Probados (Mock)

| Método | Endpoint | Servicio |
|--------|----------|----------|
| POST | `/auth/login` | loginUser |
| POST | `/auth/register/buyer` | registerUser |
| POST | `/auth/recovery/request-code` | requestRecoveryCode |
| POST | `/auth/recovery/reset-password` | resetPassword |
| POST | `/auth/recovery/verify-code` | verifyRecoveryCode |
