document.addEventListener("DOMContentLoaded", function () {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo')) || { nombre: 'Usuario', ganancias: 0, gastos: 0 };
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

    function getDatosUsuario(tipo) {
        const key = `${tipo}_${usuarioActivo.nombre}`;
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    function saveDatosUsuario(tipo, datos) {
        const key = `${tipo}_${usuarioActivo.nombre}`;
        localStorage.setItem(key, JSON.stringify(datos));
    }

    function calcularTotales() {
        const facturas = getDatosUsuario('facturas');
        const gastos = getDatosUsuario('gastos');
        
        const ganancias = facturas.reduce((total, factura) => total + factura.monto, 0);
        const gastoTotal = gastos.reduce((total, gasto) => total + gasto.monto, 0);
        
        return { ganancias, gastos: gastoTotal };
    }

    function actualizarFinanzas() {
        const { ganancias, gastos } = calcularTotales();
        usuarioActivo.ganancias = ganancias;
        usuarioActivo.gastos = gastos;
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

        const deudaUsuario = gastos - ganancias;

        document.getElementById('deuda-usuario').textContent = deudaUsuario.toFixed(2);
        document.getElementById('ganancias-usuario').textContent = ganancias.toFixed(2);
        document.getElementById('gastos-usuario').textContent = gastos.toFixed(2);

        document.getElementById('advertencia-deuda').style.display = deudaUsuario > 0 ? 'block' : 'none';
    }

    document.getElementById('nombre-usuario').textContent = usuarioActivo.nombre;
    actualizarFinanzas();

    // Manejar facturas
    const facturaForm = document.getElementById('form-factura');
    const facturasTable = document.querySelector("#facturas-table tbody");
    let facturas = getDatosUsuario('facturas');
    let facturaId = facturas.length > 0 ? Math.max(...facturas.map(f => f.id)) + 1 : 1;

    function renderizarFacturas() {
        facturasTable.innerHTML = '';
        facturas.forEach((factura) => {
            const row = facturasTable.insertRow();
            row.innerHTML = `
                <td>${factura.id}</td>
                <td>${factura.cliente}</td>
                <td>$${factura.monto.toFixed(2)}</td>
                <td>${factura.fecha}</td>
                <td><button class="delete-btn" data-tipo="factura" data-id="${factura.id}">Eliminar</button></td>
            `;
        });
    }

    facturaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('nombre-cliente').value;
        const montoFactura = parseFloat(document.getElementById('monto-factura').value);
        const fechaFactura = document.getElementById('fecha-factura').value;

        if (cliente && montoFactura > 0) {
            const nuevaFactura = { id: facturaId++, cliente, monto: montoFactura, fecha: fechaFactura };
            facturas.push(nuevaFactura);
            saveDatosUsuario('facturas', facturas);

            renderizarFacturas();
            facturaForm.reset();
            mostrarModal('La factura ha sido generada con éxito.');
            actualizarFinanzas();
        } else {
            alert('Por favor, ingrese un cliente válido y un monto mayor a 0.');
        }
    });

    renderizarFacturas();

    // Manejar gastos
    const gastoForm = document.getElementById('form-gasto');
    const gastosTable = document.querySelector("#gastos-table tbody");
    let gastos = getDatosUsuario('gastos');
    let gastoId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1;

    function renderizarGastos() {
        gastosTable.innerHTML = '';
        gastos.forEach((gasto) => {
            const row = gastosTable.insertRow();
            row.innerHTML = `
                <td>${gasto.id}</td>
                <td>${gasto.descripcion}</td>
                <td>$${gasto.monto.toFixed(2)}</td>
                <td><button class="delete-btn" data-tipo="gasto" data-id="${gasto.id}">Eliminar</button></td>
            `;
        });
    }

    gastoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const descripcionGasto = document.getElementById('descripcion-gasto').value;
        const montoGasto = parseFloat(document.getElementById('monto-gasto').value);

        if (descripcionGasto && montoGasto > 0) {
            const nuevoGasto = { id: gastoId++, descripcion: descripcionGasto, monto: montoGasto };
            gastos.push(nuevoGasto);
            saveDatosUsuario('gastos', gastos);

            renderizarGastos();
            gastoForm.reset();
            mostrarModal('El gasto ha sido registrado con éxito.');
            actualizarFinanzas();
        } else {
            alert('Por favor, ingrese un monto válido y una descripción.');
        }
    });

    renderizarGastos();

    // Manejar la eliminación de facturas y gastos
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('delete-btn')) {
            const tipo = e.target.getAttribute('data-tipo');
            const id = parseInt(e.target.getAttribute('data-id'));
            confirmarEliminar(tipo, id);
        }
    });

    // Modal para mensajes
    const modal = document.getElementById('modal-confirmacion');
    const mensajeModal = document.getElementById('mensaje-modal');
    const cerrarModalBtn = document.getElementById('cerrar-modal-btn');

    function mostrarModal(mensaje) {
        mensajeModal.textContent = mensaje;
        modal.style.display = 'flex';
    }

    cerrarModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Confirmación de eliminación
    const modalEliminar = document.getElementById('modal-eliminar');
    let idAEliminar = null;
    let tipoAEliminar = null;

    function confirmarEliminar(tipo, id) {
        idAEliminar = id;
        tipoAEliminar = tipo;
        modalEliminar.style.display = 'flex';
    }

    document.getElementById('confirmar-eliminar-btn').addEventListener('click', () => {
        if (tipoAEliminar === 'factura') {
            facturas = facturas.filter(factura => factura.id !== idAEliminar);
            saveDatosUsuario('facturas', facturas);
            renderizarFacturas();
        } else if (tipoAEliminar === 'gasto') {
            gastos = gastos.filter(gasto => gasto.id !== idAEliminar);
            saveDatosUsuario('gastos', gastos);
            renderizarGastos();
        }
        modalEliminar.style.display = 'none';
        mostrarModal('El ítem ha sido eliminado con éxito.');
        actualizarFinanzas();
    });

    document.getElementById('cancelar-eliminar-btn').addEventListener('click', () => {
        modalEliminar.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modalEliminar) {
            modalEliminar.style.display = 'none';
        }
    });
});