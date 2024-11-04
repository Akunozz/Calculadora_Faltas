document.getElementById("confirmar").addEventListener("click", calcularFaltas);

function calcularFaltas() {
    const cargaHoraria = parseInt(document.getElementById("cargaHoraria").value);
    const horasFaltadas = parseInt(document.getElementById("horasFaltadas").value);
    const resultado = document.getElementById("resultado");
    const aulasRestantes = document.getElementById("aulasRestantes");

    if (isNaN(cargaHoraria) || isNaN(horasFaltadas)) {
        resultado.textContent = "Por favor, preencha todos os campos corretamente.";
        aulasRestantes.textContent = "";
        return;
    }

    const limiteFaltas = cargaHoraria * 0.25;
    const faltasRestantes = limiteFaltas - horasFaltadas;

    if (faltasRestantes > 0) {
        resultado.textContent = `Você ainda pode faltar ${faltasRestantes} horas.`;
        const aulasPossiveis = calcularAulasRestantes(cargaHoraria, faltasRestantes);
        aulasRestantes.textContent = `Isso equivale a ${aulasPossiveis} aulas que você ainda pode faltar.`;
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
            horasPorAula = 2.5; // Média de 2 aulas por semana: uma de 3h e outra de 2h
            break;
        case 90:
            horasPorAula = 3;
            break;
        case 120:
            return "N/A"; // Não se aplica para 120h
        default:
            horasPorAula = 1; // Valor padrão de segurança
    }

    // Calcula a quantidade de aulas restantes com base nas horas restantes e horas por aula
    return Math.floor(faltasRestantes / horasPorAula);
}
