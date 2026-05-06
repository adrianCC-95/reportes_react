import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

Font.register({
  family: "Calibri",
  fonts: [
    { src: "/fonts/calibri.ttf" },
    { src: "/fonts/calibri-bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: "Calibri",
  },

  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 15,
    fontFamily: "Calibri",
    fontWeight: "bold",
  },

  section: {
    marginBottom: 6,
    textAlign: "justify",
    fontSize: 11,
    fontFamily: "Calibri",
  },

  subtitle: {
    // marginTop: 6,
    // marginBottom: 6,
    fontSize: 11,
    fontFamily: "Calibri",
    fontWeight: "bold",
  },

  bold: {
    fontFamily: "Calibri",
    fontWeight: "bold",
  },

  table: {
    display: "table",
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },

  row: {
    flexDirection: "row",
  },

  headerCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    fontSize: 9,
    fontFamily: "Calibri",
    fontWeight: "bold",
    backgroundColor: "#EDEDED",
    textAlign: "center",
  },

  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    fontSize: 9,
    fontFamily: "Calibri",
    textAlign: "center",
  },

  firmaContainer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  firmaBox: {
    width: "40%",
    textAlign: "center",
  },

  firmaLinea: {
    marginTop: 40,
    borderTopWidth: 1,
    paddingTop: 5,
    fontSize: 11,
    fontFamily: "Calibri",
  },
  observacionesContainer: {
    marginTop: 10,
    marginBottom: 20,
  },

  lineaObservacion: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 5,
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

  const [anio, mes, dia] = fechaString.split("-");
  return {
    dia,
    mes: meses[parseInt(mes, 10) - 1],
    anio,
  };
};

const ActaDevolucionPDF = ({ formData }) => {
  const fecha = formatFecha(formData.fechaEntrega);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/assets/images/cableclub.png" style={styles.logo} />

        <Text style={styles.title}>
          ACTA DE DEVOLUCIÓN Y CONFORMIDAD{" "}
          <Text style={styles.bold}>{formData.codigoDocumento}</Text>
        </Text>

        <Text style={styles.section}>
          En <Text style={styles.bold}>{formData.sede}</Text>, a los{" "}
          <Text style={styles.bold}>{fecha.dia}</Text> días del mes de{" "}
          <Text style={styles.bold}>{fecha.mes}</Text> del{" "}
          <Text style={styles.bold}>{fecha.anio}</Text>, se deja constancia de
          la devolución de los equipos asignados a{" "}
          <Text style={styles.bold}>{formData.nombreSolicitante}</Text>,
          identificado con DNI{" "}
          <Text style={styles.bold}>{formData.numeroDocumento}</Text>, quien
          declara lo siguiente:
        </Text>

        <Text style={styles.subtitle}>EQUIPOS DEVUELTOS</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>NOMBRE</Text>
            <Text style={styles.headerCell}>MARCA</Text>
            <Text style={styles.headerCell}>MODELO</Text>
            <Text style={styles.headerCell}>COLOR</Text>
            <Text style={styles.headerCell}>SERIE</Text>
            <Text style={styles.headerCell}>PRECIO</Text>
            <Text style={styles.headerCell}>CODIGO</Text>
          </View>

          {formData.equipos?.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.bold]}>{item.nombre}</Text>
              <Text style={[styles.cell, styles.bold]}>{item.marca}</Text>
              <Text style={[styles.cell, styles.bold]}>{item.modelo}</Text>
              <Text style={[styles.cell, styles.bold]}>{item.color}</Text>
              <Text style={[styles.cell, styles.bold]}>{item.serie}</Text>
              <Text style={[styles.cell, styles.bold]}>{item.precio}</Text>
              <Text style={[styles.cell, styles.bold]}>{item.codigo}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>
          Declaro que los equipos proporcionados por la Oficina de{" "}
          <Text style={styles.bold}>{formData.areaResponsable}</Text>, se
          encuentran plenamente operativos y sin daños, excepto aquellos
          previamente señalados en el acta de entrega.
        </Text>

        <Text style={styles.section}>
          Asimismo, asumo plena responsabilidad por el uso y cuidado de los
          equipos durante el período en que estuvieron bajo mi custodia,
          garantizando que dichos bienes fueron utilizados exclusivamente para
          el desarrollo y cumplimiento de mis labores dentro de la empresa{" "}
          <Text style={styles.bold}>{formData.nombreEmpresa}</Text>.
        </Text>

        <Text style={styles.section}>
          En la presente fecha, procedo a la devolución de todos los equipos
          debidamente inventariados, sin mayor deterioro que el uso razonable
          conforme a mis funciones.
        </Text>

        <Text style={styles.section}>
          Las observaciones por parte de{" "}
          <Text style={styles.bold}>{formData.areaResponsable}</Text> son las
          siguientes:
        </Text>

        <View style={styles.observacionesContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.lineaObservacion} />
          ))}
        </View>

        <View style={styles.firmaContainer}>
          <View style={styles.firmaBox}>
            <Text style={styles.firmaLinea}>
              <Text style={styles.bold}>{formData.nombreEncargado}</Text>
              {"\n"}
              {formData.cargoEncargado}
            </Text>
          </View>
          <View style={styles.firmaBox}>
            <Text style={styles.firmaLinea}>
              <Text style={styles.bold}>{formData.nombreSolicitante}</Text>
              {"\n"}DNI: {formData.numeroDocumento}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ActaDevolucionPDF;
