// Obtener datos del usuario activo
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

// Mostrar los datos del usuario en el portal
if (usuarioActivo) {
    const deudaUsuario = parseFloat(usuarioActivo.deuda);
    const gananciasUsuario = parseFloat(usuarioActivo.ganancias);

    document.getElementById('nombre-usuario').textContent = usuarioActivo.nombre;
    document.getElementById('deuda-usuario').textContent = deudaUsuario.toFixed(2);
    document.getElementById('ganancias-usuario').textContent = gananciasUsuario.toFixed(2);

    // Seleccionar los elementos del DOM para la deuda y las ganancias
    const deudaElement = document.getElementById('deuda-usuario');
    const gananciasElement = document.getElementById('ganancias-usuario');

    // Comprobación si la deuda es mayor que las ganancias o viceversa
    if (deudaUsuario > gananciasUsuario) {
        deudaElement.classList.add('red');
        gananciasElement.classList.add('red');

        // Añadir una advertencia si la deuda es mayor que las ganancias
        const warning = document.createElement('p');
        warning.textContent = 'Advertencia: La deuda es mayor que las ganancias. ¡Toma acción ahora!';
        warning.classList.add('warning');
        document.querySelector('.portal-content').appendChild(warning);

    } else {
        deudaElement.classList.add('green');
        gananciasElement.classList.add('green');
    }

} else {
    // Si no hay usuario activo, redirigir a la página de inicio
    window.location.href = "index.html";
}
