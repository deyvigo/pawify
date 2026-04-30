# Documento de Especificación de Base de Datos

## Nombre del sistema: Pawify
## Motor de DB: PostgreSQL
## Descripción
Base de datos para sistema e-commerce Pawify

## Diagrama
![Diagrama](./images/database.png)

## Modelo General
El sistema está dividido en módulos
- Usuarios y autenticación
- Catálogo de productos
- Pedidos
- Pagos
- Reseñas
- Soporte (claims/messages)

Relaciones clave
- Usuario → Comprador/Admin
- Producto → Categoría/Subcategoría/Marca
- Pedido → Detalles → Productos
- Detalles → Reviews / Estados / Reclamos

## Usuarios y seguridad
Tabla `users`
| Campo      | Tipo       | Restricciones |
| ---------- | ---------- | ------------- |
| id         | INT        | PK            |
| username   | STRING     | NOT NULL      |
| password   | STRING     | NOT NULL      |
| first_name | STRING     | NOT NULL      |
| last_name  | STRING     | NOT NULL      |
| dni        | VARCHAR(8) | NOT NULL      |
| role_id    | INT        | FK → roles.id |

Reglas:
- `username`, `dni` debe ser único

Tabla `roles`
| Campo | Tipo   |    |
| ----- | ------ | -- |
| id    | INT    | PK |
| name  | STRING |    |

Tabla `admins`
| Campo      | Tipo     |               |
| ---------- | -------- | ------------- |
| user_id    | INT      | FK → users.id |
| created_at | DATETIME |               |

Reglas:
- Relación 1:1 con users

Tabla `buyers`
| Campo      | Tipo   |                   |
| ---------- | ------ | ----------------- |
| email      | STRING |                   |
| address_id | INT    | FK → addresses.id |
| user_id    | INT    | FK → users.id     |
| profile_id | INT    |                   |

Tabla `password_reset_token`
| Campo           | Tipo   |
| --------------- | ------ |
| token_hash      | STRING |
| created_at      | DATE   |
| expiration_date | DATE   |
| user_id         | INT FK |

## Pagos
Tabla `pagos`
| Campo    | Tipo     |
| -------- | -------- |
| id       | INT      |
| name     | STRING   |
| number   | STRING   |
| due_date | DATETIME |

Reglas:
- No se guarda número de tarjeta en texto plano

Tabla `buyer_card``
| Campo    | Tipo   |
| -------- | ------ |
| buyer_id | INT FK |
| card_id  | INT FK |

Reglas:
- Un buyer puede tener muchas tarjetas

## Productos
Tabla `products`
| Campo           | Tipo      |
| --------------- | --------- |
| id              | INT       |
| name            | STRING    |
| description     | STRING    |
| price           | BIGDECIMAL|
| stock           | INT       |
| rating          | DOUBLE    |
| sold_count      | INT       |
| active          | BOOL      |
| share_code      | STRING    |
| review_count    | INT       |
| created_at      | DATETIME  |
| created_by      | INT FK    |
| brand_id        | INT FK    |
| sub_category_id | INT FK    |
| category_id     | INT FK    |

Tabla `brands`
| Campo | Tipo   |
| ----- | ------ |
| id    | INT    |
| name  | STRING |

Tabla `categories`
| Campo | Tipo   |
| ----- | ------ |
| id    | INT    |
| name  | STRING |

Tabla `sub_categories`
| Campo       | Tipo   |
| ----------- | ------ |
| id          | INT    |
| name        | STRING |
| category_id | INT FK |

Tabla `images`
| Campo | Tipo   |
| ----- | ------ |
| id    | INT    |
| path  | STRING |

Tabla `product_image`
| Campo      | Tipo   |
| ---------- | ------ |
| product_id | INT FK |
| image_id   | INT FK |

Tabla `orders`
| Campo    | Tipo            |
| -------- | --------------- |
| id       | INT             |
| order_at | DATETIME        |
| total    | DOUBLE          |
| order_by | INT FK → buyers |

Tabla `order_detail`
| Campo     | Tipo   |
| --------- | ------ |
| id        | INT    |
| order_id  | INT FK |
| detail_id | INT FK |

Tabla `details`
| Campo      | Tipo   |
| ---------- | ------ |
| id         | INT    |
| quantity   | INT    |
| price      | DOUBLE |
| product_id | INT FK |

## Reseñas
Tabla `reviews`
| Campo     | Tipo   |
| --------- | ------ |
| id        | INT    |
| content   | STRING |
| rating    | INT    |
| detail_id | INT FK |

Tabla `statuses`
| Campo       | Tipo     |
| ----------- | -------- |
| id          | INT      |
| title       | STRING   |
| description | STRING   |
| updated_at  | DATETIME |
| detail_id   | INT FK   |

Reglas:
- El estado es producto comprado no por orden de compra.

## Direcciones
Tabla `addresses`
| Campo     | Tipo   |
| --------- | ------ |
| id        | INT    |
| name      | STRING |
| reference | STRING |
| lat       | DOUBLE |
| long      | DOUBLE |

## Soporte
Tabla `claims`
| Campo      | Tipo   |
| ---------- | ------ |
| id         | INT    |
| detail_id  | INT FK |
| support_id | INT    |
| user_id    | INT FK |

Tabla `messages`
| Campo      | Tipo     |
| ---------- | -------- |
| id         | INT      |
| content    | STRING   |
| created_at | TIMESTAMP|
| claim_id   | INT FK   |

## Datos iniciales
Roles por defecto: `admin`,  `buyer`
