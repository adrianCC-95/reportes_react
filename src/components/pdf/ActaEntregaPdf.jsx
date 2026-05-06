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

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 11,
//     lineHeight: 1.5,
//     fontFamily: "Helvetica",
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 14,
//     marginBottom: 20,
//     fontFamily: "Helvetica-Bold",
//   },
//   section: {
//     marginBottom: 12,
//     textAlign: "justify",
//   },
//   subtitle: {
//     marginTop: 10,
//     marginBottom: 8,
//     fontFamily: "Helvetica-Bold",
//   },
//   bold: {
//     fontFamily: "Helvetica-Bold",
//   },
//   table: {
//     display: "table",
//     width: "100%",
//     marginTop: 8,
//     marginBottom: 12,
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#000",
//   },
//   row: {
//     flexDirection: "row",
//   },
//   headerCell: {
//     flex: 1,
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     padding: 4,
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//   },
//   cell: {
//     flex: 1,
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     padding: 4,
//     fontSize: 9,
//   },
//   firmaContainer: {
//     marginTop: 50,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   firmaBox: {
//     width: "40%",
//     textAlign: "center",
//   },
//   firmaLinea: {
//     marginTop: 40,
//     borderTopWidth: 1,
//     paddingTop: 5,
//   },
// });
Font.register({
  family: "Calibri",
  fonts: [
    {
      src: "/fonts/calibri-regular.ttf",
    },
    {
      src: "/fonts/calibri-bold.ttf",
      fontWeight: "bold",
    },
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

const ActaRecepcionPDF = ({ formData }) => {
  const fecha = formatFecha(formData.fechaEntrega);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/assets/images/cableclub.png" style={styles.logo} />
        <Text style={styles.title}>
          ACTA DE RECEPCIÓN Y CONFORMIDAD{" "}
          <Text style={styles.bold}>{formData.codigoDocumento}</Text>
        </Text>

        <Text style={styles.section}>
          En <Text style={styles.bold}>{formData.sede}</Text>, a los{" "}
          <Text style={styles.bold}>{fecha.dia}</Text> días del mes de{" "}
          <Text style={styles.bold}>{fecha.mes}</Text> del{" "}
          <Text style={styles.bold}>{fecha.anio}</Text>, declaro recibir a plena
          conformidad lo siguiente:
        </Text>

        <Text style={styles.subtitle}>EQUIPOS ASIGNADOS</Text>

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
              <Text style={[styles.cell]}>{item.nombre}</Text>
              <Text style={[styles.cell]}>{item.marca}</Text>
              <Text style={[styles.cell]}>{item.modelo}</Text>
              <Text style={[styles.cell]}>{item.color}</Text>
              <Text style={[styles.cell]}>{item.serie}</Text>
              <Text style={[styles.cell]}>{item.precio}</Text>
              <Text style={[styles.cell]}>{item.codigo}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>
          Yo, <Text style={styles.bold}>{formData.nombreSolicitante}</Text>{" "}
          identificado con DNI{" "}
          <Text style={styles.bold}>{formData.numeroDocumento}</Text>, declaro y
          asumo plena responsabilidad por el uso y cuidado de los equipos, los
          cuales recibo en buen estado, plenamente operativos y sin ningún daño.
          Asimismo, señalo que dichos bienes serán destinados exclusivamente al
          desarrollo y cumplimiento de las labores encomendadas por la empresa{" "}
          <Text style={styles.bold}>{formData.nombreEmpresa}</Text>.
        </Text>

        <Text style={styles.section}>
          Me comprometo a devolver todos los equipos debidamente inventariados y
          sin mayor deterioro que el derivado de un uso razonable por las
          labores realizadas, al área de{" "}
          <Text style={styles.bold}>{formData.areaResponsable}</Text>, en la
          fecha que se me indique o al culminar mi contrato de prestación de
          servicios.
        </Text>

        <Text style={styles.section}>
          En caso de pérdida, robo, deterioro o daño imputable a mi
          responsabilidad, autorizo de manera expresa, previa e irrevocable a la
          empresa <Text style={styles.bold}>{formData.nombreEmpresa}</Text> a
          efectuar el descuento proporcional o total del valor de los bienes
          asignados (considerando la depreciación correspondiente) en mi
          planilla de remuneraciones, compensación por tiempo de servicios
          (CTS), liquidación de beneficios sociales u otros conceptos que
          pudieran corresponderme, hasta cubrir el monto del perjuicio
          ocasionado, sin perjuicio de las acciones legales que pudieran
          iniciarse.
        </Text>

        <Text style={styles.section}>
          Observaciones del trabajador (
          <Text style={styles.bold}>{formData.nombreSolicitante}</Text>):
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

export default ActaRecepcionPDF;
