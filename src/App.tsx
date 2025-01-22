import React, { useState } from "react";

/**
 * Define as opções padrão para a carga horária
 * que não são "custom".
 */
const DISCIPLINA_OPTIONS = [
  { label: "15 horas", value: 15 },
  { label: "30 horas", value: 30 },
  { label: "45 horas", value: 45 },
  { label: "60 horas", value: 60 },
  { label: "75 horas", value: 75 },
  { label: "90 horas", value: 90 },
  { label: "120 horas", value: 120 },
];

/**
 * Retorna quantas horas por aula, baseado na carga horária.
 * Retorna null para 120h ou qualquer caso que não queira contabilizar aulas.
 */
function getHorasPorAula(cargaHoraria: number): number | null {
  switch (cargaHoraria) {
    case 15:
      return 1;
    case 30:
      return 2;
    case 45:
      return 3;
    case 60:
      return 2;
    case 75:
      return 2.5; // média (uma aula de 3h, outra de 2h)
    case 90:
      return 3;
    case 120:
      return null; // N/A
    default:
      return 1;    // fallback
  }
}

function App() {
  // Estados para armazenar as entradas do usuário
  const [disciplina, setDisciplina] = useState<string>("");       // valor do select
  const [cargaHorariaCustom, setCargaHorariaCustom] = useState<string>(""); // valor digitado
  const [horasFaltadas, setHorasFaltadas] = useState<string>(""); // valor do select de faltas

  // Estados para armazenar os resultados
  const [resultadoHoras, setResultadoHoras] = useState<string>("");
  const [resultadoAulas, setResultadoAulas] = useState<string>("");

  /**
   * Ação ao mudar o select de disciplina.
   * Se o usuário escolher "custom", ele digita manualmente a carga horária.
   */
  const handleDisciplinaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisciplina(e.target.value);
    setResultadoHoras("");
    setResultadoAulas("");
    // Resetar o campo custom caso o usuário selecione outra opção
    if (e.target.value !== "custom") {
      setCargaHorariaCustom("");
    }
  };

  /**
   * Faz o cálculo de quantas horas ainda pode faltar.
   * Máximo de faltas = 25% da carga horária (ou seja, precisa de 75% de presença).
   */
  const handleConfirmar = () => {
    // Determinar a carga horária efetiva
    let carga = 0;
    if (disciplina === "custom") {
      carga = parseInt(cargaHorariaCustom);
    } else {
      carga = parseInt(disciplina);
    }

    const faltadas = parseInt(horasFaltadas);

    // Verificações de valores inválidos
    if (
      isNaN(carga) || 
      isNaN(faltadas) || 
      carga <= 0 || 
      faltadas < 0
    ) {
      setResultadoHoras("Por favor, preencha todos os campos corretamente.");
      setResultadoAulas("");
      return;
    }

    // Cálculo do máximo de faltas: 25% da carga horária
    const limiteFaltas = carga * 0.25;
    const faltasRestantes = limiteFaltas - faltadas;

    // Se ainda pode faltar horas
    if (faltasRestantes > 0) {
      setResultadoHoras(`Você ainda pode faltar ${faltasRestantes} horas.`);

      // Se for disciplina custom ou 120h, ignorar cálculo de aulas
      if (disciplina === "custom" || carga === 120) {
        setResultadoAulas("");
      } else {
        const horasPorAula = getHorasPorAula(carga);
        // horasPorAula pode ser null (no caso de 120)
        if (horasPorAula) {
          const aulas = Math.floor(faltasRestantes / horasPorAula);
          setResultadoAulas(`Isso equivale a aproxidamente ${aulas} aulas que você ainda pode faltar.`);
        } else {
          setResultadoAulas("");
        }
      }
    } else {
      // Excedeu o limite
      setResultadoHoras("Você já excedeu o limite de faltas permitido.");
      setResultadoAulas("");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-6 mb-10">
        <h1 className="text-2xl font-bold text-center mb-10">Calculadora de Faltas</h1>
        
        <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Seletor de carga horária */}
          <div>
            <label htmlFor="cargaHoraria" className="font-medium">
              Selecione a carga horária da disciplina:
            </label>
            <select
              id="cargaHoraria"
              className="block w-full mt-2 p-2 border border-gray-700 rounded-2xl"
              value={disciplina}
              onChange={handleDisciplinaChange}
              required
            >
              <option value="" disabled>
                Escolha uma opção
              </option>
              {DISCIPLINA_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="custom">Outro (Digite abaixo)</option>
            </select>
          </div>

          {/* Campo de texto para carga horária customizada */}
          <div>
            <label htmlFor="cargaHorariaCustom" className="font-medium">
              Ou digite a carga horária:
            </label>
            <input
              id="cargaHorariaCustom"
              type="number"
              min={1}
              className={`block w-full mt-2 p-2 border border-gray-700 rounded-2xl
                ${disciplina === "custom" ? "" : "bg-gray-200 cursor-not-allowed"}`}
              placeholder="Ex: 100 horas"
              disabled={disciplina !== "custom"}
              value={cargaHorariaCustom}
              onChange={(e) => setCargaHorariaCustom(e.target.value)}
            />
          </div>

          {/* Seletor de horas faltadas (1 a 32) */}
          <div>
            <label htmlFor="horasFaltadas" className="font-medium">
              Selecione as horas que você já faltou:
            </label>
            <select
              id="horasFaltadas"
              className="block w-full mt-2 p-2 border border-gray-700 rounded-2xl"
              value={horasFaltadas}
              onChange={(e) => setHorasFaltadas(e.target.value)}
              required
            >
              <option value="" disabled>
                Escolha uma opção
              </option>
              {Array.from({ length: 32 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "hora" : "horas"}
                </option>
              ))}
            </select>
          </div>

          {/* Botão confirmar */}
          <button
            type="button"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={handleConfirmar}
          >
            Confirmar
          </button>
        </form>

        {/* Resultados */}
        <div className="mt-6">
          {resultadoHoras && (
            <p className="text-center font-semibold mb-2">{resultadoHoras}</p>
          )}
          {resultadoAulas && (
            <p className="text-center font-semibold">{resultadoAulas}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center">
        <p className="text-sm text-gray-300">Criado por Breno Rosa</p>
      </footer>
    </div>
  );
}

export default App;
