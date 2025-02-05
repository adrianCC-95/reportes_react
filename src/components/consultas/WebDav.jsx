import { createClient } from "webdav";

const client = createClient(
  "http://200.4.244.22:801/remote.php/dav/files/ahuanacuni",
  {
    username: "ahuanacuni",
    password: "$$NxCloud2024",
  }
);

try {
  // Verifica la conexión
  const exists = await client.exists("/");
  if (!exists) {
    console.error(
      "No se pudo conectar al servidor. Verifica las credenciales o la URL."
    );
  } else {
    console.log("Conexión exitosa con Nextcloud.");
  }
} catch (error) {
  console.error("Error al conectar con Nextcloud:", error.message);
}

const getFile = async (fileContent, fileName) => {
  try {
    // Sube el archivo al servidor Nextcloud
    const directoryItems = await client.getDirectoryContents("/");
    console.log("Archivo subido exitosamente", directoryItems);
  } catch (error) {
    console.error("Error al subir archivo:", error);
  }
};

const listDocuments = async (folderPath = "/Actas/") => {
  try {
    // Validar que folderPath sea una cadena
    if (typeof folderPath !== "string") {
      throw new Error("El parámetro folderPath debe ser una cadena.");
    }

    // Listar los contenidos de la carpeta
    const files = await client.getDirectoryContents(folderPath);
    console.log("Archivos en la carpeta:", files);
    return files;
  } catch (error) {
    console.error("Error al listar documentos:", error.message);
  }
};
export { getFile, listDocuments };
