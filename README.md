¿# Merklist — Frontend

## Descripción

Merklist es una aplicación web para la gestión de listas de mercado compartidas, que permite organizar productos, administrar listas de compras y consultar el historial de precios.

El frontend proporciona una interfaz gráfica que permite al usuario interactuar con las funcionalidades del sistema mediante la API REST del backend.

## Tecnologías utilizadas

- HTML5.
- CSS3.
- JavaScript con módulos ES.
- Bootstrap mediante CDN.
- API REST.
- Git y GitHub.

## Funcionalidades

- Gestión de usuarios.
- Gestión de listas de mercado.
- Administración de los elementos de cada lista.
- Registro del estado de los productos (pendiente o comprado).
- Gestión de productos y tipos de producto.
- Consulta del historial de precios.

## Estructura del proyecto

```text
merklist-frontend/
├── css/
│   └── estilos.css
├── js/
│   ├── vistas/
│   ├── api.js
│   ├── app.js
│   ├── config.js
│   └── util.js
├── .gitignore
├── index.html
└── README.md
```

| Archivo o directorio | Descripción |
|---|---|
| index.html | Página principal de la aplicación. |
| css/ | Estilos de la interfaz. |
| js/vistas/ | Vistas de las diferentes pantallas. |
| api.js | Comunicación con la API del backend. |
| app.js | Gestión de la navegación entre pantallas. |
| config.js | Configuración de la URL de la API. |
| util.js | Funciones auxiliares. |

## Comunicación con el backend

El frontend consume los servicios de la API REST de Merklist para consultar y gestionar la información del sistema.

La dirección de la API se configura en el archivo `js/config.js`.

Repositorio del backend:

https://github.com/Danieltello2815/merklist

## Ejecución

1. Iniciar el backend de Merklist.
2. Abrir el archivo `index.html` desde IntelliJ IDEA mediante la opción Open in Browser o utilizar Live Server.
3. Utilizar el puerto 63342 de IntelliJ o el puerto 5500 de Live Server.

## Autores

- Daniel Tello.
- Laura Moreno.
