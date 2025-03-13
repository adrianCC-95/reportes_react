import axios from "axios";

import apiUrl from "../../config/serviciosUrl";

const API_URL = apiUrl;

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Lu1nJ-hXTHgmrcwYzsli5D5MW63GYflSzQboXbHzUXs/export?format=xlsx";

export async function buscarEmpleado(nombreBuscado) {
  const url =
    "https://docs.google.com/spreadsheets/d/1Lu1nJ-hXTHgmrcwYzsli5D5MW63GYflSzQboXbHzUXs/gviz/tq?tqx=out:json";

  try {
    const response = await axios.get(url);
    const text = response.data;

    // Limpiar el JSON de Google
    const json = JSON.parse(
      text
        .replace("/*O_o*/", "")
        .replace("google.visualization.Query.setResponse(", "")
        .slice(0, -2)
    );

    // Obtener encabezados y datos
    const headers = json.table.cols.map((col) => col.label);

    const rows = json.table.rows.map((row) =>
      row.c.map((cell) => (cell ? cell.v : null))
    );

    // Encontrar la posición de la columna "Nombre Completo"
    const nombreIndex = headers.indexOf("NOMBRE COMPLETO");
    if (nombreIndex === -1) {
      console.error("❌ No se encontró la columna 'Nombre Completo'");
      return;
    }

    // Buscar si el nombre existe en la lista
    const encontrado = rows.some(
      (row) =>
        row[nombreIndex] &&
        row[nombreIndex].toLowerCase() === nombreBuscado.toLowerCase()
    );

    if (encontrado) {
      console.log(
        `✅ El empleado "${nombreBuscado}" existe en la base de datos.`
      );
    } else {
      console.log(`❌ El empleado "${nombreBuscado}" NO está registrado.`);
    }
  } catch (error) {
    console.error("❌ Error al obtener los datos:", error.message);
  }
}

export const fetchNombres = async () => {
  try {
    // 1️⃣ Obtener datos del Excel desde el backend
    const response = await descargarYEnviarExcelPersonalDTI();

    // Verificar si la respuesta tiene la estructura correcta
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error("❌ Los datos obtenidos no son un array válido.");
      return [];
    }

    const dataExcel = response.data; // Extraemos el array de la respuesta

    console.log("📂 Datos obtenidos del backend:", dataExcel);

    // 2️⃣ Obtener encabezados desde el primer elemento del array
    const headers = Object.keys(dataExcel[0]); // Obtiene los nombres de las columnas

    // 3️⃣ Buscar índices de las columnas necesarias
    if (
      !headers.includes("NOMBRE COMPLETO") ||
      !headers.includes("DNI") ||
      !headers.includes("SEDE") ||
      !headers.includes("EMPRESA 2")
    ) {
      console.error(
        "❌ No se encontraron las columnas necesarias ('Nombre Completo', 'DNI', 'Sede', 'Empresa')"
      );
      return [];
    }

    // 4️⃣ Extraer y mapear los datos
    return dataExcel
      .map((row) => ({
        nombre: row["NOMBRE COMPLETO"],
        dni: row["DNI"],
        sede: row["SEDE"],
        empresa: row["EMPRESA 2"],
      }))
      .filter((persona) => persona.nombre && persona.dni) // Filtrar registros vacíos
      .map((persona) => ({
        value: persona.nombre,
        label: persona.nombre,
        dni: persona.dni,
        sede: persona.sede,
        empresa: persona.empresa,
      }));
  } catch (error) {
    console.error("❌ Error al obtener los datos:", error.message);
    return [];
  }
};

// Función para descargar y almacenar en storage del backend
export const descargarYEnviarExcelPersonalDTI = async () => {
  try {
    // 1️⃣ Descargar el archivo desde Google Sheets
    const response = await fetch(SHEET_URL);
    const blob = await response.blob();

    // 2️⃣ Crear FormData y adjuntar el archivo
    const formData = new FormData();
    formData.append("file", blob, "PersonalTI.xlsx");

    // 3️⃣ Enviar al backend
    const uploadResponse = await axios.post(
      `${API_URL}/api/v1/personal/upload-excel-personal`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("✅ Archivo enviado al backend:", uploadResponse.data);
    return uploadResponse.data; // ⬅ Retornar los datos procesados
  } catch (error) {
    console.error("❌ Error al enviar el archivo al backend:", error);
    return null;
  }
};
