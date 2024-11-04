document.getElementById("confirmar").addEventListener("click", calcularFaltas);
document.getElementById("cargaHoraria").addEventListener("change", toggleCustomInput);

function toggleCustomInput() {
    const cargaHorariaSelect = document.getElementById("cargaHoraria");
    const cargaHorariaCustom = document.getElementById("cargaHorariaCustom");
    
    // Habilita o campo personalizado apenas se a opção "Outro" for escolhida
    if (cargaHorariaSelect.value === "custom") {
        cargaHorariaCustom.disabled = false;
        cargaHorariaCustom.required = true;
    } else {
        cargaHorariaCustom.disabled = true;
        cargaHorariaCustom.required = false;
        cargaHorariaCustom.value = ""; // Limpa o campo se não for usado
    }
}

function calcularFaltas() {
    const cargaHorariaSelect = document.getElementById("cargaHoraria");
    const cargaHorariaCustom = parseInt(document.getElementById("cargaHorariaCustom").value);
    const horasFaltadas = parseInt(document.getElementById("horasFaltadas").value);
    const resultado = document.getElementById("resultado");
    const aulasRestantes = document.getElementById("aulasRestantes");

    let cargaHoraria;

    // Verifica se o usuário selecionou uma opção fixa ou usou o campo personalizado
    if (cargaHorariaSelect.value === "custom" && !isNaN(cargaHorariaCustom)) {
        cargaHoraria = cargaHorariaCustom;
    } else {
        cargaHoraria = parseInt(cargaHorariaSelect.value);
    }

    // Verifica se os valores são válidos
    if (isNaN(cargaHoraria) || isNaN(horasFaltadas)) {
        resultado.textContent = "Por favor, preencha todos os campos corretamente.";
        aulasRestantes.textContent = "";
        return;
    }

    // Calcula o limite máximo de faltas (25% da carga horária)
    const limiteFaltas = cargaHoraria * 0.25;
    const faltasRestantes = limiteFaltas - horasFaltadas;

    // Exibe o resultado das horas restantes
    if (faltasRestantes > 0) {
        resultado.textContent = `Você ainda pode faltar ${faltasRestantes} horas.`;
        
        // Se for carga horária fixa, calcula as aulas restantes
        if (cargaHorariaSelect.value !== "custom") {
            const aulasPossiveis = calcularAulasRestantes(cargaHoraria, faltasRestantes);
            aulasRestantes.textContent = `Isso equivale a ${aulasPossiveis} aulas que você ainda pode faltar.`;
        } else {
            aulasRestantes.textContent = ""; // Ignora aulas restantes para carga horária personalizada
        }
    } else {
        resultado.textContent = "Você já excedeu o limite de faltas permitido.";
        aulasRestantes.textContent = "";
    }
}

function calcularAulasRestantes(cargaHoraria, faltasRestantes) {
    let horasPorAula;

    // Define o número de horas por aula com base na carga horária
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
        default:
            horasPorAula = 1;
    }

    // Calcula a quantidade de aulas restantes com base nas horas restantes e horas por aula
    return Math.floor(faltasRestantes / horasPorAula);
}
