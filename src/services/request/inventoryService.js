import axios from "axios";
import apiUrl from "../../config/serviciosUrl";

//const INVENTORY_FILE = "/assets/data/inventario.xlsx";
const API_URL = apiUrl;

const FILE_URL =
  "https://docs.google.com/spreadsheets/d/1oouGGiRlGhJeMiHBr-Hdbv6q54YI_jmgGsv6KQcz2Bs/export?format=xlsx";

// Axios backend https endpoint
export const fetchExcelData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/inventario/excel-data`);

    return await response.data;
  } catch (error) {
    console.error("❌ Error al obtener datos del Excel:", error);
    return [];
  }
};

export const fetchInventoryDataEquipos = async (sheetName = "Equipos") => {
  try {
    let storedFile = await fetchExcelData();

    if (!storedFile) {
      console.log("📂 No se encontró el archivo ...");
      await descargarYEnviarExcel();
      storedFile = await fetchExcelData(); // Volver a obtenerlo después de guardarlo
    }

    if (!storedFile)
      throw new Error("❌ No se pudo obtener el archivo desde el servidor.");

    return storedFile.data.jsonDataEquipos; // Si el JSON tiene una estructura como { jsonData: [...], jsonDataEquipos: }
  } catch (error) {
    console.error("❌ Error al cargar la hoja de Excel:", error);
    return [];
  }
};

// Función para obtener los datos del inventario
export const fetchInventoryData = async () => {
  try {
    let storedFile = await fetchExcelData();

    if (!storedFile) {
      console.log("📂 No se encontró el archivo ...");
      await descargarYEnviarExcel();
      storedFile = await fetchExcelData(); // Volver a obtenerlo después de guardarlo
    }

    if (!storedFile)
      throw new Error("❌ No se pudo obtener el archivo desde el servidor.");

    return storedFile.data.jsonData; // Si el JSON tiene una estructura como { jsonData: [...], jsonDataEquipos: }
  } catch (error) {
    console.error("❌ Error leyendo el archivo Excel:", error);
    return [];
  }
};

// Normaliza nombres (quita tildes, mayúsculas y caracteres especiales)
const normalize = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Función para calcular la similitud basada en palabras individuales
const calcularSimilitud = (nombreCompleto, asignacion) => {
  const palabrasNombre = new Set(normalize(nombreCompleto).split(" "));
  const palabrasAsignacion = new Set(normalize(asignacion).split(" "));

  // Contamos cuántas palabras coinciden
  const coincidencias = [...palabrasNombre].filter((word) =>
    palabrasAsignacion.has(word)
  ).length;

  // Calculamos la similitud basada en el porcentaje de palabras coincidentes
  const totalPalabras = Math.max(palabrasNombre.size, palabrasAsignacion.size);
  return coincidencias / totalPalabras;
};

// Función para buscar equipos con coincidencia flexible de nombres
export const fetchInventoryByPersonal = async (nombreCompleto) => {
  const data = await fetchInventoryData();
  const dataEquipos = await fetchInventoryDataEquipos();

  const UMBRAL_SIMILITUD = 0.5; // Definir umbral mínimo de similitud

  const coincidencias = data.filter((item) => {
    if (item["ASIGNACION"]) {
      const similitud = calcularSimilitud(nombreCompleto, item["ASIGNACION"]);
      return similitud >= UMBRAL_SIMILITUD;
    }
    return false;
  });

  const coincidenciasEquipos = dataEquipos.filter((item) => {
    if (item["ASIGNACION"]) {
      const similitud = calcularSimilitud(nombreCompleto, item["ASIGNACION"]);
      return similitud >= UMBRAL_SIMILITUD;
    }
    return false;
  });

  const formatCoincidencias = coincidencias.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));

  const formatCoincidenciasEquipo = coincidenciasEquipos.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));
  console.log(
    `🔍 Coincidencias encontradas en la hoja -Inventario 2024- para ${nombreCompleto}:`,
    formatCoincidencias
  );

  console.log(
    `🔍 Coincidencias encontradas en la hoja -Equipos- para ${nombreCompleto}:`,
    formatCoincidenciasEquipo
  );

  return [formatCoincidencias, formatCoincidenciasEquipo];
};

// Función para descargar y almacenar el inventario excel
export const descargarYEnviarExcel = async () => {
  try {
    // 1️⃣ Descargar el archivo desde Google Sheets
    const response = await fetch(FILE_URL);
    const blob = await response.blob();

    // 2️⃣ Crear FormData y adjuntar el archivo
    const formData = new FormData();
    formData.append("file", blob, "inventario.xlsx");

    // 3️⃣ Enviar al backend
    const uploadResponse = await axios.post(
      `${API_URL}/api/v1/inventario/upload-excel`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("✅ Archivo enviado al backend:", uploadResponse.data);
  } catch (error) {
    console.error("❌ Error al enviar el archivo al backend:", error);
  }
};
