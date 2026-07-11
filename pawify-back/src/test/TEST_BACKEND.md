# Pruebas - Backend Pawify

Este documento describe las pruebas unitarias e de integración implementadas para el backend de Pawify.

## Ejecución de Tests

```bash
# Ejecutar todas las pruebas (unitarias + integración)
.\mvnw.cmd test -Dtest="!PawifyApplicationTests"

# Ejecutar solo pruebas unitarias
.\mvnw.cmd test -Dtest="com.example.pawify.service.**"

# Ejecutar solo pruebas de integración
.\mvnw cmd test -Dtest="com.example.pawify.integration.**"
```

El test `PawifyApplicationTests` está excluido porque requiere configuración de base de datos externa.

---

## Resumen General

| Tipo | Clases de Test | Pruebas |
|------|---------------|---------|
| Unitarias (Mockito) | 4 | 39 |
| Integración (MockMvc + H2) | 4 | 47 |
| **Total** | **8** | **86** |

---

## Pruebas de Integración

Las pruebas de integración utilizan `@SpringBootTest` con MockMvc y base de datos H2 en memoria. Cada test se ejecuta dentro de una transacción que se revierte automáticamente.

**Infraestructura:**
- Base de datos: H2 en memoria (`application-test.yaml`)
- HTTP: MockMvc con contexto completo de Spring Security
- Autenticación: JWT tokens generados directamente desde `JwtService`
- Cloudinary: Mockeado (`TestCloudinaryConfig`)
- Aislamiento: `@Transactional` con rollback automático

**Ubicación:** `integration/`

| Clase de Test | Casos de Prueba | Descripción |
|---------------|-----------------|-------------|
| `AuthIntegrationTest` | 14 | Autenticación, registro, tokens, recuperación, control de acceso |
| `OrderIntegrationTest` | 12 | Creación, validación de stock, agrupación, tracking |
| `ProductIntegrationTest` | 14 | Listado, filtrado, CRUD, categorías, marcas |
| `AdminIntegrationTest` | 7 | Listado paginado, control de acceso admin |
| **Total** | **47** | |

---

### AuthIntegrationTest (CP-001 a CP-014)

| Caso | Descripción | Endpoint | Status Esperado |
|------|-------------|----------|-----------------|
| CP-001 | Registro de comprador exitoso | POST /auth/register/buyer | 201 CREATED |
| CP-002 | Rechazar username duplicado | POST /auth/register/buyer | 409 CONFLICT |
| CP-003 | Rechazar DNI duplicado | POST /auth/register/buyer | 409 CONFLICT |
| CP-004 | Rechazar campos vacíos | POST /auth/register/buyer | 400 BAD_REQUEST |
| CP-005 | Login exitoso retorna tokens | POST /auth/login | 200 OK |
| CP-006 | Login con contraseña incorrecta | POST /auth/login | 401 UNAUTHORIZED |
| CP-007 | Login con usuario inexistente | POST /auth/login | 401 UNAUTHORIZED |
| CP-008 | Refresh token válido | POST /auth/refresh | 200 OK |
| CP-009 | Refresh token inválido | POST /auth/refresh | 401 UNAUTHORIZED |
| CP-010 | Solicitar código de recuperación | POST /auth/recovery/request-code | 200 OK |
| CP-011 | Recuperación con usuario inexistente | POST /auth/recovery/request-code | 404 NOT_FOUND |
| CP-012 | Buyer no accede a endpoint admin | GET /admin/buyers | 403 FORBIDDEN |
| CP-013 | Admin no accede a endpoint buyer | GET /order | 403 FORBIDDEN |
| CP-014 | Endpoint protegido sin token | POST /user/password | 401 UNAUTHORIZED |

### OrderIntegrationTest (CP-015 a CP-026)

| Caso | Descripción | Endpoint | Status Esperado |
|------|-------------|----------|-----------------|
| CP-015 | Crear orden exitosamente | POST /order | 200 OK |
| CP-016 | Crear orden con múltiples productos | POST /order | 200 OK |
| CP-017 | Agrupar productos duplicados | POST /order | 200 OK |
| CP-018 | Rechazar producto inexistente | POST /order | 404 NOT_FOUND |
| CP-019 | Rechazar stock insuficiente | POST /order | 409 CONFLICT |
| CP-020 | Rechazar producto sin stock | POST /order | 409 CONFLICT |
| CP-021 | Rechazar cantidad cero | POST /order | 400 BAD_REQUEST |
| CP-022 | Admin no puede crear orden | POST /order | 403 FORBIDDEN |
| CP-023 | Listar órdenes del comprador | GET /order | 200 OK |
| CP-024 | Filtrar órdenes por estado | GET /order?statuses=PENDING | 200 OK |
| CP-025 | Obtener orden por tracking code | GET /order/{trackingCode} | 200 OK |
| CP-026 | Tracking code inexistente | GET /order/NOEXISTE-12345 | 404 NOT_FOUND |

### ProductIntegrationTest (CP-027 a CP-042)

| Caso | Descripción | Endpoint | Status Esperado |
|------|-------------|----------|-----------------|
| CP-027 | Listar productos activos | GET /product | 200 OK |
| CP-028 | Filtrar por nombre | GET /product?search=Dog | 200 OK |
| CP-029 | Filtrar por categoría | GET /product?category=Alimentos | 200 OK |
| CP-030 | Filtrar por marca | GET /product?brand=Pedigree | 200 OK |
| CP-031 | Filtrar por rango de precios | GET /product?minPrice=10&maxPrice=50 | 200 OK |
| CP-032 | Obtener producto por ID | GET /product/{id} | 200 OK |
| CP-033 | Producto no encontrado | GET /product/9999 | 200 OK (null) |
| CP-034 | Admin crea producto | POST /product | 200 OK |
| CP-035 | Buyer no puede crear producto | POST /product | 403 FORBIDDEN |
| CP-036 | Rechazar creación con campos vacíos | POST /product | 400 BAD_REQUEST |
| CP-037 | Admin desactiva producto | PATCH /product/{shareCode}/deactivate | 204 NO_CONTENT |
| CP-038 | Admin activa producto | PATCH /product/{shareCode}/activate | 204 NO_CONTENT |
| CP-039 | Buyer no puede desactivar | PATCH /product/{shareCode}/deactivate | 403 FORBIDDEN |
| CP-040 | Listar categorías | GET /category | 200 OK |
| CP-042 | Listar marcas | GET /brand | 200 OK |

### AdminIntegrationTest (CP-049 a CP-056)

| Caso | Descripción | Endpoint | Status Esperado |
|------|-------------|----------|-----------------|
| CP-049 | Listar buyers paginados | GET /admin/buyers | 200 OK |
| CP-050 | Buyer no puede listar buyers | GET /admin/buyers | 403 FORBIDDEN |
| CP-052 | Listar admins paginados | GET /admin/admins | 200 OK |
| CP-054 | Cambiar estado envío a DELIVERED | PATCH /admin/order/{trackingCode}/shipping-status | 204 NO_CONTENT |
| CP-055 | Buyer no puede cambiar shipping | PATCH /admin/order/{trackingCode}/shipping-status | 403 FORBIDDEN |
| CP-056 | Shipping de orden inexistente | PATCH /admin/order/NOEXISTE-12345/shipping-status | 404 NOT_FOUND |

---

### Casos no implementados (endpoints inexistentes)

Los siguientes casos de prueba requieren endpoints que aún no están implementados:

| Caso | Endpoint | Descripción |
|------|----------|-------------|
| CP-041 | GET /category/{name}/sub-category | Listar subcategorías por categoría |
| CP-043 a CP-048 | /claim, /message | Sistema de reclamos y mensajes |
| CP-051 | GET /admin/profile | Perfil del admin |
| CP-053 | GET /admin/order | Listar todas las órdenes (admin) |
| CP-057 | GET /admin/product | Admin lista productos |
| CP-058 | GET /admin/product?search= | Admin busca productos |

---

## Pruebas Unitarias (Mockito)

Las pruebas unitarias utilizan Mockito sin contexto de Spring para evitar dependencias de base de datos.

### AuthServiceImplTest (18 tests)

**Ubicación:** `service/AuthServiceImplTest.java`

#### RegisterBuyerTests (5 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUsernameExists` | Verifica que se lance `UsernameAlreadyUsedException` cuando el nombre de usuario ya existe |
| `shouldThrowWhenDniExists` | Verifica que se lance `CredentialsAlreadyInUseException` cuando el DNI ya está registrado |
| `shouldThrowWhenEmailExists` | Verifica que se lance `CredentialsAlreadyInUseException` cuando el email ya está en uso |
| `shouldThrowWhenRoleNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el rol BUYER no existe |
| `shouldRegisterBuyerSuccessfully` | Verifica el registro exitoso de un comprador |

#### LoginTests (3 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUserNotFound` | Verifica que se lance excepción cuando el usuario no existe |
| `shouldThrowWhenPasswordIncorrect` | Verifica que se lance excepción cuando la contraseña es incorrecta |
| `shouldReturnTokensOnSuccess` | Verifica que se retornen los tokens JWT al iniciar sesión correctamente |

#### SendRecoveryCodeTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUsernameNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el username no existe |
| `shouldSendRecoveryCodeSuccessfully` | Verifica el envío exitoso del código de recuperación por email |

#### VerifyTokenTests (4 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUserNotFound` | Verifica que se lance excepción cuando el usuario no existe |
| `shouldThrowWhenTokenNotFound` | Verifica que se lance `InvalidRecoveryCodeException` cuando no hay token activo |
| `shouldThrowWhenTokenExpired` | Verifica que se lance excepción cuando el token ha expirado |
| `shouldThrowWhenTokenInvalid` | Verifica que se lance excepción cuando el código ingresado es incorrecto |

#### ResetPasswordTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUserNotFound` | Verifica que se lance excepción cuando el usuario no existe |
| `shouldThrowWhenTokenExpired` | Verifica que se lance excepción cuando el token ha expirado |

#### RefreshTokenTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenTokenInvalid` | Verifica que se lance `UserInvalidCredentialsException` cuando el refresh token es inválido |
| `shouldReturnNewTokensOnSuccess` | Verifica que se generen nuevos tokens JWT al refrescar exitosamente |

---

### UserServiceImplTest (3 tests)

**Ubicación:** `service/UserServiceImplTest.java`

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenCurrentPasswordIncorrect` | Verifica que se lance `BadRequestException` cuando la contraseña actual es incorrecta |
| `shouldThrowWhenPasswordsDontMatch` | Verifica que se lance `BadRequestException` cuando las nuevas contraseñas no coinciden |
| `shouldChangePasswordSuccessfully` | Verifica el cambio exitoso de contraseña |

---

### OrderServiceImplTest (7 tests)

**Ubicación:** `service/OrderServiceImplTest.java`

#### CreateOrderTests (4 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenProductNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el producto no existe |
| `shouldThrowWhenNotEnoughStock` | Verifica que se lance `NotEnoughStockException` cuando el stock es insuficiente |
| `shouldCreateOrderSuccessfully` | Verifica la creación exitosa de un pedido y decremento de stock |
| `shouldGroupSameProductIds` | Verifica que productos duplicados en el pedido se agrupen y sumen las cantidades |

#### GetOrdersByBuyerTests (1 test)

| Test | Descripción |
|------|-------------|
| `shouldReturnOrdersPaginated` | Verifica que se retornen los pedidos paginados de un comprador |

#### GetOrderByTrackingCodeTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenOrderNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el tracking code no existe |
| `shouldReturnOrderWhenValid` | Verifica que se retorne el pedido cuando el tracking code es válido |

---

### ProductServiceImplTest (11 tests)

**Ubicación:** `service/ProductServiceImplTest.java`

#### CreateProductTests (4 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenNotAdmin` | Verifica que se lance `UnauthorizedRequestException` si el usuario no es admin |
| `shouldThrowWhenNoImages` | Verifica que se lance `ImagesNotProvidedException` si no se proporcionan imágenes |
| `shouldCreateNewBrandIfNotExists` | Verifica que se cree una nueva marca si no existe |
| `shouldUseExistingBrand` | Verifica que se use la marca existente cuando ya está registrada |

#### DeactivateProductTests (3 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenProductNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el producto no existe |
| `shouldDoNothingWhenAlreadyInactive` | Verifica que no se realice ninguna acción si el producto ya está inactivo |
| `shouldDeactivateWhenActive` | Verifica la desactivación exitosa de un producto activo |

#### GetProductsTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldReturnProductsWithoutFilters` | Verifica que se retornen productos sin filtros aplicados |
| `shouldFilterBySearchTerm` | Verifica que se filtren productos por término de búsqueda |

#### UpdateProductTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenProductNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el producto no existe |
| `shouldUpdateProductSuccessfully` | Verifica la actualización exitosa de un producto |

---

## Excepciones Manejadas en Tests

| Excepción | Descripción |
|-----------|-------------|
| `BadRequestException` | Solicitud inválida (contraseña incorrecta, passwords no coinciden) |
| `CredentialsAlreadyInUseException` | Credenciales (DNI, email) ya registradas |
| `ImagesNotProvidedException` | Lista de imágenes vacía o nula |
| `InvalidRecoveryCodeException` | Código de recuperación inválido o expirado |
| `NotEnoughStockException` | Stock insuficiente para la cantidad solicitada |
| `ResourceNotFoundException` | Recurso no encontrado (usuario, producto, orden) |
| `UnauthorizedRequestException` | Usuario sin permisos para la operación |
| `UserInvalidCredentialsException` | Credenciales de login inválidas |
| `UsernameAlreadyUsedException` | Nombre de usuario ya registrado |
