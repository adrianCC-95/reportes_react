import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuActas from "./views/MenuActas";
import FormularioActas from "./views/Actas";
import Login from "./views/Login";
import RutaPrivada from "./middleware/RutaPrivada";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/menu-actas"
          element={
            <RutaPrivada>
              <MenuActas />
            </RutaPrivada>
          }
        />
        <Route
          path="/formulario-actas"
          element={
            <RutaPrivada>
              <FormularioActas />
            </RutaPrivada>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
