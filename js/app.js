import { api } from "./api.js";

const aviso = document.getElementById("aviso");
const tabla = document.getElementById("tabla-usuarios");
const formulario = document.getElementById("form-usuario");

function esc(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function mostrarAviso(mensaje, tipo = "danger") {
    aviso.innerHTML = `<div class="alert alert-${tipo}">${esc(mensaje)}</div>`;
    setTimeout(() => (aviso.innerHTML = ""), 5000);
}

function mensajeDe(error) {
    return error instanceof TypeError
        ? "No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?"
        : error.message;
}

async function cargarUsuarios() {
    try {
        const usuarios = await api.listarUsuarios();
        tabla.innerHTML = usuarios
            .map(
                (u) => `
      <tr>
        <td>${u.id}</td>
        <td>${esc(u.nombre)}</td>
        <td>${esc(u.correo)}</td>
        <td>${esc(u.perfil?.ciudad)}</td>
        <td class="text-end">
          <button class="btn btn-outline-danger btn-sm" data-eliminar="${u.id}">Eliminar</button>
        </td>
      </tr>`
            )
            .join("");
    } catch (error) {
        mostrarAviso(mensajeDe(error));
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    const usuario = {
        nombre: datos.get("nombre"),
        correo: datos.get("correo"),
        perfil: { telefono: datos.get("telefono"), ciudad: datos.get("ciudad") },
    };
    try {
        await api.crearUsuario(usuario);
        formulario.reset();
        mostrarAviso("Usuario creado", "success");
        cargarUsuarios();
    } catch (error) {
        mostrarAviso(mensajeDe(error));
    }
});

tabla.addEventListener("click", async (evento) => {
    const id = evento.target.dataset.eliminar;
    if (!id) return;
    try {
        await api.eliminarUsuario(id);
        mostrarAviso("Usuario eliminado", "success");
        cargarUsuarios();
    } catch (error) {
        mostrarAviso(mensajeDe(error));
    }
});

cargarUsuarios();