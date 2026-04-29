# Como usuario administrador

# Autenticación
### 1. Como administrador quiero crear otro administrador (HU01)
#### Criterios de aceptación
* Si el usuario ya existe, el sistema debe mostrar un mensaje de error
* Si se han completado los campos y el usuario no existe, el sistema debe registrar el nuevo usuario

### 2. Como administrador quiero cambiar contraseñas (HU02)
#### Criterios de aceptación
* Se debe buscar el usuario por username; si no existe, el sistema muestra un mensaje informativo
* Si se ha completado el formulario, el sistema debe actualizar la contraseña

### 3. Como administrador quiero iniciar sesión en la aplicación (HU03)
#### Criterios de aceptación
* Dado que las credenciales del usuario son correctas, el sistema permite el acceso
* Si el usuario no existe, el sistema debe mostrar un mensaje de error
* Si la contraseña es incorrecta, el sistema debe mostrar un mensaje de error

## Gestión de productos

### 4. Como administrador quiero crear productos para ofrecerlos en la tienda (HU04)
#### Criterios de aceptación
* Dado que se ha completado el formulario, el sistema debe registrar el producto y mostrar un mensaje de confirmación
* Si no se ha completado el formulario o es incorrecto, el sistema debe mostrar un mensaje de error

### 5. Como administrador quiero editar productos para mantenerlos actualizados (HU05)
#### Criterios de aceptación
* Dado que modifica los datos cuando guarda cambios entonces el sistema los actualiza correctamente

### 6. Como administrador quiero desactivar productos para no ofrecerlos en la tienda (HU06)
#### Criterios de aceptación
* El administrador busca el producto para desactivarlo
* Si el producto no existe, el sistema debe mostrar un mensaje informativo
* Si el producto está desactivado, el sistema no debe mostrarlo en el catálogo

## Gestión de pedidos

### 7. Como administrador quiero visualizar pedidos para gestionarlos (HU07)
#### Criterios de aceptación
* Dado que existen pedidos cuando se accede a la página de administración entonces el sistema los muestra
* Si no hay pedidos, el sistema debe mostrar un mensaje informativo
* Cuando se selecciona un pedido, el sistema debe mostrar los detalles del pedido

### 8. Como administrador quiero cambiar el estado de un pedido para reflejar su progreso (HU08)
#### Criterios de aceptación
* Dado que modifica el estado cuando es válido entonces el sistema actualiza el estado
* Si el estado no es válido, el sistema debe mostrar un mensaje informativo

## Gestión de reclamos

### 9. Como administrador quiero visualizar reclamos para gestionarlos (HU09)
#### Criterios de aceptación
* Dado que existen reclamos cuando se accede a la página de administración entonces el sistema los muestra
* Si no hay reclamos, el sistema debe mostrar un mensaje informativo
* Cuando se selecciona un reclamo, el sistema debe mostrar los detalles del reclamo

### 10. Como administrador quiero responder los reclamos para resolverlos (HU10)
#### Criterios de aceptación
* Dado que responde al reclamo, el sistema debe registrar la repuesta

# Como usuario comprador

## Autenticación

### 1. Como usuario quiero registrarme en la aplicación (HU11)
#### Criterios de aceptación
* El usuario no tiene ninguna cuenta de usuario
* Si el username, dni o correo ya existe, el sistema debe mostrar un mensaje de error
* Si falta algún campo, el sistema debe mostrar un mensaje de error

### 2. Como usuario quiero iniciar sesión en la aplicación (HU12)
#### Criterios de aceptación
* Dado que las credenciales del usuario son correctas, el sistema permite el acceso
* Si el usuario no existe, el sistema debe mostrar un mensaje de error
* Si falta algún campo, el sistema debe mostrar un mensaje de error
* Si la contraseña es incorrecta, el sistema debe mostrar un mensaje de error

## Catálogo de productos

### 3. Como usuario quiero visualizar productos para explorar lo que puedo comprar (HU13)
#### Criterios de aceptación
* Dado que existen productos disponibles cuando se accede al catálogo, el sistema debe mostrarlos en una lista que se recargue cuando se llega a la parte baja de la página
* Si no hay productos disponibles, el sistema debe mostrar un mensaje informativo

### 4. Como usuario quiero busca productos por nombre para encontrarlos rápidamente (HU14)
#### Criterios de aceptación
* Dado que existe un producto con el nombre buscado, el sistema debe mostrarlo con sus similares
* Si no existe un producto con el nombre buscado, el sistema debe mostrar un mensaje informativo

### 5. Como usuario quiero buscar productos por código para encontrarlos rápidamente (HU15)
#### Criterios de aceptación
* Dado que existe el código y stock del producto buscado, el sistema debe mostrarlo
* Si no existe el código y stock del producto buscado, el sistema debe mostrar un mensaje informativo

### 6. Como usuario quiero filtrar productos por categoría para facilitar mi búsqueda (HU16)
#### Criterios de aceptación
* Dado que selecciona una categoría cuando hay productos entonces el sistema muestra los correspondientes
* Si no hay productos con la categoría seleccionada, el sistema debe mostrar un mensaje informativo

### 7. Como usuario quiero agregar productos al carrito para comprarlos después (HU17)
#### Criterios de aceptación
* Dado que el producto tiene stock cuando lo agrega entonces el sistema lo incluye en el carrito
* Si el producto no tiene stock, debe estar desactivado el botón de agregar al carrito

### 8. Como usuario quiero modificar cantidades en el carrito para ajustar mi compra (HU18)
#### Criterios de aceptación
* Dado que modifica la cantidad cuando es válida entonces el sistema actualiza el total
* Si la cantidad excede el stock disponible, el sistema muestra un mensaje informativo y no actualiza el total

## Pedidos
### 9. Como usuario quiero ver el estado de mis pedidos para saber su progreso (HU19)
#### Criterios de aceptación
* Dado que tiene pedidos cuando accede a su historial entonces el sistema los muestra
* Si no tiene pedidos, el sistema debe mostrar un mensaje informativo
* Cuando se selecciona un pedido, el sistema debe mostrar los detalles del pedido

## Reclamos
### 10. Como usuario quiero registrar un reclamo para reportar problemas con mi pedido (HU20)
#### Criterios de aceptación
* Si el usuario completa el formulario de registro de un reclamo, el sistema debe mostrar un mensaje de confirmación
* Si el usuario no completa el formulario de registro de un reclamo, el sistema debe mostrar un mensaje de error
