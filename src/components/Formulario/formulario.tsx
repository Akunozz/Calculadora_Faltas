import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"


// Esquema de validação com Zod
const schema = z.object({
  cargaHoraria: z.string().min(1, "Selecione a carga horária."),
  horasFaltadas: z.string().min(1, "Selecione as horas faltadas."),
});

// Opções de carga horária
const cargaHorariaOptions = [
  { label: "15 horas", value: "15" },
  { label: "30 horas", value: "30" },
  { label: "45 horas", value: "45" },
  { label: "60 horas", value: "60" },
  { label: "75 horas", value: "75" },
  { label: "90 horas", value: "90" },
  { label: "120 horas", value: "120" },
];

// Opções de horas faltadas
const horasFaltadasOptions = Array.from({ length: 31 }, (_, i) => ({
  label: `${i} horas`,
  value: i.toString(),
}));

// Função auxiliar para obter horas por aula
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
      return 2.5;
    case 90:
      return 3;
    case 120:
      return null;
    default:
      return 1;
  }
}

function FormularioFaltas() {
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [resultadoHoras, setResultadoHoras] = useState<string>("");
  const [resultadoAulas, setResultadoAulas] = useState<string>("");
  const [excedeuFaltas, setExcedeuFaltas] = useState<boolean>(false);

  const carga = watch("cargaHoraria") ? Number(watch("cargaHoraria")) : null;
  const faltadas = watch("horasFaltadas") ? Number(watch("horasFaltadas")) : 0;

  const calcularFaltas = () => {
    if (!carga) return;

    const limiteFaltas = carga * 0.25;
    const faltasRestantes = limiteFaltas - faltadas;

    if (faltasRestantes > 0) {
      setResultadoHoras(`Você ainda pode faltar ${faltasRestantes} horas.`);
      setExcedeuFaltas(false);

      if (carga === 120) {
        setResultadoAulas("");
      } else {
        const horasPorAula = getHorasPorAula(carga);
        if (horasPorAula) {
          const aulas = Math.floor(faltasRestantes / horasPorAula);
          setResultadoAulas(`Isso equivale a aproximadamente ${aulas} aulas.`);
        } else {
          setResultadoAulas("");
        }
      }
    } else {
      setResultadoHoras("Você excedeu o limite de faltas permitido.")
      setResultadoAulas("")
      setExcedeuFaltas(true)
      toast.error("Se fodeu com sucesso!")
      
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold p-2">
          Calculadora de Faltas
        </CardTitle>
        <CardDescription className="flex justify-center p-2">
          Insira a carga horária da disciplina e as faltas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(calcularFaltas)} className="space-y-6">
          {/* Seleção da Carga Horária */}
          <div>
            <Label htmlFor="cargaHoraria">Carga Horária:</Label>
            <Controller
              control={control}
              name="cargaHoraria"
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a carga horária" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargaHorariaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cargaHoraria && (
              <p className="text-red-500 text-sm mt-1">{errors.cargaHoraria?.message?.toString()}</p>
            )}
          </div>

          {/* Seleção das Horas Faltadas */}
          <div>
            <Label htmlFor="horasFaltadas">Horas faltadas:</Label>
            <Controller
              control={control}
              name="horasFaltadas"
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as horas faltadas" />
                  </SelectTrigger>
                  <SelectContent>
                    {horasFaltadasOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.horasFaltadas && (
              <p className="text-red-500 text-sm mt-1">{errors.horasFaltadas?.message?.toString()}</p>
            )}
          </div>

          {/* Botão de Cálculo */}
          <Button type="submit" className="w-full rounded-lg">
            Calcular
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center space-y-4">
        <p className={`text-sm ${excedeuFaltas ? "text-red-500 font-bold" : "text-green-500 font-medium"}`}>
          {resultadoHoras}
        </p>
        <p className="text-sm">{resultadoAulas} </p>
        <p className="text-sm text-gray-500">Criado por Breno Rosa</p>
      </CardFooter>
    </Card>
  );
}

export default FormularioFaltas;
