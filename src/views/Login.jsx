import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    const tiempoBloqueo = localStorage.getItem("tiempoBloqueo");
    const tiempoRestante = tiempoBloqueo
      ? parseInt(tiempoBloqueo) - Date.now()
      : 0;

    if (tiempoRestante > 0) {
      setBloqueado(true);
      const timer = setTimeout(() => {
        setBloqueado(false);
        localStorage.removeItem("tiempoBloqueo");
        setIntentos(0);
      }, tiempoRestante);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e, index) => {
    const newCodigo = [...codigo];
    newCodigo[index] = e.target.value;
    setCodigo(newCodigo);

    // Pasar al siguiente cuadro automáticamente
    if (e.target.value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const codigoAcceso = import.meta.env.VITE_CODIGO_ACCESO;

    if (codigo.join("") === codigoAcceso) {
      sessionStorage.setItem("accesoPermitido", true);
      sessionStorage.setItem("horaAcceso", Date.now());
      localStorage.removeItem("intentosFallidos");
      localStorage.removeItem("tiempoBloqueo");
      navigate("/menu-actas");
    } else {
      alert("Código incorrecto. Inténtalo de nuevo.");

      // Reinicia los cuadros y enfoca el primero
      setCodigo(["", "", "", ""]);
      inputsRef.current[0].focus();

      // Incrementa los intentos fallidos y verifica bloqueo
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      localStorage.setItem("intentosFallidos", nuevosIntentos);

      if (nuevosIntentos >= 5) {
        const tiempoBloqueo = Date.now() + 10 * 60 * 1000; // Bloqueo de 10 minutos
        localStorage.setItem("tiempoBloqueo", tiempoBloqueo);
        setBloqueado(true);
        alert("Demasiados intentos fallidos. Bloqueo de 10 minutos.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h2 className="text-2xl font-light mb-6 text-gray-700 tracking-wide">
        Ingrese el Código de Acceso
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-[70%] max-w-xl p-6 bg-white shadow-2xl rounded-lg flex flex-col items-center gap-6"
      >
        <div className="flex justify-center gap-4 w-full">
          {codigo.map((value, index) => (
            <input
              key={index}
              type="password"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              disabled={bloqueado}
              className="w-20 h-20 text-center text-3xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-lg"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={bloqueado}
          className={`w-full mt-4 py-3 text-lg font-semibold rounded-lg transition duration-300 shadow-lg ${
            bloqueado
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {bloqueado ? "Bloqueado por 10 minutos" : "Acceder"}
        </button>
      </form>
    </div>
  );
}

export default Login;
