import React, { useState } from "react";
import axios from "axios";
import {
  AlignmentType,
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Paragraph,
  TextRun,
  BorderStyle,
  Header,
  Media,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import logo from "../../assets/logo-empresas.jpg";
import { Spinner } from "reactstrap";
import generateActaPrestamo from "./ActaPrestamoWord";
import generateActaDevolucion from "./ActaDevolucionWord";
import generateActaEntrega from "./ActaEntregaWord";

const GenerateWord = ({ formData, actaType }) => {
  const [isLoadingWord, setIsLoadingWord] = useState(false); // Estado para Word
  const [isLoadingPDF, setIsLoadingPDF] = useState(false); // Estado para PDF

  const handleDownload = async () => {
    let blob;
    console.log("ACTATYPE", actaType.prefijo);
    switch (actaType.prefijo) {
      case "PRE":
        blob = await generateActaPrestamo();
        break;
      case "ADC":
        blob = await generateActaDevolucion({ formData });
        break;
      case "AEC":
        blob = await generateActaEntrega({ formData });
        break;
      default:
        return;
    }

    return blob;
  };

  // Función para descargar el documento como Word
  const downloadAsWord = async () => {
    const blob = await handleDownload();
    setIsLoadingWord(true); // Mostrar loading
    try {
      // const blob = await Packer.toBlob(doc); // Generar el blob del documento
      saveAs(
        blob,
        `ACTA DE ${actaType.nombre || "SinNombre"} ${
          formData.codigoDocumento || "0"
        } ${formData.nombreSolicitante || "N/A"}.docx`
      ); // Descargar
    } catch (error) {
      console.error("Error al generar Word:", error);
    } finally {
      setIsLoadingWord(false); // Ocultar loading
    }
  };

  // Función para convertir el archivo DOC generado en el navegador a PDF
  const authenticateAndConvertToPDF = async () => {
    const wordBlob = await handleDownload();
    // Detalles de autenticación
    const clientId = "cd7bd33f-468d-40ea-8dd4-ae8d623cc17e"; // Sustituye con tu Client ID
    const clientSecret = "f5309df12dfabd873d9c8a81edf8c476"; // Sustituye con tu Client Secre
    setIsLoadingPDF(true); // Activar el estado de carga
    try {
      // Paso 1: Obtener el token de autenticación
      const authResponse = await axios.post(
        "https://api.aspose.cloud/connect/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = authResponse.data.access_token; // Obtener el token

      // Convertir el documento a un Blob compatible con navegadores
      // const wordBlob = await Packer.toBlob(doc);

      // Paso 3: Enviar el documento Word a Aspose para convertir a PDF
      const formDataBody = new FormData();
      formDataBody.append("file", wordBlob, "document.docx");

      const convertResponse = await axios.put(
        "https://api.aspose.cloud/v4.0/words/convert?format=pdf",
        formDataBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer", // Asegurar que recibimos el archivo PDF en binario
        }
      );

      // Paso 4: Descargar el archivo PDF
      const pdfBlob = new Blob([convertResponse.data], {
        type: "application/pdf",
      });
      const urlPDF = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = urlPDF;
      downloadLink.download = `ACTA DE ${actaType.nombre || "SinNombre"} ${
        formData.codigoDocumento || "0"
      } ${formData.nombreSolicitante || "N/A"}.pdf`;
      downloadLink.click(); // Disparar la descarga
    } catch (error) {
      console.error("Error en la conversión o autenticación:", error);
    } finally {
      setIsLoadingPDF(false); // Desactivar el estado de carga
    }
  };

  // Convertir el documento a un archivo Blob
  // Packer.toBlob(doc).then((blob) => {
  //   saveAs(blob, `Acta_${formData.codigoDocumento}.docx`);
  // });

  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      {/* Botón para descargar Word */}
      <button
        onClick={downloadAsWord}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        {isLoadingWord ? (
          <Spinner /> // Aquí puedes agregar un spinner de carga
        ) : (
          "Descargar como WORD"
        )}
      </button>
      {/* Botón para descargar PDF */}
      <button
        onClick={authenticateAndConvertToPDF}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
      >
        {isLoadingPDF ? (
          <Spinner /> // Aquí puedes agregar un spinner de carga
        ) : (
          "Descargar como PDF"
        )}
      </button>
    </div>
  );
};

export default GenerateWord;
