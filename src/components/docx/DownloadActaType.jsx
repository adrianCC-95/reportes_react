import React from "react";
import generateActaPrestamo from "./ActaPrestamoWord";
import generateActaDevolucion from "./ActaDevolucionWord";
import generateActaEntrega from "./ActaEntregaWord";

const DownloadActaType = () => {
  const handleDownload = async (type) => {
    let blob;

    switch (type) {
      case "prestamo":
        blob = await generateActaPrestamo();
        break;
      case "devolucion":
        blob = await generateActaDevolucion();
        break;
      case "entrega":
        blob = await generateActaEntrega();
        break;
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Acta_${type}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Generador de Actas</h1>
      <button onClick={() => handleDownload("prestamo")}>
        Generar Acta de Préstamo
      </button>
      <button onClick={() => handleDownload("devolucion")}>
        Generar Acta de Devolución
      </button>
      <button onClick={() => handleDownload("entrega")}>
        Generar Acta de Entrega
      </button>
    </div>
  );
};

export default DownloadActaType;
