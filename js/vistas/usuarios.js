import { api } from "../api.js";
import { esc, mostrarAviso, mensajeDe } from "../util.js";

export async function mostrarUsuarios(contenido) {
    contenido.innerHTML = `
    <h2 class="h4 mb-3">Usuarios</h2>

    <form id="form-usuario" class="card card-body mb-4">
      <div class="row g-2">
        <div class="col-md-3"><input name="nombre" class="form-control" placeholder="Nombre" required></div>
        <div class="col-md-3"><input name="correo" type="email" class="form-control" placeholder="Correo" required></div>
        <div class="col-md-2"><input name="telefono" class="form-control" placeholder="Teléfono"></div>
        <div class="col-md-2"><input name="ciudad" class="form-control" placeholder="Ciudad"></div>
        <div class="col-md-2 d-grid"><button class="btn btn-success">Crear usuario</button></div>
      </div>
    </form>

    <table class="table table-hover align-middle bg-white">
      <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Ciudad</th><th></th></tr></thead>
      <tbody id="tabla-usuarios"></tbody>
    </table>`;

    const tabla = contenido.querySelector("#tabla-usuarios");
    const formulario = contenido.querySelector("#form-usuario");

    async function cargar() {
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
            <a class="btn btn-success btn-sm" href="#/usuarios/${u.id}/listas">Ver listas</a>
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
            cargar();
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
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    await cargar();
}