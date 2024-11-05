document.getElementById("confirmar").addEventListener("click", calcularFaltas);
document.getElementById("cargaHoraria").addEventListener("change", toggleCustomInput);

function toggleCustomInput() {
    const cargaHorariaSelect = document.getElementById("cargaHoraria");
    const cargaHorariaCustom = document.getElementById("cargaHorariaCustom");
    
    if (cargaHorariaSelect.value === "custom") {
        cargaHorariaCustom.disabled = false;
        cargaHorariaCustom.required = true;
    } else {
        cargaHorariaCustom.disabled = true;
        cargaHorariaCustom.required = false;
        cargaHorariaCustom.value = "";
    }
}

function calcularFaltas() {
    const cargaHorariaSelect = document.getElementById("cargaHoraria");
    const cargaHorariaCustom = parseInt(document.getElementById("cargaHorariaCustom").value);
    const horasFaltadas = parseInt(document.getElementById("horasFaltadas").value);
    const resultado = document.getElementById("resultado");
    const aulasRestantes = document.getElementById("aulasRestantes");
    let cargaHoraria;

    if (cargaHorariaSelect.value === "custom" && !isNaN(cargaHorariaCustom)) {
        cargaHoraria = cargaHorariaCustom;
    } else {
        cargaHoraria = parseInt(cargaHorariaSelect.value);
    }
    if (isNaN(cargaHoraria) || isNaN(horasFaltadas)) {
        resultado.textContent = "Por favor, preencha todos os campos corretamente.";
        aulasRestantes.textContent = "";
        return;
    }

    const limiteFaltas = cargaHoraria * 0.25;
    const faltasRestantes = limiteFaltas - horasFaltadas;

    if (faltasRestantes > 0) {
        resultado.textContent = `Você ainda pode faltar ${faltasRestantes} horas.`;
        if (cargaHorariaSelect.value !== "custom") {
            const aulasPossiveis = calcularAulasRestantes(cargaHoraria, faltasRestantes);
            aulasRestantes.textContent = `Isso equivale a aproximadamente ${aulasPossiveis} aulas que você ainda pode faltar.`;
        } else {
            aulasRestantes.textContent = "";
        }
    } else {
        resultado.textContent = "Péssima notícia, você excedeu o limite de faltas permitido.";
        aulasRestantes.textContent = "";
    }
}

function calcularAulasRestantes(cargaHoraria, faltasRestantes) {
    let horasPorAula;

    switch (cargaHoraria) {
        case 15:
            horasPorAula = 1;
            break;
        case 30:
            horasPorAula = 2;
            break;
        case 45:
            horasPorAula = 3;
            break;
        case 60:
            horasPorAula = 2;
            break;
        case 75:
            horasPorAula = 2.5;
            break;
        case 90:
            horasPorAula = 3;
            break;
        case 120:
            horasPorAula = 4;
            break;
        default:
            horasPorAula = 1;
    }
    return Math.floor(faltasRestantes / horasPorAula);
}
