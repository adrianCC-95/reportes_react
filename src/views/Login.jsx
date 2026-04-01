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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center px-4">
      <h2 className="text-xl sm:text-2xl font-light mb-6 text-gray-700 tracking-wide text-center">
        Ingrese el Código de Acceso
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-4 sm:p-6 bg-white shadow-2xl rounded-lg flex flex-col items-center gap-6"
      >
        <div className="flex justify-center gap-2 sm:gap-4 w-full flex-wrap">
          {codigo.map((value, index) => (
            <input
              key={index}
              type="password"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              disabled={bloqueado}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                     text-center text-xl sm:text-2xl md:text-3xl
                     font-semibold border-2 border-gray-300 rounded-lg
                     focus:outline-none focus:border-blue-500 shadow-lg"
            />
          ))}
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            disabled={bloqueado}
            className={`w-auto min-w-[140px] mt-2 px-6 py-2 text-sm sm:text-base font-medium rounded-lg transition duration-300 shadow-md ${
              bloqueado
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {bloqueado ? "Bloqueado por 10 minutos" : "Acceder"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
