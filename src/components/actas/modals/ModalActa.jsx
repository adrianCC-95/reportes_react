import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

import ActaEntregaPDF from "../../../reports/ActaEntrega";
import ActaDevolucionPDF from "../../../reports/ActaDevolucion";
import ActaPrestamoPDF from "../../../reports/ActaPrestamo";

const ModalActa = ({ modalOpen, toggleModal, formData, actaType }) => {
  const getPDFComponent = (prefijo) => {
    switch (prefijo) {
      case "AEC": // Acta de Entrega y Conformidad
        return ActaEntregaPDF;
      case "ADC": // Acta de Devolución
        return ActaDevolucionPDF;
      case "PRE": // Acta de Préstamo
        return ActaPrestamoPDF;
      default:
        return null; // Devuelve null si no hay coincidencia
    }
  };

  // Determinar el prefijo del acta
  const prefijo = actaType.prefijo ?? "AEC";
  const SelectedPDF = getPDFComponent(prefijo);

  return (
    <div>
      {/* Modal con Reactstrap */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Vista Previa del Acta</ModalHeader>
        <ModalBody>
          {SelectedPDF ? (
            <div className="h-96 overflow-auto border border-gray-300 rounded-lg">
              <PDFViewer width="100%" height="100%">
                <SelectedPDF formData={formData} />
              </PDFViewer>
            </div>
          ) : (
            <p>No se encontró una plantilla para este tipo de acta.</p>
          )}
        </ModalBody>
        <ModalFooter>
          {SelectedPDF && (
            <PDFDownloadLink
              document={<SelectedPDF formData={formData} />}
              fileName={`Acta_${actaType.nombre || "SinNombre"}_${
                formData.codigoDocumento || "0"
              }_${formData.nombreSolicitante || "N/A"}.pdf`}
            >
              {({ loading }) => (
                <Button color="success" disabled={loading}>
                  {loading ? "Generando PDF..." : "Descargar PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}

          <Button color="danger" onClick={toggleModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalActa;
