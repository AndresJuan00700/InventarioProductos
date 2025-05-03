# 🧪 Prueba Técnica Front-End – React.js / Next.js

Este proyecto corresponde a la prueba técnica dividida en dos etapas: la **prueba básica** y la **prueba complementaria**. Ambas se desarrollaron utilizando **React.js** y siguen buenas prácticas de desarrollo con enfoque en componentes reutilizables, manejo de estado y diseño responsive.

---

## 🚀 Demo en vivo
[Enlace al despliegue en Vercel/Netlify] <!-- (opcional, agrega si lo tienes) -->


## 🧾 Instalación y ejecución

 Clona el repositorio:


git clone 

Ingresa a la carpeta del proyecto:

bash
Copiar
Editar
cd nombre-repo
Instala las dependencias:


npm install
Inicia el servidor de desarrollo:


npm run dev




## 📦 Tecnologías principales

- React.js
- Zustand (para manejo de estado)
- TailwindCSS (para estilos)
- TypeScript (opcional)
- LocalStorage (persistencia de datos)

---

## 1️⃣ Prueba Básica – CRUD de Productos

### 🎯 Objetivo

Crear una aplicación que permita al usuario **crear**, **listar**, **eliminar**, **ordenar** y **filtrar** productos.

### 🛠 Funcionalidades

- Crear producto con:
  - Código (number)
  - Nombre (string)
  - Descripción (string)
  - Cantidad (number)
  - Fecha de creación (autogenerada)
- Visualización de productos en lista
- Eliminar productos
- Ordenar por código, nombre, cantidad o fecha
- Filtro por nombre con un input
- Persistencia con LocalStorage
- Responsive y accesible





### ⚙️ Características del Carrusel

- Muestra entre 1 y 4 productos según el ancho de pantalla
- Soporte para navegación con botones, drag con mouse y scroll táctil
- (Opcional) Auto-scroll configurable
- Cada tarjeta permite agregar productos al carrito con respuesta visual
- Props personalizables:
  - Lista de productos
  - Cantidad visible
  - Auto-play y velocidad
- Accesibilidad con roles ARIA y navegación por teclado
- Componente hecho 100% a mano sin librerías externas (Swiper, etc.)
- Implementado con Flexbox o CSS Grid

---



