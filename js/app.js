import { mostrarUsuarios } from "./vistas/usuarios.js";
import { mostrarListas } from "./vistas/listas.js";
import { mostrarLista } from "./vistas/lista.js";
import { mostrarAviso, mensajeDe } from "./util.js";
import { mostrarProductos } from "./vistas/productos.js";
import { mostrarHistorial } from "./vistas/historial.js";

const contenido = document.getElementById("contenido");

async function navegar() {
    const partes = location.hash.replace(/^#\/?/, "").split("/");
    try {
        if (partes[0] === "usuarios" && partes[2] === "listas") {
            await mostrarListas(contenido, Number(partes[1]));
        } else if (partes[0] === "listas" && partes[1]) {
            await mostrarLista(contenido, Number(partes[1]));
        } else if (partes[0] === "productos") {
            await mostrarProductos(contenido);
        } else if (partes[0] === "historial") {
            await mostrarHistorial(contenido);
        } else {
            await mostrarUsuarios(contenido);
        }
    } catch (error) {
        mostrarAviso(mensajeDe(error));
    }
}

window.addEventListener("hashchange", navegar);
navegar();