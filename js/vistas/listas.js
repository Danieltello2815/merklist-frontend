import { api } from "../api.js";
import { esc, mostrarAviso, mensajeDe } from "../util.js";

export async function mostrarListas(contenido, usuarioId) {
    const usuario = await api.obtenerUsuario(usuarioId);

    contenido.innerHTML = `
    <a href="#/usuarios" class="btn btn-link px-0">&larr; Volver a usuarios</a>
    <h2 class="h4 mb-3">Listas de ${esc(usuario.nombre)}</h2>

    <form id="form-lista" class="card card-body mb-4">
      <div class="row g-2">
        <div class="col-md-9">
          <input name="nombre" class="form-control" placeholder="Nombre de la lista (ej. Mercado de la semana)" required>
        </div>
        <div class="col-md-3 d-grid"><button class="btn btn-success">Crear lista</button></div>
      </div>
    </form>

    <div id="listas" class="row g-3"></div>`;

    const contenedor = contenido.querySelector("#listas");
    const formulario = contenido.querySelector("#form-lista");

    async function cargar() {
        try {
            const listas = await api.listarListas(usuarioId);
            if (listas.length === 0) {
                contenedor.innerHTML = `<p class="text-muted">Este usuario todavía no tiene listas.</p>`;
                return;
            }
            contenedor.innerHTML = listas
                .map((l) => {
                    const comprados = l.items.filter((i) => i.estado === "COMPRADO").length;
                    return `
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${esc(l.nombre)}</h5>
                <p class="text-muted mb-1">Creada el ${esc(l.fechaCreacion)}</p>
                <p class="mb-3">${l.items.length} ítem(s), ${comprados} comprado(s)</p>
                <a class="btn btn-success btn-sm" href="#/listas/${l.id}">Abrir</a>
                <button class="btn btn-outline-danger btn-sm" data-eliminar="${l.id}">Eliminar</button>
              </div>
            </div>
          </div>`;
                })
                .join("");
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    }

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const nombre = new FormData(formulario).get("nombre");
        try {
            await api.crearLista(usuarioId, { nombre });
            formulario.reset();
            mostrarAviso("Lista creada", "success");
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    contenedor.addEventListener("click", async (evento) => {
        const id = evento.target.dataset.eliminar;
        if (!id) return;
        try {
            await api.eliminarLista(id);
            mostrarAviso("Lista eliminada", "success");
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    await cargar();
}