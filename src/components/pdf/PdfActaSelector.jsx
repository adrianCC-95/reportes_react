import React from "react";
import ActaPrestamoPDF from "./ActaPrestamoPDF";
import ActaEntregaPDF from "./ActaEntregaPdf";
import ActaDevolucionPDF from "./ActaDevolucionPDF";

const PdfActaSelector = ({ formData, actaType }) => {
  switch (actaType.prefijo) {
    case "PRE":
      return <ActaPrestamoPDF formData={formData} />;

    case "ADC":
      return <ActaDevolucionPDF formData={formData} />;

    case "AEC":
      return <ActaEntregaPDF formData={formData} />;

    default:
      return;
  }
};

export default PdfActaSelector;
