import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cadastro from "./Cadastro";
import Confirmar from "./Confirmar";
import Home from "./Home";
import Manager from "./Manager";
import Authenticate from "./Authenticate";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/confirmar" element={<Confirmar />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/authenticate" element={<Authenticate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


// Component pra receber o id, tendo forms pra nome e botao confirmação. Quando confirmado, dá push pra api.
// Ter outro component pra forms pra adicionar a api de maneira fria, sem ser confirmado

// A api vai ter duas listas, uma de cadastrados (com um forms pra cadastrar), e outra de confirmados (com id pra confirmar certo e passar o nome pra lista de confirmados); 
