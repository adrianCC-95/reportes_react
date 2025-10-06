import React from "react";
import { Navigate } from "react-router-dom";

function RutaPrivada({ children }) {
  const accesoPermitido = sessionStorage.getItem("accesoPermitido");
  const horaAcceso = sessionStorage.getItem("horaAcceso");

  // Tiempo límite de 30 minutos (en milisegundos)
  const tiempoLimite = 30 * 60 * 1000;

  // Validamos si el tiempo de acceso ha expirado
  if (
    !accesoPermitido ||
    !horaAcceso ||
    Date.now() - parseInt(horaAcceso) > tiempoLimite
  ) {
    sessionStorage.removeItem("accesoPermitido");
    sessionStorage.removeItem("horaAcceso");
    alert("El acceso ha expirado. Por favor, ingresa nuevamente.");
    return <Navigate to="/" />;
  }

  return children;
}

export default RutaPrivada;
