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
    // Captura de datos desde el HTML
    let sueldoMensual = parseFloat(document.getElementById("salario").value) || 0;
    let ingreso = document.getElementById("fechaIngreso").value;
    let salida = document.getElementById("fechaSalida").value;
    let motivo = document.getElementById("motivoSalida").value;

    if (!ingreso || !salida) {
        alert("Por favor, complete las fechas de ingreso y salida.");
        return;
    }

    let diasTrabajados = diasEntre(ingreso, salida);
    if (diasTrabajados === 0) {
        alert("La fecha de salida debe ser posterior a la fecha de ingreso.");
        return;
    }

    let aniosTrabajados = diasTrabajados / 365;
    let mesesTrabajados = diasTrabajados / 30;

    // --- APLICACIÓN ESTRICTA DE LAS FÓRMULAS DE LA IMAGEN ---

    // 1. Salario diario
    let salarioDiario = sueldoMensual / 30;

    // 2. Salario promedio mensual = Sueldo / 12 * 14
    let salarioPromedioMensual = (sueldoMensual / 12) * 14;

    // 3. Salario promedio diario = Salario promedio mensual / 30
    let salarioPromedioDiario = salarioPromedioMensual / 30;

    // Inicialización de variables para el cálculo final
    let preaviso = 0;
    let cesantia = 0;
    let cesantiaProporcional = 0;

    // 4, 5 y 6. Preaviso y Cesantías (Solo aplican si es Despido Injustificado)
    if (motivo === "despido") {
        // Preaviso = Salario promedio diario * días según Art. 116 (Base estándar de 30 días por más de un año)
        preaviso = salarioPromedioDiario * 30;

        // Cesantía = Tiempo Según Tabla Cesantía * Salario promedio diario (Aproximación base de 20 días por año completo)
        cesantia = (Math.floor(aniosTrabajados) * 20) * salarioPromedioDiario;

        // Cesantía proporcional = (Días trabajados / 12) * Salario promedio diario
        // Nota: Para la parte proporcional en la fórmula estándar se toman los días sobrantes del último año incompleto
        let diasRestantesAno = diasTrabajados % 365;
        cesantiaProporcional = (diasRestantesAno / 12) * salarioPromedioDiario;
    }

    // 7. Vacaciones = Tiempo Según Tabla de vacaciones * Salario promedio diario (Base de 10 días para el primer año)
    let vacaciones = (Math.floor(aniosTrabajados) * 10) * salarioPromedioDiario;

    // 8. Vacaciones proporcionales = (días trabajados / divisor proporcional) * salario promedio diario
    // Se calcula sobre los días del año actual en curso (días sobrantes / 365 días del año)
    let diasRestantesVacaciones = diasTrabajados % 365;
    let vacacionesProporcionales = (diasRestantesVacaciones / 365) * salarioPromedioDiario;

    // 9. Décimo tercer / cuarto mes = (Sueldo mensual * meses trabajados) / 12
    // Se calculan sobre el tiempo acumulado proporcional correspondiente
    let decimo3 = (sueldoMensual * mesesTrabajados) / 12;
    let decimo4 = (sueldoMensual * mesesTrabajados) / 12;

    // 10. Total prestaciones = Preaviso + Cesantía + Cesantía Proporcional + Vacaciones + Vacaciones Proporcionales + 13er mes + 14to mes
    let total = preaviso + cesantia + cesantiaProporcional + vacaciones + vacacionesProporcionales + decimo3 + decimo4;

    // --- RENDERIZADO DEL RESULTADO EN EL HTML ---
    document.getElementById("resultado").innerHTML = `
        <div class="card shadow-sm border-0">
            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <span class="fw-bold">📊 Desglose de Liquidación (Fórmulas Oficiales)</span>
                <span class="badge ${motivo === 'despido' ? 'bg-danger' : 'bg-warning text-dark'} text-uppercase">
                    ${motivo === 'despido' ? 'Despido' : 'Renuncia'}
                </span>
            </div>

            <div class="card-body">
                <div class="row mb-3 bg-light p-2 rounded mx-0">
                    <div class="col-6"><strong>Tiempo Total:</strong> ${diasTrabajados} días</div>
                    <div class="col-6 text-end"><strong>Salario Promedio Diario:</strong> L ${salarioPromedioDiario.toFixed(2)}</div>
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
                            <td class="text-end fw-semibold">L ${preaviso.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Cesantía</td>
                            <td class="text-end fw-semibold">L ${cesantia.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Cesantía Proporcional</td>
                            <td class="text-end fw-semibold">L ${cesantiaProporcional.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Vacaciones</td>
                            <td class="text-end fw-semibold">L ${vacaciones.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Vacaciones Proporcionales</td>
                            <td class="text-end fw-semibold">L ${vacacionesProporcionales.toFixed(2)}</td>
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
                            <th class="fw-bold">TOTAL PRESTACIONES</th>
                            <th class="text-end fw-bold text-success">L ${total.toFixed(2)}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}