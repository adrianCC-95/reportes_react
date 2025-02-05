import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";

import logo from "../assets/logo-empresas.jpg";
import HelveticaRegular from "../assets/fonts/HelveticaforTarget.ttf";
import HelveticaBold from "../assets/fonts/HelveticaforTarget-Bold.ttf";

import OpenSansBold from "../assets/fonts/OpenSans-Bold.ttf";
import OpenSansRegular from "../assets/fonts/OpenSans-Regular.ttf";

// Registrar las fuentes
Font.register({
  family: "Helvetica",
  fonts: [
    { src: HelveticaRegular, fontWeight: "normal" },
    { src: HelveticaBold, fontWeight: 700 },
  ],
});

Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: OpenSansRegular,
      fontWeight: 400,
    },
    {
      src: OpenSansBold,
      fontWeight: 700,
    },
  ],
});

// Estilos para el documento
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "OpenSans",
  },
  logo: {
    width: 200,
    height: "auto",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
    marginVertical: 10,
  },
  header: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
    marginVertical: 10,
  },
  listItem: {
    marginBottom: 5,
  },

  tableTitle: {
    fontSize: 10,
    marginBottom: 8,
    textAlign: "left",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 8,
    textAlign: "left",
    borderRightWidth: 1,
    borderColor: "#000",
    flexWrap: "wrap", // Permitir ajuste de texto
    overflow: "hidden", // Evitar desbordamiento
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
  },

  // FIMAS FOOTER

  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  signatureBlock: {
    width: "45%", // Cada bloque ocupa la mitad del ancho disponible
    textAlign: "center",
  },
  signatureLine: {
    marginBottom: 10,
    borderTopWidth: 1,
    borderColor: "#000",
    width: "100%",
    textAlign: "center",
  },
  signatureText: {
    fontSize: 10,
    textAlign: "center",
  },

  textParrafo: {
    textAlign: "justify", // Justificar el texto
    lineHeight: 1.6, // Espaciado entre líneas para mejor legibilidad
  },

  bold: {
    fontFamily: "OpenSans",
    fontWeight: 700,
  },

  // Anchos personalizados
  column1: {
    flex: 0.5, // Más estrecha
    width: "5%", // Ancho fijo
  },
  column2: {
    flex: 2, // Más ancha
    width: "20%", // Ancho fijo
  },
  column3: {
    flex: 1, // Tamaño estándar
    width: "15%", // Ancho fijo
  },

  observationsTitle: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "left",
  },
  observationsField: {
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 8,
  },
  line: {
    fontSize: 10,
    color: "#000",
    marginBottom: 4,
  },
});

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

  // Retornar la fecha formateada
  return `a los ${parseInt(dia, 10)} días del mes de ${nombreMes} del ${año}`;
};

export default function ActaPDF({ formData }) {
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
  } = formData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con logo */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src={logo} // Reemplaza con la URL o import del logo
          />
          <Text style={[styles.title, styles.bold]}>ACTA DE PRESTAMO</Text>
        </View>

        {/* Observaciones */}
        <View style={styles.section}>
          <Text style={styles.observationsTitle}>Observaciones:</Text>
          <View style={styles.observationsField}>
            {[...Array(3)].map((_, index) => (
              <Text key={index} style={styles.line}>
                {"_".repeat(125)}
              </Text>
            ))}
          </View>
        </View>

        {/* Footer con firmas */}
        <View style={styles.section}>
          <View style={styles.signatures}>
            {/* Encargado */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLine} />
              <Text style={[styles.signatureText, styles.bold]}>
                {nombreEncargado}
              </Text>
              <Text style={[styles.signatureText, styles.bold]}>
                {cargoEncargado}
              </Text>
            </View>
            {/* Solicitante */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLine} />
              <Text style={[styles.signatureText, styles.bold]}>
                {nombreSolicitante}
              </Text>
              <Text style={[styles.signatureText, styles.bold]}>
                {numeroDocumento}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
