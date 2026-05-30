# Planning Document

# 1. Visión y Alcance del Producto
Pawify es una plataforma de comercio electrónico móvil enfocada en productos para mascotas. Resuelve la necesidad de los dueños de mascotas de encontrar y comprar alimentos, accesorios y productos de cuidado en un solo lugar, con una experiencia simple, rápida y adaptada a dispositivos móviles.
El público objetivo de Pawify se compone de dueños de mascotas que priorizan la comodidad de comprar desde sus dispositivos móviles. Este perfil abarca a usuarios recurrentes que demandan herramientas de fidelización esenciales, como un carrito de compras interactivo, historial de transacciones y seguimiento de pedidos. Asimismo, incluye a compradores que valoran una navegación ágil y eficiente, fundamentada en una estructura clara de categorías y un sistema de filtrado avanzado para optimizar su decisión de compra.
## Alcance
- Registro e inicio de sesión (con recuperación de contraseña).
- Catálogo de productos con búsqueda, filtros (categoría, subcategoría, marca, precio) y ordenamiento.
- Carrito de compras.
- Flujo de checkout: selección de dirección y tarjeta, creación de orden.
- Valoraciones y reseñas de productos.
- Perfil de usuario comprador.
- Panel de administración para gestión de productos, categorías, marcas y órdenes.

# 2. Organización del Equipo
El desarrollo del proyecto se ejecutará bajo el marco de trabajo ágil Scrum, distribuyendo las responsabilidades de la siguiente manera:
- **Product Owner** (Gerardo Ladera): Es el responsable de maximizar el valor comercial de Pawify y el representante directo de las necesidades del usuario. Su rol se centrará en definir la visión del negocio, gestionar y priorizar el Product Backlog, y asegurar que las funcionalidades clave (como el catálogo inteligente y el checkout) se desarrollen en el orden correcto para el éxito del e-commerce.
- **Scrum Master** (Brayan Alquizar Flores): Actuará como el facilitador del marco ágil y el protector del proceso de desarrollo. Su objetivo principal será asegurar el cumplimiento de las ceremonias Scrum (como las dailies y las retrospectivas), eliminar activamente cualquier impedimento técnico o de comunicación que bloquee al equipo y optimizar el ritmo de trabajo durante cada Sprint.
- **Scrum Team** (Monica Chambi, Gerardo Paz y Deyvi Gomez): Un equipo multidisciplinario, técnico y autoorganizado. Serán los encargados de transformar las ideas del backlog en software totalmente funcional. Sus responsabilidades compartidas abarcan desde la arquitectura de la base de datos y la programación de la lógica del e-commerce, hasta el diseño visual de la interfaz móvil y el desarrollo del panel de administración.


# 3. Arquitectura y Stack Tecnológico
## Stack tecnológico
- React
- React Native
- Springboot
- PostgreSQL

## Backend: Arquitectura en capas
### - Controllers
- `controllers/`: solo expone endpoints HTTP y WS. Recibe DTOs de entrada validados con @Valid, delega al Service y retorna los DTOs de salida envueltos en ResponseEntity.
### - Services
- `services/`: contiene únicamente las interfaces públicas que definen el contrato del dominio sin exponer la implementación.
- `services/implements/`: contiene las implementaciones: validaciones de dominio, orquestación entre repositorios, reglas de negocio.
### - Repositories
- `repositories/`: extienden de JPA, que proporciona CRUD completo sin implementación manual.
- `repositories/custom/`: contiene implementaciones manuales para casos que JPA no resuelve de forma simple: paginación por keyset (scroll infinito).
### - Models
- `models/`: Representa las entidades del negocio con su mapeo JPA a tablas de la base de datos.

## Frontend: Arquitectura de capas
### - Capa de presentación
- `screens/`: Contiene las pantallas completas de la aplicación
- `components/`: Aloja los componentes visuales reutilizables e individuales que se usan dentro de las pantallas.
- `theme/`: Define los estilos globales, colores, fuentes o configuraciones de diseño de la app.
### - Capa de lógica de negocio y estado
- `context/`: Maneja el estado global de la aplicación utilizando la Context API de React.
- `hooks/`: Contiene React Hooks personalizados para encapsular lógica reutilizable y mantener los componentes limpios de código pesado.
### - Capa de datos
- `services/`: Se encarga de la comunicación con el exterior. Aquí están las llamadas al backend.
- `config/`: Contiene configuraciones del entorno o constantes del sistema
### - Soporte y utilidades
- `utils/`: Funciones auxiliares genéricas (formateadores de fechas, validadores de texto, etc.).
- `types/`: Centraliza las definiciones de tipos e interfaces de TypeScript para mantener el tipado fuerte en todo el proyecto.

