import axios from "axios";
import CryptoJS from "crypto-js";
import { apiSecret } from "../../config/serviciosUrl";
import apiUrl from "../../config/serviciosUrl";
const API_URL = apiUrl;
const API_SECRET_KEY = apiSecret; // Asegúrate de que sea la misma que en el backend

export const generateSignature = () => {
  const timestamp = Date.now().toString();
  const signature = CryptoJS.HmacSHA256(timestamp, API_SECRET_KEY).toString(
    CryptoJS.enc.Hex
  );

  return { timestamp, signature };
};

export const getActasNombres = async (carpeta) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/nextcloud/listar-archivos?carpeta=${carpeta}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al traer los archivos:", error);
    throw error; // Lanzar el error para que el frontend lo detecte
  }
};

export const saveActaNextcloud = async (blob, nombreArchivo, pathFolder) => {
  try {
    const { timestamp, signature } = generateSignature();
    const formData = new FormData();
    formData.append("file", blob, nombreArchivo); // Adjuntar el Blob como archivo Word
    formData.append("filename", nombreArchivo); // Enviar el nombre como campo adicional
    formData.append("subFolderPath", pathFolder);

    const response = await axios.post(
      `${API_URL}/api/v1/nextcloud/upload-file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error en Nextcloud: ${response.statusText}`);
    }

    console.log("✅ Archivo guardado:", response.data);
    return response.data; // Devolver la respuesta si todo está bien
  } catch (error) {
    console.error("❌ Error al enviar el archivo:", error);
    throw error; // Lanzar el error para que el frontend lo detecte
  }
};
