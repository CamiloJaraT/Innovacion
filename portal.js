// Obtener datos del usuario activo
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

// Mostrar los datos del usuario en el portal
if (usuarioActivo) {
    const deudaUsuario = parseFloat(usuarioActivo.deuda);
    const gananciasUsuario = parseFloat(usuarioActivo.ganancias);
    document.getElementById('nombre-usuario').textContent = usuarioActivo.nombre; // Muestra el nombre del usuario

    document.getElementById('deuda-usuario').textContent = deudaUsuario.toFixed(2);
    document.getElementById('ganancias-usuario').textContent = gananciasUsuario.toFixed(2);

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
const facturasTable = document.getElementById('facturas-table').getElementsByTagName('tbody')[0];
let facturaId = 1;

facturaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const total = document.getElementById('total').value;
    const fechaFactura = document.getElementById('fecha-factura').value;

    const advertenciaDeudaVisible = document.getElementById('advertencia-deuda').style.display === 'block';

    if (advertenciaDeudaVisible) {
        alert('No puedes generar una factura mientras tu deuda sea mayor que tus ganancias.');
        return; // No permitir la generación de la factura
    }

    if (cliente && total && parseFloat(total) > 0) {
        const newRow = facturasTable.insertRow();
        newRow.innerHTML = `
            <td>Factura ${facturaId}</td>
            <td>${cliente}</td>
            <td>${total}</td>
            <td>${fechaFactura}</td>
            <td><button onclick="exportarPDF(${facturaId}, '${cliente}', '${total}', '${fechaFactura}')">Exportar a PDF</button></td>
        `;
        facturaId++;
        facturaForm.reset();
    } else {
        alert('Por favor, ingrese un cliente válido y un monto mayor a 0.');
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
