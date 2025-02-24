import * as XLSX from "xlsx";
import axios from "axios";
import Dexie from "dexie";
import stringSimilarity from "string-similarity";

const INVENTORY_FILE = "/assets/data/inventario.xlsx";

const FILE_URL =
  "https://docs.google.com/spreadsheets/d/1oouGGiRlGhJeMiHBr-Hdbv6q54YI_jmgGsv6KQcz2Bs/export?format=xlsx";

// Configurar IndexedDB con Dexie
const db = new Dexie("ExcelDatabase");
db.version(1).stores({
  files: "name, data",
});

// export const fetchInventoryDataEquipos = async (sheetName = "Equipos") => {
//   try {
//     // Cargar el archivo desde assets
//     const response = await fetch(INVENTORY_FILE);
//     const arrayBuffer = await response.arrayBuffer();

//     // Leer el archivo Excel
//     const workbook = XLSX.read(arrayBuffer, { type: "array" });

//     // Verificar si la hoja existe
//     if (!workbook.Sheets[sheetName]) {
//       throw new Error(`❌ La hoja "${sheetName}" no existe en el archivo.`);
//     }

//     // Convertir la hoja de Excel a JSON
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     return data;
//   } catch (error) {
//     console.error("❌ Error al cargar la hoja de Excel:", error);
//     return [];
//   }
// };

export const fetchInventoryDataEquipos = async (sheetName = "Equipos") => {
  try {
    let storedFile = await db.files.get("inventario.xlsx");

    if (!storedFile) {
      console.log("📂 No se encontró el archivo en IndexedDB, descargando...");
      await fetchAndStoreExcel();
      storedFile = await db.files.get("inventario.xlsx"); // Volver a obtenerlo después de guardarlo
    }

    if (!storedFile)
      throw new Error(`❌ No se pudo obtener el archivo desde IndexedDB.`);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Verificar si la hoja existe
        if (!workbook.Sheets[sheetName]) {
          reject(
            new Error(`❌ La hoja "${sheetName}" no existe en el archivo.`)
          );
          return;
        }

        // Convertir la hoja a JSON
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        resolve(jsonData);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(storedFile.data);
    });
  } catch (error) {
    console.error("❌ Error al cargar la hoja de Excel:", error);
    return [];
  }
};

// Función para cargar datos del inventario desde la carpeta public
// export const fetchInventoryData = async () => {
//   try {
//     const response = await fetch(INVENTORY_FILE);
//     const blob = await response.blob();

//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet);

//         resolve(jsonData);
//       };

//       reader.onerror = (error) => reject(error);
//       reader.readAsArrayBuffer(blob);
//     });
//   } catch (error) {
//     console.error("❌ Error leyendo el archivo Excel:", error);
//     return [];
//   }
// };

// Función para obtener los datos del inventario desde el navegador db
export const fetchInventoryData = async () => {
  try {
    let storedFile = await db.files.get("inventario.xlsx");

    if (!storedFile) {
      console.log("📂 No se encontró el archivo en IndexedDB, descargando...");
      await descargarYGuardarExcel();
      storedFile = await db.files.get("inventario.xlsx"); // Volver a obtenerlo después de guardarlo
    }

    if (!storedFile)
      throw new Error("❌ No se pudo obtener el archivo desde IndexedDB.");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Puedes cambiarlo si necesitas otra hoja
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(storedFile.data);
    });
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

// Función para descargar y almacenar en IndexedDB
export const descargarYGuardarExcel = async () => {
  try {
    const response = await fetch(FILE_URL);
    const blob = await response.blob();
    await db.files.put({ name: "inventario.xlsx", data: blob });
    console.log("✅ Archivo Excel guardado en IndexedDB.");
    return true;
  } catch (error) {
    console.error("❌ Error al descargar y almacenar el archivo:", error);
  }
};
