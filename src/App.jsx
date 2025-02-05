import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuActas from "./views/MenuActas"; // Página del menú de actas
import FormularioActas from "./views/Actas"; // Página del formulario general

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el menú de actas */}
        <Route path="/" element={<MenuActas />} />

        {/* Ruta para el formulario general */}
        <Route path="/formulario-actas" element={<FormularioActas />} />
      </Routes>
    </Router>
  );
}

export default App;
