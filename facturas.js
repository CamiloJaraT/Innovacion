document.addEventListener('DOMContentLoaded', () => {
    const facturasTable = document.getElementById('facturas-table').getElementsByTagName('tbody')[0];
    const facturas = JSON.parse(localStorage.getItem('facturas')) || [];

    facturas.forEach(factura => {
        const newRow = facturasTable.insertRow();
        newRow.innerHTML = `
            <td>${factura.id}</td>
            <td>${factura.cliente}</td>
            <td>$${factura.total}</td>
            <td>${factura.fecha}</td>
            <td><button onclick="exportarPDF(${factura.id}, '${factura.cliente}', '${factura.total}', '${factura.fecha}')">Exportar a PDF</button></td>
        `;
    });
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
