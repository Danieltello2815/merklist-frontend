import { API_URL } from "./config.js";

async function pedir(ruta, opciones = {}) {
    const config = { ...opciones };
    if (opciones.body) {
        config.headers = { "Content-Type": "application/json" };
    }

    const respuesta = await fetch(`${API_URL}${ruta}`, config);

    if (!respuesta.ok) {
        let mensaje = `Error ${respuesta.status}`;
        try {
            const cuerpo = await respuesta.json();
            if (cuerpo.mensaje) mensaje = cuerpo.mensaje;
        } catch (e) {
            // la respuesta no trae cuerpo
        }
        throw new Error(mensaje);
    }

    return respuesta.status === 204 ? null : respuesta.json();
}

const enviar = (metodo, datos) => ({ method: metodo, body: JSON.stringify(datos) });

export const api = {

    listarTipos: () => pedir("/tipos-producto"),
    crearTipo: (tipo) => pedir("/tipos-producto", enviar("POST", tipo)),
    eliminarTipo: (id) => pedir(`/tipos-producto/${id}`, { method: "DELETE" }),
    crearProducto: (producto) => pedir("/productos", enviar("POST", producto)),
    eliminarProducto: (id) => pedir(`/productos/${id}`, { method: "DELETE" }),
    // usuarios
    listarUsuarios: () => pedir("/usuarios"),
    obtenerUsuario: (id) => pedir(`/usuarios/${id}`),
    crearUsuario: (usuario) => pedir("/usuarios", enviar("POST", usuario)),
    eliminarUsuario: (id) => pedir(`/usuarios/${id}`, { method: "DELETE" }),

    // listas e ítems
    listarListas: (usuarioId) => pedir(`/usuarios/${usuarioId}/listas`),
    crearLista: (usuarioId, lista) => pedir(`/usuarios/${usuarioId}/listas`, enviar("POST", lista)),
    obtenerLista: (id) => pedir(`/listas/${id}`),
    eliminarLista: (id) => pedir(`/listas/${id}`, { method: "DELETE" }),
    agregarItem: (listaId, item) => pedir(`/listas/${listaId}/items`, enviar("POST", item)),
    marcarComprado: (listaId, itemId, compra) =>
        pedir(`/listas/${listaId}/items/${itemId}/comprado`, enviar("PUT", compra)),
    eliminarItem: (listaId, itemId) => pedir(`/listas/${listaId}/items/${itemId}`, { method: "DELETE" }),

    // productos y precios
    listarProductos: () => pedir("/productos"),
    variacionPrecio: (productoId) => pedir(`/registros-compra/variacion-precio/producto/${productoId}`),
    historialProducto: (productoId) => pedir(`/registros-compra/producto/${productoId}`),
};