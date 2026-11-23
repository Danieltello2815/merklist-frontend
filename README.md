# MerKlist - Frontend

Interfaz web de MerKlist (HTML, CSS, JavaScript con módulos ES y Bootstrap por CDN). Consume la API del backend.

## Requisitos
- Backend corriendo en http://localhost:8080 (ver https://github.com/Danieltello2815/merklist)
- IntelliJ (o cualquier servidor local en el puerto 63342 o 5500)

## Cómo ejecutarlo
1. Arrancar el backend.
2. Abrir `index.html` con IntelliJ (clic derecho → Open in → Browser) o con Live Server en el puerto 5500.
3. La URL de la API se configura en `js/config.js`.

## Pantallas
- Usuarios
- Listas de mercado
- Detalle de lista (ítems y botón "Comprado")
- Productos y tipos de producto
- Historial de precios

## Estructura
- `js/api.js`: llamadas a la API
- `js/app.js`: navegación por `#/ruta`
- `js/vistas/`: una vista por pantalla

## Autores
Daniel Tello y Laura Moreno