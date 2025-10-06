import {
  AlignmentType,
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Paragraph,
  TextRun,
  BorderStyle,
} from "docx";

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

  const diaHoy = parseInt(dia, 10);
  const mesHoy = nombreMes;
  const yearHoy = año;
  // Retornar la fecha formateada
  // return `a los ${parseInt(dia, 10)} días del mes de ${nombreMes} del ${año}`;
  return { diaHoy, mesHoy, yearHoy };
};

const generateActaEntrega = async ({ formData }) => {
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
    codigoDocumento,
  } = formData;

  // Función para generar el archivo Word

  const tableRows = [];

  // Agregar encabezados de la tabla
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "NOMBRE",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "MARCA",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "MODELO",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "COLOR",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "SERIE",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "PRECIO",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "CODIGO",
                  bold: true,
                  size: 16, // Tamaño de fuente
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 5,
            },
          },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
      ],
    })
  );

  // Verificar si hay equipos y agregar filas
  if (equipos.length === 0) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun("No hay registros de equipos")],
                alignment: AlignmentType.CENTER,
              }),
            ],
            columnSpan: 7,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },

            margins: { top: 80, bottom: 80, left: 80, right: 80 },
          }),
        ],
      })
    );
  } else {
    equipos.forEach((equipo) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.nombre,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.marca,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.modelo,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.color,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.serie,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.precio,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: equipo.codigo,
                      bold: false,
                      size: 18, // Tamaño de fuente
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                left: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
                right: {
                  style: BorderStyle.SINGLE,
                  size: 5,
                },
              },
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
            }),
          ],
        })
      );
    });
  }

  // observaciones
  const singleColumnTable = new Table({
    rows: Array(5)
      .fill(null)
      .map(
        (_, index) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "",
                        size: 24, // Tamaño del texto
                      }),
                    ],
                    alignment: AlignmentType.CENTER, // Centrado del texto
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              }),
            ],
          })
      ),
    width: {
      size: 100,
      type: WidthType.PERCENTAGE, // Ancho de la tabla como porcentaje
    },
  });

  // firmas
  const firmaTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "______________________________",
                    bold: true,
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER, // Centrado
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: nombreEncargado,
                    bold: true,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: cargoEncargado,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE, size: 0 },
              bottom: { style: BorderStyle.NONE, size: 0 },
              left: { style: BorderStyle.NONE, size: 0 },
              right: { style: BorderStyle.NONE, size: 0 },
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "______________________________",
                    bold: true,
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER, // Centrado
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: nombreSolicitante,
                    bold: true,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: tipoDocumento + " " + numeroDocumento,
                    size: 18,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE, size: 0 },
              bottom: { style: BorderStyle.NONE, size: 0 },
              left: { style: BorderStyle.NONE, size: 0 },
              right: { style: BorderStyle.NONE, size: 0 },
            },
          }),
        ],
      }),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
    },
  });

  // Crear el contenido del documento
  const doc = new Document({
    sections: [
      {
        // headers: {
        //   default: new Header({
        //     children: [
        //       new Paragraph({
        //         children: [
        //           new ImageRun({
        //             data: imageBuffer, // El buffer de la imagen
        //             transformation: {
        //               width: 200, // Ancho en puntos
        //               height: 100, // Alto en puntos
        //             },
        //           }),
        //         ],
        //       }),
        //     ],
        //   }),
        // },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `ACTA DE RECEPCION Y CONFORMIDAD ${codigoDocumento}`,
                bold: true,
                size: 24, // Tamaño de fuente
                underline: {}, // Agregar subrayado
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Espacio en blanco
          new Paragraph({
            children: [
              new TextRun({
                text: "En",
                size: 20,
              }),
              new TextRun({
                text: ` ${sede}, `,
                size: 20,
                bold: true,
              }),
              new TextRun({
                text: "a los ",
                size: 20,
              }),
              new TextRun({
                text: `${formatFecha(fechaEntrega).diaHoy}`,
                size: 20,
                bold: true,
              }),
              new TextRun({
                text: " días del mes de ",
                size: 20,
              }),
              new TextRun({
                text: `${formatFecha(fechaEntrega).mesHoy}`,
                size: 20,
                bold: true,
              }),
              new TextRun({
                text: " del ",
                size: 20,
              }),
              new TextRun({
                text: `${formatFecha(fechaEntrega).yearHoy}`,
                size: 20,
                bold: true,
              }),
              new TextRun({
                text: ", declaro recibir a plena conformidad lo siguiente: ",
                size: 20,
              }),
              // new TextRun(`\nCódigo Documento: ${formData.codigoDocumento}`),
              // new TextRun(`\nÁrea Responsable: ${formData.areaResponsable}`),
              // new TextRun(
              //   `\nNombre de la Empresa: ${formData.nombreEmpresa}`
              // ),
            ],
            alignment: AlignmentType.JUSTIFIED, // Alineación justificada
          }),
          new Paragraph({ text: "" }), // Espacio en blanco
          new Paragraph({
            children: [
              new TextRun({
                text: "EQUIPOS ASIGNADOS",
                bold: true,
                size: 20, // Tamaño del texto
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Espacio en blanco
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
          }),

          new Paragraph({ text: "" }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Yo, ",
                size: 20,
                bold: false,
              }),
              new TextRun({
                text: nombreSolicitante,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: " identificado con ",
                bold: false,
                size: 20,
              }),
              new TextRun({
                text: tipoDocumento + " " + numeroDocumento,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: ", declaro y asumo plena responsabilidad por el uso y cuidado de los equipos, los cuales recibo en buen estado, plenamente operativos y sin ningún daño. Asimismo, señalo que dichos bienes serán destinados exclusivamente al desarrollo y cumplimiento de las labores encomendadas por la empresa ",
                size: 20,
              }),
              new TextRun({
                text: nombreEmpresa,
                bold: true,
                size: 20,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED, // Alineación justificada
          }),

          new Paragraph({ text: "" }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Me comprometo a devolver todos los equipos debidamente inventariados y sin mayor deterioro que el derivado de un uso razonable por las labores realizadas, al área de ",
                size: 20,
                bold: false,
              }),
              new TextRun({
                text: areaResponsable,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: ", en la fecha que se me indique o al culminar mi contrato de prestación de servicios.",
                bold: false,
                size: 20,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED, // Alineación justificada
          }),

          new Paragraph({ text: "" }),

          new Paragraph({
            children: [
              new TextRun({
                text: "En caso de pérdida, robo, deterioro o daño imputable a mi responsabilidad, autorizo de manera expresa, previa e irrevocable a la empresa ",
                size: 20,
                bold: false,
              }),
              new TextRun({
                text: nombreEmpresa,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: " a efectuar el descuento proporcional o total del valor de los bienes asignados (considerando la depreciación correspondiente) en mi planilla de remuneraciones, compensación por tiempo de servicios (CTS), liquidación de beneficios sociales u otros conceptos que pudieran corresponderme, hasta cubrir el monto del perjuicio ocasionado, sin perjuicio de las acciones legales que pudieran iniciarse.",
                bold: false,
                size: 20,
              }),
            ],
            alignment: AlignmentType.JUSTIFIED, // Alineación justificada
          }),

          new Paragraph({ text: "" }),

          new Paragraph({
            children: [
              new TextRun({
                text: " Observaciones del trabajador (",
                size: 20,
                bold: false,
              }),
              new TextRun({
                text: nombreSolicitante,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: "):",
                bold: false,
                size: 20,
              }),
            ],
          }),

          new Paragraph({ text: "" }),
          singleColumnTable, // Agregar la tabla al documento
          new Paragraph({
            text: "", // Espacio para separar la tabla de firmas
            spacing: { after: 1400 },
          }),
          firmaTable, // Agregar tabla de firmas al final
        ],
      },
    ],
  });

  return Packer.toBlob(doc); // Devuelve el Blob del documento
};

export default generateActaEntrega;
