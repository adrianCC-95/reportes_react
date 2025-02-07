import axios from "axios";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Lu1nJ-hXTHgmrcwYzsli5D5MW63GYflSzQboXbHzUXs/gviz/tq?tqx=out:json";

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
    const response = await axios.get(SHEET_URL);
    const text = response.data;

    // Limpiar JSON de Google Sheets
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

    // Encontrar índices de las columnas
    const nombreIndex = headers.indexOf("NOMBRE COMPLETO");
    const dniIndex = headers.indexOf("DNI");
    const sedeIndex = headers.indexOf("SEDE");
    const empresaIndex = headers.indexOf("EMPRESA");

    if (
      nombreIndex === -1 ||
      dniIndex === -1 ||
      sedeIndex === -1 ||
      empresaIndex === -1
    ) {
      console.error(
        "No se encontraron las columnas necesarias ('Nombre Completo', 'DNI', 'Sede', 'Empresa')"
      );
      return [];
    }

    // Extraer nombres y datos asociados
    return rows
      .map((row) => ({
        nombre: row[nombreIndex],
        dni: row[dniIndex],
        sede: row[sedeIndex],
        empresa: row[empresaIndex],
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
    console.error("Error al obtener los datos:", error.message);
    return [];
  }
};
