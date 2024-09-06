// Obtener elementos del DOM
const modal = document.getElementById("registro-modal");
const openBtn = document.getElementById("comenzar-btn");
const closeBtn = document.querySelector(".close-btn");

// Abrir el modal cuando se haga clic en el botón "Comenzar Ahora"
openBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Previene la recarga de la página
    modal.style.display = "block"; // Muestra el modal
});

// Cerrar el modal cuando se haga clic en el botón "x"
closeBtn.addEventListener("click", function() {
    modal.style.display = "none"; // Oculta el modal
});

// Cerrar el modal cuando se haga clic fuera del contenido del modal
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Oculta el modal si se hace clic fuera de él
    }
});

// Función para crear 10 usuarios de prueba en el localStorage
function crearUsuariosPrueba() {
    const usuarios = [
        { nombre: "Usuario1", email: "usuario1@example.com", password: "12345", deuda: 1000, ganancias: 500 },
        { nombre: "Usuario2", email: "usuario2@example.com", password: "12345", deuda: 2000, ganancias: 1000 },
        { nombre: "Usuario3", email: "usuario3@example.com", password: "12345", deuda: 1500, ganancias: 1200 },
        { nombre: "Usuario4", email: "usuario4@example.com", password: "12345", deuda: 500, ganancias: 800 },
        { nombre: "Usuario5", email: "usuario5@example.com", password: "12345", deuda: 2500, ganancias: 3000 },
        { nombre: "Usuario6", email: "usuario6@example.com", password: "12345", deuda: 0, ganancias: 2000 },
        { nombre: "Usuario7", email: "usuario7@example.com", password: "12345", deuda: 1800, ganancias: 1100 },
        { nombre: "Usuario8", email: "usuario8@example.com", password: "12345", deuda: 900, ganancias: 700 },
        { nombre: "Usuario9", email: "usuario9@example.com", password: "12345", deuda: 0, ganancias: 4000 },
        { nombre: "Usuario10", email: "usuario10@example.com", password: "12345", deuda: 1000, ganancias: 5000 }
    ];

    // Guardar los usuarios en localStorage si no han sido creados aún
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log("Usuarios de prueba creados");
    }
}

// Ejecutar la función al cargar la página
crearUsuariosPrueba();
// Obtener elementos del DOM
const loginForm = document.getElementById("login-form");

// Verificar credenciales y redirigir al portal
loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Previene el envío del formulario

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios'));

    // Buscar al usuario en el almacenamiento local
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
        // Guardar el usuario activo en localStorage
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));

        // Redirigir al portal
        window.location.href = "portal.html";
    } else {
        alert("Correo o contraseña incorrectos.");
    }
});
