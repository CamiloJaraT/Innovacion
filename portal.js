// Obtener datos del usuario activo
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

// Mostrar los datos del usuario en el portal
if (usuarioActivo) {
    const deudaUsuario = parseFloat(usuarioActivo.deuda);
    const gananciasUsuario = parseFloat(usuarioActivo.ganancias);
    const gastosUsuario = parseFloat(usuarioActivo.gastos || 0);  // Añadir gastos

    document.getElementById('nombre-usuario').textContent = usuarioActivo.nombre;
    document.getElementById('deuda-usuario').textContent = deudaUsuario.toFixed(2);
    document.getElementById('ganancias-usuario').textContent = gananciasUsuario.toFixed(2);
    document.getElementById('gastos-usuario').textContent = gastosUsuario.toFixed(2);

    // Mostrar advertencia si la deuda es mayor que las ganancias
    if (deudaUsuario > gananciasUsuario) {
        document.getElementById('advertencia-deuda').style.display = 'block';
    } else {
        document.getElementById('advertencia-deuda').style.display = 'none';
    }
} else {
    window.location.href = "index.html";
}

// Obtener elementos del modal
const modal = document.getElementById('modal-confirmacion');
const mensajeModal = document.getElementById('mensaje-modal');
const cerrarModalBtn = document.getElementById('cerrar-modal-btn');
const closeBtn = document.querySelector('.close-btn');

// Función para mostrar el modal con un mensaje
function mostrarModal(mensaje) {
    mensajeModal.textContent = mensaje;
    modal.style.display = 'flex';
}

// Función para cerrar el modal
function cerrarModal() {
    modal.style.display = 'none';
}

// Cerrar el modal al hacer clic en el botón "Aceptar" o en la "X"
cerrarModalBtn.addEventListener('click', cerrarModal);
closeBtn.addEventListener('click', cerrarModal);

// Cerrar el modal si el usuario hace clic fuera del contenido del modal
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

// Manejar facturación con validaciones
const facturaForm = document.getElementById('form-factura');
const facturasTable = document.getElementById('facturas-table').getElementsByTagName('tbody')[0];
let facturaId = 1;

facturaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = document.getElementById('nombre-cliente').value;
    const montoFactura = parseFloat(document.getElementById('monto-factura').value);
    const fechaFactura = document.getElementById('fecha-factura').value;

    const advertenciaDeudaVisible = document.getElementById('advertencia-deuda').style.display === 'block';

    if (advertenciaDeudaVisible) {
        alert('No puedes generar una factura mientras tu deuda sea mayor que tus ganancias.');
        return; // No permitir la generación de la factura
    }

    if (cliente && montoFactura > 0) {
        const newRow = facturasTable.insertRow();
        newRow.innerHTML = `
            <td>Factura ${facturaId}</td>
            <td>${cliente}</td>
            <td>${montoFactura.toFixed(2)}</td>
            <td>${fechaFactura}</td>
            <td><button onclick="exportarPDF(${facturaId}, '${cliente}', '${montoFactura}', '${fechaFactura}')">Exportar a PDF</button></td>
        `;

        // Actualizar ganancias
        let gananciasTotales = parseFloat(usuarioActivo.ganancias || 0);
        gananciasTotales += montoFactura;
        usuarioActivo.ganancias = gananciasTotales;

        document.getElementById('ganancias-usuario').textContent = gananciasTotales.toFixed(2);

        // Guardar en localStorage
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

        facturaId++;
        facturaForm.reset();
        mostrarModal('La factura ha sido generada con éxito.');
    } else {
        alert('Por favor, ingrese un cliente válido y un monto mayor a 0.');
    }
});

// Manejar registro de gastos
const gastoForm = document.getElementById('form-gasto');
gastoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const montoGasto = parseFloat(document.getElementById('monto-gasto').value);
    const descripcionGasto = document.getElementById('descripcion-gasto').value;

    if (montoGasto > 0 && descripcionGasto) {
        let gastosTotales = parseFloat(usuarioActivo.gastos || 0);
        gastosTotales += montoGasto;
        usuarioActivo.gastos = gastosTotales;

        // Actualizar en la interfaz
        document.getElementById('gastos-usuario').textContent = gastosTotales.toFixed(2);

        // Guardar en localStorage
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

        gastoForm.reset();
        mostrarModal('El gasto ha sido registrado con éxito.');
    } else {
        alert('Por favor, ingrese un monto válido y una descripción.');
    }
});

// Función para exportar una factura a PDF
function exportarPDF(facturaId, cliente, total, fecha) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(20, 20, `Factura ID: ${facturaId}`);
    doc.text(20, 30, `Cliente: ${cliente}`);
    doc.text(20, 40, `Monto Total: $${total}`);
    doc.text(20, 50, `Fecha: ${fecha}`);

    doc.save(`Factura_${facturaId}.pdf`);
}
