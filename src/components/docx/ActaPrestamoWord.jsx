import { Document, Packer, Paragraph, TextRun } from "docx";

const generateActaPrestamo = () => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Acta de Préstamo",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            text: "Este documento es un acta de préstamo generada automáticamente.",
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc); // Devuelve el Blob del documento
};

export default generateActaPrestamo;
