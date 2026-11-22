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

export const api = {
    listarUsuarios: () => pedir("/usuarios"),
    crearUsuario: (usuario) =>
        pedir("/usuarios", { method: "POST", body: JSON.stringify(usuario) }),
    eliminarUsuario: (id) => pedir(`/usuarios/${id}`, { method: "DELETE" }),
};