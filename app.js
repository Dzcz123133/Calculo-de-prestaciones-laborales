function diasEntre(fecha1, fecha2){
    let inicio = new Date(fecha1);
    let fin = new Date(fecha2);

    let diferencia = fin - inicio;

    if (diferencia < 0) return 0;

    return Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );
}

function calcular(){
    // Elementos del DOM y validación de nulos
    let salario = parseFloat(document.getElementById("salario").value) || 0;
    let comisiones = parseFloat(document.getElementById("comisiones").value) || 0;
    let extras = parseFloat(document.getElementById("horasExtras").value) || 0;
    let bonos = parseFloat(document.getElementById("bonificaciones").value) || 0;

    let ingreso = document.getElementById("fechaIngreso").value;
    let salida = document.getElementById("fechaSalida").value;
    let motivo = document.getElementById("motivoSalida").value;

    if (!ingreso || !salida) {
        alert("Por favor, complete las fechas de ingreso y salida.");
        return;
    }

    let dias = diasEntre(ingreso, salida);
    if (dias === 0) {
        alert("La fecha de salida debe ser posterior a la fecha de ingreso.");
        return;
    }

    let anios = dias / 365;
    let mesesTrabajados = dias / 30;

    // --- CÁLCULO DE SALARIOS BASE ---
    // Salario promedio mensual = (Sueldo / 12) * 14 + ingresos variables promedio
    let salarioPromedioMensual = ((salario / 12) * 14) + comisiones + extras + bonos;
    let salarioPromedioDiario = salarioPromedioMensual / 30;

    // --- VARIABLES DE PRESTACIONES ---
    let preaviso = 0;
    let cesantia = 0;

    // --- APLICACIÓN DE REGLAS SEGÚN MOTIVO DE SALIDA ---
    if (motivo === "despido") {
        // Corresponde Preaviso (Base estándar de 30 días si supera el año)
        preaviso = salarioPromedioDiario * 30;
        // Corresponde Cesantía (Base estándar proporcional basada en tiempo trabajado)
        cesantia = salarioPromedioDiario * (anios * 20);
    } 
    // Si es "renuncia", preaviso y cesantía se quedan con su valor inicial: 0

    // --- DERECHOS ADQUIRIDOS (Se pagan siempre, sin importar el motivo) ---
    let decimo3 = (salario * mesesTrabajados) / 12;
    let decimo4 = (salario * mesesTrabajados) / 12;
    let vacaciones = salarioPromedioDiario * 10; // Proporcional base estándar

    // Suma total
    let total = preaviso + cesantia + decimo3 + decimo4 + vacaciones;

    // --- RENDERIZADO DEL INFORME EN EL HTML ---
    document.getElementById("resultado").innerHTML = `
        <div class="card shadow-sm border-0">
            <div class="card-header bg-dark text-white d-flex justify-between align-items-center">
                <span class="fw-bold">📊 Desglose de Liquidación Computada</span>
                <span class="badge ${motivo === 'despido' ? 'bg-danger' : 'bg-warning text-dark'} text-uppercase">
                    ${motivo === 'despido' ? 'Despido' : 'Renuncia'}
                </span>
            </div>

            <div class="card-body">
                <div class="row mb-3 bg-light p-2 rounded mx-0">
                    <div class="col-6"><strong>Tiempo transcurrido:</strong> ${dias} días (~${anios.toFixed(1)} años)</div>
                    <div class="col-6 text-end"><strong>Salario Diario Promedio:</strong> L ${salarioPromedioDiario.toFixed(2)}</div>
                </div>

                <table class="table table-striped table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Concepto Laboral</th>
                            <th class="text-end">Monto Calculado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Preaviso</td>
                            <td class="text-end fw-semibold ${preaviso === 0 ? 'text-muted' : ''}">L ${preaviso.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Cesantía</td>
                            <td class="text-end fw-semibold ${cesantia === 0 ? 'text-muted' : ''}">L ${cesantia.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Vacaciones Proporcionales</td>
                            <td class="text-end fw-semibold">L ${vacaciones.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Décimo Tercer Mes (Aguinaldo)</td>
                            <td class="text-end fw-semibold">L ${decimo3.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Décimo Cuarto Mes</td>
                            <td class="text-end fw-semibold">L ${decimo4.toFixed(2)}</td>
                        </tr>
                        <tr class="table-success fs-5">
                            <th class="fw-bold">TOTAL ESTIMADO</th>
                            <th class="text-end fw-bold text-success">L ${total.toFixed(2)}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Función opcional por si deseas añadir efectos visuales al cambiar el select en el futuro
function alternarCamposPreaviso() {
    // Lista para expandir lógica de interfaz si fuera necesario
}