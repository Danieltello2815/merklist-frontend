import { api } from "../api.js";
import { esc, mostrarAviso, mensajeDe } from "../util.js";

const pesos = (n) =>
    Number(n).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export async function mostrarHistorial(contenido) {
    const productos = await api.listarProductos();

    contenido.innerHTML = `
    <h2 class="h4 mb-3">Historial de precios</h2>
    <div class="card card-body mb-4">
      <select id="select-producto" class="form-select">
        <option value="">Elige un producto</option>
        ${productos
        .map((p) => `<option value="${p.id}">${esc(p.nombre)} (${esc(p.marca ?? "sin marca")})</option>`)
        .join("")}
      </select>
    </div>
    <div id="resultado"></div>`;

    const select = contenido.querySelector("#select-producto");
    const resultado = contenido.querySelector("#resultado");

    select.addEventListener("change", async () => {
        if (!select.value) {
            resultado.innerHTML = "";
            return;
        }
        try {
            const [historial, variacion] = await Promise.all([
                api.historialProducto(select.value),
                api.variacionPrecio(select.value),
            ]);

            if (historial.length === 0) {
                resultado.innerHTML = `<p class="text-muted">Este producto todavía no tiene compras registradas.</p>`;
                return;
            }

            const clase =
                variacion.variacionPrecio > 0 ? "alert-danger" : variacion.variacionPrecio < 0 ? "alert-success" : "alert-secondary";

            const filas = historial
                .map((r, i) => {
                    const anterior = historial[i + 1];
                    let cambio = "";
                    if (anterior) {
                        const dif = r.precio - anterior.precio;
                        if (dif > 0) cambio = `<span class="text-danger">▲ ${pesos(dif)}</span>`;
                        else if (dif < 0) cambio = `<span class="text-success">▼ ${pesos(Math.abs(dif))}</span>`;
                        else cambio = `<span class="text-muted">igual</span>`;
                    }
                    return `<tr>
            <td>${esc(r.fecha)}</td>
            <td>${pesos(r.precio)}</td>
            <td>${esc(r.lugarCompra)}</td>
            <td>${cambio}</td>
          </tr>`;
                })
                .join("");

            resultado.innerHTML = `
        <div class="alert ${clase}">${esc(variacion.mensaje)}</div>
        <table class="table bg-white align-middle">
          <thead><tr><th>Fecha</th><th>Precio</th><th>Lugar</th><th>Cambio</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>`;
        } catch (error) {
            mostrarAviso(mensajeDe(error));
        }
    });
}