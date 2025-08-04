# Chantilly - Frontend

Frontend de la aplicación web de productos artesanales Chantilly, desarrollado con Next.js 15 y TypeScript.

## 🚀 Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **Swiper** - Carousel/Banner
- **React Icons** - Iconos adicionales

## 📁 Estructura del Proyecto

```
frontend-chantilly/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas protegidas
│   ├── (shop)/            # Rutas de la tienda
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── common/            # Componentes reutilizables
│   │   ├── Button/        # Botones
│   │   ├── Card/          # Tarjetas
│   │   └── Modal/         # Modales
│   ├── layout/            # Componentes de estructura
│   │   ├── Header/        # Encabezado
│   │   ├── Footer/        # Pie de página
│   │   └── Sidebar/       # Barra lateral
│   ├── features/          # Componentes específicos
│   │   ├── ProductCard/   # Tarjeta de producto
│   │   ├── ProductGrid/   # Grilla de productos
│   │   ├── HeroBanner/    # Banner principal
│   │   └── ShoppingCart/  # Carrito de compras
│   └── ui/                # Componentes de UI base
├── hooks/                 # Custom hooks
│   └── useCart.ts         # Hook del carrito
├── lib/                   # Utilidades
│   └── utils.ts           # Funciones utilitarias
├── types/                 # Definiciones TypeScript
│   └── index.ts           # Interfaces y tipos
└── public/                # Archivos estáticos
    └── images/            # Imágenes organizadas
```

## 🎯 Características

- ✅ **Arquitectura modular** - Componentes organizados por funcionalidad
- ✅ **TypeScript** - Tipado estático para mejor desarrollo
- ✅ **Responsive Design** - Diseño adaptativo
- ✅ **Componentes reutilizables** - Sistema de componentes escalable
- ✅ **Custom Hooks** - Lógica reutilizable
- ✅ **SEO optimizado** - Metadatos y estructura semántica

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd frontend-chantilly
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con Turbopack
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 🎨 Componentes Principales

### Layout Components
- **Header** - Navegación principal con carrito y búsqueda
- **Footer** - Información de contacto y enlaces

### Feature Components
- **ProductCard** - Tarjeta individual de producto
- **ProductGrid** - Grilla de productos con loading states
- **HeroBanner** - Banner principal con carousel
- **ShoppingCart** - Carrito de compras

### Common Components
- **Button** - Botones con diferentes variantes
- **Card** - Tarjetas reutilizables
- **Modal** - Modales y overlays

## 🔧 Custom Hooks

- **useCart** - Gestión del carrito de compras con localStorage

## 📱 Responsive Design

El proyecto está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1280px+)

## 🚀 Próximas Características

- [ ] Autenticación de usuarios
- [ ] Filtros de productos
- [ ] Búsqueda avanzada
- [ ] Wishlist/Favoritos
- [ ] Reviews y calificaciones
- [ ] Checkout y pagos
- [ ] Panel de administración

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo Frontend** - Chantilly Team
- **Backend** - Laravel (en desarrollo)
