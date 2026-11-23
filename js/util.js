export function esc(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

export function mostrarAviso(mensaje, tipo = "danger") {
    const aviso = document.getElementById("aviso");
    aviso.innerHTML = `<div class="alert alert-${tipo}">${esc(mensaje)}</div>`;
    setTimeout(() => (aviso.innerHTML = ""), 6000);
}

export function mensajeDe(error) {
    return error instanceof TypeError
        ? "No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?"
        : error.message;
}