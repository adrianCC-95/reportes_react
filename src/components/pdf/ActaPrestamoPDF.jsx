import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
    textAlign: "justify",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 8,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 8,
    marginBottom: 12,
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
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    fontSize: 9,
  },
  bullet: {
    marginLeft: 15,
    marginBottom: 4,
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

const ActaPrestamoPDF = ({ formData }) => {
  const fecha = formatFecha(formData.fechaEntrega);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          ACTA DE PRÉSTAMO N° {formData.codigoDocumento}
        </Text>

        <Text style={styles.section}>
          En {formData.sede}, a los {fecha.dia} días del mes de {fecha.mes} del{" "}
          {fecha.anio}, se deja constancia del préstamo de los siguientes
          equipos:
        </Text>

        <Text style={styles.subtitle}>DATOS DEL TRABAJADOR</Text>

        <Text style={styles.section}>
          Yo, {formData.nombreSolicitante}, identificado con DNI{" "}
          {formData.numeroDocumento}, declaro recibir en calidad de PRÉSTAMO los
          siguientes equipos:
        </Text>

        <Text style={styles.subtitle}>EQUIPOS PRESTADOS</Text>

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
              <Text style={styles.cell}>{item.nombre}</Text>
              <Text style={styles.cell}>{item.marca}</Text>
              <Text style={styles.cell}>{item.modelo}</Text>
              <Text style={styles.cell}>{item.color}</Text>
              <Text style={styles.cell}>{item.serie}</Text>
              <Text style={styles.cell}>{item.precio}</Text>
              <Text style={styles.cell}>{item.codigo}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.subtitle}>CONDICIONES DEL PRÉSTAMO</Text>

        <Text style={styles.section}>El presente préstamo se realiza por:</Text>

        <Text style={styles.bullet}>
          ☐_ Tiempo determinado: desde __________ hasta __________
        </Text>

        <Text style={styles.bullet}>☐_ Tiempo indeterminado</Text>

        <Text style={styles.section}>
          Los equipos son entregados en buen estado, operativos y sin daños
          visibles, comprometiéndome a:
        </Text>

        <Text style={styles.bullet}>
          • Usarlos exclusivamente para labores de la empresa{" "}
          {formData.nombreEmpresa}
        </Text>

        <Text style={styles.bullet}>
          • Mantenerlos en buen estado de conservación
        </Text>

        <Text style={styles.bullet}>
          • Devolverlos cuando se me solicite o al término del motivo que
          originó el préstamo
        </Text>

        <Text style={styles.subtitle}>RESPONSABILIDAD</Text>

        <Text style={styles.section}>
          En caso de pérdida, robo, deterioro o daño atribuible a mi persona,
          autorizo de manera expresa a la empresa a realizar el descuento
          correspondiente, considerando la depreciación del bien, en mis
          remuneraciones, CTS, liquidación u otros conceptos, sin perjuicio de
          acciones legales.
        </Text>

        <Text style={styles.subtitle}>OBSERVACIONES</Text>

        <Text style={styles.section}>
          _________________________________________________
        </Text>

        <View style={styles.firmaContainer}>
          <View style={styles.firmaBox}>
            <Text style={styles.firmaLinea}>Firma del trabajador</Text>
          </View>

          <View style={styles.firmaBox}>
            <Text style={styles.firmaLinea}>Firma del responsable</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ActaPrestamoPDF;
