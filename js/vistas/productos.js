import { api } from "../api.js";
import { esc, mostrarAviso, mensajeDe } from "../util.js";

export async function mostrarProductos(contenido) {
    contenido.innerHTML = `
    <h2 class="h4 mb-3">Catálogo</h2>

    <div class="row g-4">
      <div class="col-lg-8">
        <h3 class="h5">Productos</h3>
        <form id="form-producto" class="card card-body mb-3">
          <div class="row g-2">
            <div class="col-md-4"><input name="nombre" class="form-control" placeholder="Nombre" required></div>
            <div class="col-md-3"><input name="marca" class="form-control" placeholder="Marca"></div>
            <div class="col-md-3"><select name="tipoProductoId" id="select-tipos" class="form-select" required></select></div>
            <div class="col-md-2 d-grid"><button class="btn btn-success">Agregar</button></div>
          </div>
        </form>
        <table class="table table-hover align-middle bg-white">
          <thead><tr><th>ID</th><th>Producto</th><th>Marca</th><th>Tipo</th><th></th></tr></thead>
          <tbody id="tabla-productos"></tbody>
        </table>
      </div>

      <div class="col-lg-4">
        <h3 class="h5">Tipos de producto</h3>
        <form id="form-tipo" class="card card-body mb-3">
          <div class="input-group">
            <input name="nombre" class="form-control" placeholder="Nuevo tipo (ej. Lácteos)" required>
            <button class="btn btn-success">Crear</button>
          </div>
        </form>
        <ul id="lista-tipos" class="list-group"></ul>
      </div>
    </div>`;

    const formProducto = contenido.querySelector("#form-producto");
    const formTipo = contenido.querySelector("#form-tipo");
    const selectTipos = contenido.querySelector("#select-tipos");
    const tablaProductos = contenido.querySelector("#tabla-productos");
    const listaTipos = contenido.querySelector("#lista-tipos");

    async function cargar() {
        try {
            const [productos, tipos] = await Promise.all([api.listarProductos(), api.listarTipos()]);
            const nombreTipo = Object.fromEntries(tipos.map((t) => [t.id, t.nombre]));

            selectTipos.innerHTML =
                `<option value="">Tipo de producto</option>` +
                tipos.map((t) => `<option value="${t.id}">${esc(t.nombre)}</option>`).join("");

            tablaProductos.innerHTML = productos
                .map(
                    (p) => `
        <tr>
          <td>${p.id}</td>
          <td>${esc(p.nombre)}</td>
          <td>${esc(p.marca)}</td>
          <td>${esc(nombreTipo[p.tipoProductoId] ?? p.tipoProductoId)}</td>
          <td class="text-end">
            <button class="btn btn-outline-danger btn-sm" data-eliminar-producto="${p.id}">Eliminar</button>
          </td>
        </tr>`
                )
                .join("");

            listaTipos.innerHTML = tipos
                .map(
                    (t) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${esc(t.nombre)}
          <button class="btn btn-outline-danger btn-sm" data-eliminar-tipo="${t.id}">Eliminar</button>
        </li>`
                )
                .join("");
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    }

    formProducto.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const datos = new FormData(formProducto);
        try {
            await api.crearProducto({
                nombre: datos.get("nombre"),
                marca: datos.get("marca"),
                tipoProductoId: Number(datos.get("tipoProductoId")),
            });
            formProducto.reset();
            mostrarAviso("Producto creado", "success");
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    formTipo.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        try {
            await api.crearTipo({ nombre: new FormData(formTipo).get("nombre") });
            formTipo.reset();
            mostrarAviso("Tipo de producto creado", "success");
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    tablaProductos.addEventListener("click", async (evento) => {
        const id = evento.target.dataset.eliminarProducto;
        if (!id) return;
        try {
            await api.eliminarProducto(id);
            mostrarAviso("Producto eliminado", "success");
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    listaTipos.addEventListener("click", async (evento) => {
        const id = evento.target.dataset.eliminarTipo;
        if (!id) return;
        try {
            await api.eliminarTipo(id);
            mostrarAviso("Tipo eliminado", "success");
            cargar();
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    await cargar();
}