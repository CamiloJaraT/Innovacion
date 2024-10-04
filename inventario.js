document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('agregar-producto-form');
    const inventarioBody = document.getElementById('inventario-body');
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Cargar productos existentes
    cargarProductos();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const cantidad = document.getElementById('cantidad').value;
        const precio = document.getElementById('precio').value;

        const nuevoProducto = {
            id: Date.now(), // Usamos la fecha actual como ID único
            nombre: nombre,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio)
        };

        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));

        agregarProductoATabla(nuevoProducto);

        // Limpiar el formulario
        form.reset();
    });

    function cargarProductos() {
        productos.forEach(producto => agregarProductoATabla(producto));
    }

    function agregarProductoATabla(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <button onclick="editarProducto(${producto.id})">Editar</button>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        inventarioBody.appendChild(row);
    }

    // Estas funciones se implementarán más adelante
    window.editarProducto = function(id) {
        console.log('Editar producto', id);
        // Implementar la lógica de edición
    }

    window.eliminarProducto = function(id) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        // Recargar la tabla
        inventarioBody.innerHTML = '';
        cargarProductos();
    }
});