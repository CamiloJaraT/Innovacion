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

// Manejar facturación con validaciones
const facturaForm = document.getElementById('form-factura');
let facturas = JSON.parse(localStorage.getItem('facturas')) || [];
let facturaId = facturas.length + 1;

facturaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = document.getElementById('nombre-cliente').value;
    const montoFactura = parseFloat(document.getElementById('monto-factura').value);
    const fechaFactura = document.getElementById('fecha-factura').value;

    if (cliente && montoFactura > 0) {
        // Crear objeto de factura
        const nuevaFactura = {
            id: facturaId,
            cliente: cliente,
            total: montoFactura.toFixed(2),
            fecha: fechaFactura
        };

        // Guardar factura en localStorage
        facturas.push(nuevaFactura);
        localStorage.setItem('facturas', JSON.stringify(facturas));

        // Redirigir a la página de facturas
        window.location.href = 'facturas.html';
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
