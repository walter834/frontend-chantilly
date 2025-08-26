# Documentación del Proyecto Frontend-Chantilly

## Índice

1. [Introducción](#introducción)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
5. [Rutas y Páginas](#rutas-y-páginas)
6. [Componentes](#componentes)
7. [Estado Global](#estado-global)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Servicios](#servicios)
10. [Flujos Principales](#flujos-principales)
11. [Guía de Instalación y Ejecución](#guía-de-instalación-y-ejecución)

## Introducción

Frontend-Chantilly es una aplicación web desarrollada con Next.js que sirve como tienda en línea para productos de repostería y pastelería. La aplicación permite a los usuarios navegar por categorías de productos, ver detalles, agregar productos al carrito, realizar pedidos y gestionar su cuenta de usuario.

## Estructura del Proyecto

El proyecto sigue la estructura estándar de Next.js con App Router, organizado de la siguiente manera:

```
frontend-chantilly/
├── app/                  # Rutas y páginas de la aplicación
├── components/           # Componentes reutilizables
├── contexts/             # Contextos de React
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
├── service/              # Servicios para comunicación con APIs
├── store/                # Estado global con Redux
├── types/                # Definiciones de tipos TypeScript
└── utils/                # Funciones de utilidad
```

## Tecnologías Utilizadas

- **Next.js 15.4.5**: Framework de React para renderizado del lado del servidor y generación de sitios estáticos.
- **React 19.1.0**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript que añade tipado estático.
- **Redux Toolkit**: Para gestión del estado global.
- **Redux Persist**: Para persistencia del estado en localStorage.
- **Tailwind CSS**: Framework de CSS para diseño rápido y responsivo.
- **React Hook Form**: Para manejo de formularios.
- **Zod**: Para validación de esquemas.
- **Axios**: Cliente HTTP para realizar peticiones a APIs.
- **SWR**: Para estrategias de caché y revalidación de datos.
- **Swiper**: Para carruseles y sliders.

## Arquitectura de la Aplicación

La aplicación sigue una arquitectura basada en componentes con las siguientes capas:

1. **Capa de Presentación**: Componentes de UI y páginas.
2. **Capa de Estado**: Gestión de estado global con Redux y estado local con hooks.
3. **Capa de Servicios**: Comunicación con APIs externas.
4. **Capa de Utilidades**: Funciones auxiliares y helpers.

## Rutas y Páginas

La aplicación utiliza el sistema de App Router de Next.js para definir las rutas:

- **/** - Página principal
- **/c/[category]** - Página de categoría de productos
- **/detalle/[id]** - Página de detalle de producto
- **/checkout** - Proceso de pago
- **/checkout/payconfirmation** - Confirmación de pago
- **/contacto** - Página de contacto
- **/my-orders** - Historial de pedidos del usuario
- **/profile** - Perfil de usuario
- **/dashboard** - Panel de control (posiblemente para administradores)
- **/auth/callback** - Callback para autenticación de terceros
- **(auth)/forgot-password** - Recuperación de contraseña
- **(auth)/reset-password** - Restablecimiento de contraseña
- **/politicas-privacidad** - Políticas de privacidad
- **/terminos-condiciones** - Términos y condiciones

## Componentes

Los componentes están organizados en varias categorías:

### Componentes de Autenticación
- **LoginForm**: Formulario de inicio de sesión
- **RegisterForm**: Formulario de registro
- **AuthCallbackHandler**: Manejo de callbacks de autenticación

### Componentes de Layout
- **LayoutShell**: Estructura principal de la aplicación
- **Header**: Cabecera con navegación
- **Footer**: Pie de página
- **Navbar**: Barra de navegación

### Componentes de Características
- **HeroBanner**: Banner principal rotativo
- **ProductCard**: Tarjeta de producto
- **ProductDetail**: Detalle completo de producto
- **ProductGrid**: Cuadrícula de productos
- **CategoryPage**: Página de categoría
- **SubcategoryPage**: Página de subcategoría
- **ThematicCakes**: Sección de tortas temáticas
- **ThemedProductsSection**: Sección de productos temáticos

### Componentes de Carrito y Checkout
- **Shopping**: Componente de carrito de compras
- **ShoppingList**: Lista de productos en el carrito
- **formCart**: Formulario de carrito

### Componentes de UI
- **Button**: Botones estilizados
- **Card**: Tarjetas para contenido
- **Input**: Campos de entrada
- **Alert**: Alertas y notificaciones
- **Dialog**: Ventanas modales
- **Spinner**: Indicador de carga
- **Pagination**: Paginación

### Otros Componentes
- **Chatbot**: Asistente virtual para ayuda al cliente
- **CustomOrders**: Gestión de pedidos personalizados
- **LoadingSkeleton**: Esqueletos de carga para UI
- **UserDrop**: Menú desplegable de usuario

## Estado Global

La aplicación utiliza Redux Toolkit para la gestión del estado global, con los siguientes slices:

- **authSlice**: Gestión de autenticación y datos de usuario
- **localSlice**: Gestión de ubicación y preferencias locales
- **chatbotSlice**: Estado del chatbot

Se utiliza Redux Persist para mantener ciertos estados entre sesiones, como la autenticación del usuario, mensajes del chatbot y ubicación seleccionada.

## Hooks Personalizados

La aplicación incluye varios hooks personalizados para encapsular lógica reutilizable:

- **useAuth**: Gestión de autenticación
- **useCart**: Gestión del carrito de compras
- **useChatbot**: Funcionalidad del chatbot
- **useGoogleAuth**: Autenticación con Google
- **useBreakpointer**: Detección de puntos de quiebre responsivos
- **useCustomerOrders**: Gestión de pedidos del cliente
- **useSessionData**: Datos de sesión del usuario
- **useUbigeo**: Gestión de ubicaciones geográficas (Perú)

## Servicios

Los servicios manejan la comunicación con APIs externas:

- **api.ts**: Configuración base de Axios con interceptores
- **authService**: Servicios de autenticación
- **chatbotService**: Servicios para el chatbot
- **customerService**: Servicios relacionados con clientes
- **localService**: Servicios de ubicación
- **orderService**: Servicios de pedidos
- **productService**: Servicios de productos
- **themeService**: Servicios de temas
- **passwordRecoveryService**: Servicios de recuperación de contraseña
- **ubigeoServices**: Servicios de ubicaciones geográficas

## Flujos Principales

### Flujo de Autenticación

1. El usuario accede al formulario de login o registro
2. Ingresa sus credenciales o datos de registro
3. Se validan los datos con Zod
4. Se envía la petición al servidor mediante authService
5. Se almacena el token y datos del usuario en Redux
6. Se redirige al usuario a la página principal o a la que intentaba acceder

### Flujo de Compra

1. El usuario navega por categorías y productos
2. Agrega productos al carrito mediante useCart
3. Revisa el carrito y ajusta cantidades si es necesario
4. Procede al checkout
5. Completa información de envío y pago
6. Confirma la orden
7. Recibe confirmación de pago y detalles del pedido

## Guía de Instalación y Ejecución

### Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio
   ```bash
   git clone <url-del-repositorio>
   cd frontend-chantilly
   ```

2. Instalar dependencias
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configurar variables de entorno
   - Crear un archivo `.env.local` basado en el ejemplo proporcionado
   - Configurar las URLs de API y otras variables necesarias

### Ejecución

#### Desarrollo

```bash
npm run dev
# o
yarn dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:3000`.

#### Producción

```bash
npm run build
npm run start
# o
yarn build
yarn start
```

### Linting

```bash
npm run lint
# o
yarn lint
```