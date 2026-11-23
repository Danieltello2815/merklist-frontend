import { api } from "../api.js";
import { esc, mostrarAviso, mensajeDe } from "../util.js";

export async function mostrarLista(contenido, listaId) {
    const [lista, productos] = await Promise.all([api.obtenerLista(listaId), api.listarProductos()]);
    const nombres = Object.fromEntries(productos.map((p) => [p.id, `${p.nombre} (${p.marca ?? "sin marca"})`]));

    contenido.innerHTML = `
    <a href="#/usuarios" class="btn btn-link px-0">&larr; Volver a usuarios</a>
    <h2 class="h4">${esc(lista.nombre)}</h2>
    <p class="text-muted">Creada el ${esc(lista.fechaCreacion)}</p>

    <form id="form-item" class="card card-body mb-4">
      <div class="row g-2">
        <div class="col-md-6">
          <select name="productoId" class="form-select" required>
            <option value="">Elige un producto</option>
            ${productos.map((p) => `<option value="${p.id}">${esc(p.nombre)} (${esc(p.marca ?? "sin marca")})</option>`).join("")}
          </select>
        </div>
        <div class="col-md-3"><input name="cantidad" type="number" min="1" value="1" class="form-control" required></div>
        <div class="col-md-3 d-grid"><button class="btn btn-success">Agregar a la lista</button></div>
      </div>
    </form>

    <table class="table bg-white align-middle">
      <thead><tr><th>Producto</th><th>Cantidad</th><th>Estado</th><th></th></tr></thead>
      <tbody id="tabla-items">
        ${
        lista.items.length === 0
            ? `<tr><td colspan="4" class="text-muted">La lista está vacía.</td></tr>`
            : lista.items
                .map(
                    (i) => `
          <tr>
            <td>${esc(nombres[i.productoId] ?? "Producto " + i.productoId)}</td>
            <td>${i.cantidad}</td>
            <td><span class="badge ${i.estado === "COMPRADO" ? "bg-success" : "bg-warning text-dark"}">${i.estado}</span></td>
            <td class="text-end">
              ${i.estado === "PENDIENTE" ? `<button class="btn btn-success btn-sm" data-comprar="${i.id}">Comprado</button>` : ""}
              <button class="btn btn-outline-danger btn-sm" data-quitar="${i.id}">Quitar</button>
            </td>
          </tr>`
                )
                .join("")
    }
      </tbody>
    </table>

    <dialog id="dialogo-comprado" class="border rounded p-4">
      <form id="form-comprado">
        <h5 class="mb-3">Marcar como comprado</h5>
        <input name="precio" type="number" min="1" step="any" class="form-control mb-2" placeholder="Precio pagado" required>
        <input name="lugarCompra" class="form-control mb-3" placeholder="Lugar de compra">
        <div class="d-flex gap-2 justify-content-end">
          <button type="button" id="cancelar" class="btn btn-outline-secondary">Cancelar</button>
          <button class="btn btn-success">Guardar compra</button>
        </div>
      </form>
    </dialog>`;

    const formItem = contenido.querySelector("#form-item");
    const tabla = contenido.querySelector("#tabla-items");
    const dialogo = contenido.querySelector("#dialogo-comprado");
    const formComprado = contenido.querySelector("#form-comprado");
    let itemSeleccionado = null;

    formItem.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const datos = new FormData(formItem);
        try {
            await api.agregarItem(listaId, {
                productoId: Number(datos.get("productoId")),
                cantidad: Number(datos.get("cantidad")),
            });
            mostrarAviso("Producto agregado a la lista", "success");
            await mostrarLista(contenido, listaId);
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });

    tabla.addEventListener("click", async (evento) => {
        const comprar = evento.target.dataset.comprar;
        const quitar = evento.target.dataset.quitar;

        if (comprar) {
            itemSeleccionado = lista.items.find((i) => String(i.id) === comprar);
            formComprado.reset();
            dialogo.showModal();
        }

        if (quitar) {
            try {
                await api.eliminarItem(listaId, quitar);
                mostrarAviso("Ítem quitado de la lista", "success");
                await mostrarLista(contenido, listaId);
            } catch (error) {
                mostrarAviso(mensajeDe(error));
            }
        }
    });

    contenido.querySelector("#cancelar").addEventListener("click", () => dialogo.close());

    formComprado.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const datos = new FormData(formComprado);
        try {
            await api.marcarComprado(listaId, itemSeleccionado.id, {
                precio: Number(datos.get("precio")),
                lugarCompra: datos.get("lugarCompra"),
            });
            dialogo.close();
            const variacion = await api.variacionPrecio(itemSeleccionado.productoId);
            mostrarAviso(`Compra registrada. ${variacion.mensaje}`, "success");
            await mostrarLista(contenido, listaId);
        } catch (error) {
            dialogo.close();
            mostrarAviso(mensajeDe(error));
        }
    });
}