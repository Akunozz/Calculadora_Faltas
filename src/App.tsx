import FormularioFaltas from "./components/Formulario/formulario";
import imagem from "./assets/imagem.jpg";
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <div 
      className="h-screen w-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${imagem})` }}
    >
      <Toaster position="top-right" duration={5000} />
      <FormularioFaltas />
    </div>
  );
}

export default App;
