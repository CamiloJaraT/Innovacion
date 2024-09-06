// Obtener datos del usuario activo
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

// Mostrar los datos del usuario en el portal
if (usuarioActivo) {
    document.getElementById('nombre-usuario').textContent = usuarioActivo.nombre;
    document.getElementById('deuda-usuario').textContent = usuarioActivo.deuda;
    document.getElementById('ganancias-usuario').textContent = usuarioActivo.ganancias;
} else {
    // Si no hay usuario activo, redirigir a la página de inicio
    window.location.href = "index.html";
}
