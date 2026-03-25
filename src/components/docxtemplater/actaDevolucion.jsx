import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import ImageModule from "docxtemplater-image-module-free";

const formatFecha = (fechaString) => {
  const meses = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  // Extraer año, mes y día del string
  const [año, mes, dia] = fechaString.split("-");

  // Ajustar el índice del mes (convertir a entero y restar 1)
  const nombreMes = meses[parseInt(mes, 10) - 1];

  const diaHoy = parseInt(dia, 10);
  const mesHoy = nombreMes;
  const yearHoy = año;
  // Retornar la fecha formateada
  // return `a los ${parseInt(dia, 10)} días del mes de ${nombreMes} del ${año}`;
  return { diaHoy, mesHoy, yearHoy };
};

// Convertir imagen a base64
const getBase64FromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const generarActaDevolucion = async ({ formData }) => {
  const {
    sede,
    areaResponsable,
    fechaEntrega,
    nombreSolicitante,
    nombreEncargado,
    cargoEncargado,
    equipos,
    nombreEmpresa,
    tipoDocumento,
    numeroDocumento,
    codigoDocumento,
  } = formData;
  // 1. Leer plantilla
  const response = await fetch("/assets/documentos/devolucion.docx");
  const content = await response.arrayBuffer();

  const zip = new PizZip(content);

  // 2. Configurar imágenes
  const imageModule = new ImageModule({
    getImage: (tagValue) => {
      // Convertir base64 a binario correctamente
      const base64 = tagValue.split(",")[1];
      const binary = atob(base64);
      const len = binary.length;
      const buffer = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
      }

      return buffer;
    },
    getSize: () => [150, 80],
  });

  const doc = new Docxtemplater(zip, {
    modules: [imageModule],
  });

  // 3. Obtener imagen
  const imagenBase64 = await getBase64FromUrl("/firma.png");

  // 4. Datos dinámicos

  try {
    doc.render({
      CODIGODOC: codigoDocumento,
      SEDE: sede,
      FECHA_DIA: formatFecha(fechaEntrega).diaHoy,
      FECHA_MES: formatFecha(fechaEntrega).mesHoy,
      FECHA_AÑO: formatFecha(fechaEntrega).yearHoy,

      equipos: equipos,
      NOMBRES: nombreSolicitante,
      DNI: numeroDocumento,
      EMPRESA: nombreEmpresa,
      AREA: areaResponsable,
      // fecha: new Date().toLocaleDateString(),
      // imagen: imagenBase64,
    });
  } catch (error) {
    console.error(error);
  }

  // 5. Descargar
  const blob = doc.getZip().generate({ type: "blob" });
  //   saveAs(blob, "Acta_Entrega.docx");
  return blob;
};
