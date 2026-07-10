# Pruebas Unitarias - Backend Pawify

Este documento describe las pruebas unitarias implementadas para el backend de Pawify, ubicado en `src/test/java/com/example/pawify/service/`.

## Ejecución de Tests

```bash
.\mvnw.cmd test -Dtest="!PawifyApplicationTests"
```

El test `PawifyApplicationTests` está excluido porque requiere configuración de base de datos. Las pruebas unitarias utilizan Mockito sin contexto de Spring para evitar dependencias de base de datos.

---

## Resumen de Tests

| Clase de Test | Pruebas | Descripción |
|---------------|---------|-------------|
| `AuthServiceImplTest` | 18 | Autenticación y registro de usuarios |
| `UserServiceImplTest` | 3 | Cambio de contraseña |
| `OrderServiceImplTest` | 7 | Creación y consulta de pedidos |
| `ProductServiceImplTest` | 11 | Gestión de productos |
| **Total** | **39** | |

---

## AuthServiceImplTest

**Ubicación:** `service/AuthServiceImplTest.java`

### RegisterBuyerTests (5 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUsernameExists` | Verifica que se lance `UsernameAlreadyUsedException` cuando el nombre de usuario ya existe |
| `shouldThrowWhenDniExists` | Verifica que se lance `CredentialsAlreadyInUseException` cuando el DNI ya está registrado |
| `shouldThrowWhenEmailExists` | Verifica que se lance `CredentialsAlreadyInUseException` cuando el email ya está en uso |
| `shouldThrowWhenRoleNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el rol BUYER no existe |
| `shouldRegisterBuyerSuccessfully` | Verifica el registro exitoso de un comprador |

### LoginTests (3 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUserNotFound` | Verifica que se lance excepción cuando el usuario no existe |
| `shouldThrowWhenPasswordIncorrect` | Verifica que se lance excepción cuando la contraseña es incorrecta |
| `shouldReturnTokensOnSuccess` | Verifica que se retornen los tokens JWT al iniciar sesión correctamente |

### SendRecoveryCodeTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUsernameNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el username no existe |
| `shouldSendRecoveryCodeSuccessfully` | Verifica el envío exitoso del código de recuperación por email |

### VerifyTokenTests (4 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUserNotFound` | Verifica que se lance excepción cuando el usuario no existe |
| `shouldThrowWhenTokenNotFound` | Verifica que se lance `InvalidRecoveryCodeException` cuando no hay token activo |
| `shouldThrowWhenTokenExpired` | Verifica que se lance excepción cuando el token ha expirado |
| `shouldThrowWhenTokenInvalid` | Verifica que se lance excepción cuando el código ingresado es incorrecto |

### ResetPasswordTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenUserNotFound` | Verifica que se lance excepción cuando el usuario no existe |
| `shouldThrowWhenTokenExpired` | Verifica que se lance excepción cuando el token ha expirado |

### RefreshTokenTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenTokenInvalid` | Verifica que se lance `UserInvalidCredentialsException` cuando el refresh token es inválido |
| `shouldReturnNewTokensOnSuccess` | Verifica que se generen nuevos tokens JWT al refrescar exitosamente |

---

## UserServiceImplTest

**Ubicación:** `service/UserServiceImplTest.java`

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenCurrentPasswordIncorrect` | Verifica que se lance `BadRequestException` cuando la contraseña actual es incorrecta |
| `shouldThrowWhenPasswordsDontMatch` | Verifica que se lance `BadRequestException` cuando las nuevas contraseñas no coinciden |
| `shouldChangePasswordSuccessfully` | Verifica el cambio exitoso de contraseña |

---

## OrderServiceImplTest

**Ubicación:** `service/OrderServiceImplTest.java`

### CreateOrderTests (4 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenProductNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el producto no existe |
| `shouldThrowWhenNotEnoughStock` | Verifica que se lance `NotEnoughStockException` cuando el stock es insuficiente |
| `shouldCreateOrderSuccessfully` | Verifica la creación exitosa de un pedido y decremento de stock |
| `shouldGroupSameProductIds` | Verifica que productos duplicados en el pedido se agrupen y sumen las cantidades |

### GetOrdersByBuyerTests (1 test)

| Test | Descripción |
|------|-------------|
| `shouldReturnOrdersPaginated` | Verifica que se retornen los pedidos paginados de un comprador |

### GetOrderByTrackingCodeTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenOrderNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el tracking code no existe |
| `shouldReturnOrderWhenValid` | Verifica que se retorne el pedido cuando el tracking code es válido |

---

## ProductServiceImplTest

**Ubicación:** `service/ProductServiceImplTest.java`

### CreateProductTests (4 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenNotAdmin` | Verifica que se lance `UnauthorizedRequestException` si el usuario no es admin |
| `shouldThrowWhenNoImages` | Verifica que se lance `ImagesNotProvidedException` si no se proporcionan imágenes |
| `shouldCreateNewBrandIfNotExists` | Verifica que se cree una nueva marca si no existe |
| `shouldUseExistingBrand` | Verifica que se use la marca existente cuando ya está registrada |

### DeactivateProductTests (3 tests)

| Test | Descripción |
|------|-------------|
| `shouldThrowWhenProductNotFound` | Verifica que se lance `ResourceNotFoundException` cuando el producto no existe |
| `shouldDoNothingWhenAlreadyInactive` | Verifica que no se realice ninguna acción si el producto ya está inactivo |
| `shouldDeactivateWhenActive` | Verifica la desactivación exitosa de un producto activo |

### GetProductsTests (2 tests)

| Test | Descripción |
|------|-------------|
| `shouldReturnProductsWithoutFilters` | Verifica que se retornen productos sin filtros aplicados |
| `shouldFilterBySearchTerm` | Verifica que se filtren productos por término de búsqueda |

### UpdateProductTests (2 tests)

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
