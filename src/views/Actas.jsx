import React, { useEffect, useState } from "react";
import Select from "react-select";

import { useLocation, useNavigate } from "react-router-dom";
//import ModalActa from "../components/actas/modals/ModalActa";
import GenerateWord from "../components/docx/GenerateWordActa";
//import { Button } from "reactstrap";
import { fetchNombres } from "../services/request/apiExcel";

function Actas() {
  const location = useLocation();
  const navigate = useNavigate();
  const [nombres, setNombres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar si hay datos, si no, regresar al menú de actas
  useEffect(() => {
    if (!location.state) {
      navigate("/"); // Redirige al menú si no hay datos
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null; // No renderiza nada mientras redirige
  }

  const { actaType, year, serialNumber, category } = location.state || {};

  // Cargar datos guardados en localStorage
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("formData")) || {};
    return {
      sede: "ILO",
      fechaEntrega: new Date().toISOString().split("T")[0],
      codigoDocumento: "",
      areaResponsable: "TECNOLOGIAS DE LA INFORMACION",
      nombreEmpresa: savedData.nombreEmpresa || "EFICIENT FAST SAC",
      nombreSolicitante:
        savedData.nombreSolicitante || "JUAN CARLOS MENDOZA UGARTE",
      tipoDocumento: savedData.tipoDocumento || "DNI",
      numeroDocumento: savedData.numeroDocumento || "75653454",
      nombreEncargado: "ADRIAN HUANACUNI BONIFACIO",
      cargoEncargado: "ASISTENTE DE TI",
      equipos: [],
      equipo: {
        nombre: "",
        marca: "",
        modelo: "",
        color: "",
        serie: "",
        precio: "",
        codigo: "",
      },
    };
  });

  // Guardar en localStorage cada vez que cambian los datos importantes
  useEffect(() => {
    const { nombreSolicitante, tipoDocumento, numeroDocumento, nombreEmpresa } =
      formData;
    localStorage.setItem(
      "formData",
      JSON.stringify({
        nombreSolicitante,
        tipoDocumento,
        numeroDocumento,
        nombreEmpresa,
      })
    );
  }, [formData]);

  // const [formData, setFormData] = useState({
  //   sede: "ILO",
  //   fechaEntrega: new Date().toISOString().split("T")[0],
  //   codigoDocumento: "",
  //   areaResponsable: "TECNOLOGIAS DE LA INFORMACION",
  //   nombreEmpresa: "EFICIENT FAST SAC",
  //   nombreSolicitante: "JUAN CARLOS MENDOZA UGARTE",
  //   tipoDocumento: "DNI",
  //   numeroDocumento: "75653454",
  //   nombreEncargado: "ADRIAN HUANACUNI BONIFACIO",
  //   cargoEncargado: "ASISTENTE DE TI",
  //   equipos: [],
  //   equipo: {
  //     nombre: "",
  //     marca: "",
  //     modelo: "",
  //     color: "",
  //     serie: "",
  //     precio: "",
  //     codigo: "",
  //   },
  // });

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  // Manejador de cambios para todos los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Object.keys(formData.equipo).includes(name)) {
      // Si el campo pertenece a "equipo"
      setFormData({
        ...formData,
        equipo: {
          ...formData.equipo,
          [name]: value.toUpperCase(),
        },
      });
    } else {
      // Para los demás campos
      setFormData({
        ...formData,
        [name]: value.toUpperCase(),
      });
    }
  };

  const handleNombreChange = (selectedOption) => {
    setFormData({
      ...formData,
      nombreSolicitante: selectedOption ? selectedOption.value : "",
      numeroDocumento: selectedOption ? selectedOption.dni : "", // Autocompletar el DNI
      sede: selectedOption ? selectedOption.sede : "",
      nombreEmpresa: selectedOption ? selectedOption.empresa : "",
    });
  };

  // Función para agregar un equipo a la lista
  const handleAddEquipo = () => {
    if (
      formData.equipo.nombre &&
      formData.equipo.marca &&
      formData.equipo.modelo &&
      formData.equipo.color &&
      formData.equipo.serie &&
      formData.equipo.precio &&
      formData.equipo.codigo
    ) {
      setFormData({
        ...formData,
        equipos: [...formData.equipos, formData.equipo],
        equipo: {
          nombre: "",
          marca: "",
          modelo: "",
          color: "",
          serie: "",
          precio: "",
          codigo: "",
        },
      });
    } else {
      alert("Por favor complete todos los campos del equipo.");
    }
  };

  // Función para eliminar un equipo de la lista
  const handleRemoveEquipo = (index) => {
    const updatedEquipos = formData.equipos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      equipos: updatedEquipos,
    });
  };

  useEffect(() => {
    // Crear el número de documento cuando cambien los valores del formulario
    const generateNumeroDocumento = () => {
      const categoryInitial = category ? category.charAt(0).toUpperCase() : ""; // Verificar que category no sea undefined
      const yearq = year || new Date().getFullYear();

      // Asegurar que el número de serie tenga 3 dígitos
      const serialNum = serialNumber ? serialNumber.padStart(3, "0") : "000"; // Rellenamos con ceros si es necesario

      return `${categoryInitial}-${yearq}-${serialNum}`;
    };

    const codigoDocumento = generateNumeroDocumento();

    setFormData((prevData) => ({
      ...prevData,
      codigoDocumento, // Actualizamos el número de documento
    }));
  }, [category, year, serialNumber]); // Dependencias para recalcular el número de documento

  useEffect(() => {
    async function obtenerNombres() {
      const nombresData = await fetchNombres();
      setNombres(nombresData);
      setLoading(false);
    }

    obtenerNombres();
  }, []);
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1">
          <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h1 className="text-2xl font-semibold text-center text-gray-800">
              FORMULARIO DE {actaType.nombre ?? "N/A"}
            </h1>
          </section>
        </div>
        <br />
        {/* Contenedor principal con dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lado Izquierdo: Datos del solicitante */}
          <div>
            <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="w-full max-w-lg p-8 rounded-lg">
                <p>
                  <strong>Año:</strong> {year}
                </p>
                <p>
                  <strong>Número de Serie:</strong> {serialNumber}
                </p>
                <p>
                  <strong>Categoría de Producto:</strong> {category}
                </p>

                {/* Botones */}
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-gray-400"
                  >
                    Volver al Menú
                  </button>
                </div>
              </div>
            </section>
            <br />
            {/* Datos del Solicitante */}
            <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-medium text-gray-700 mb-4">
                Datos del Solicitante
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombreSolicitante"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre Solicitante
                  </label>
                  <Select
                    id="nombreSolicitante"
                    name="nombreSolicitante"
                    options={nombres}
                    isLoading={loading}
                    isClearable
                    placeholder="Selecciona un nombre..."
                    onChange={handleNombreChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tipoDocumento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo Documento
                  </label>
                  <select
                    id="tipoDocumento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecciona tipo de documento</option>
                    <option value="DNI">DNI</option>
                    <option value="CARNET">Carnet</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="numeroDocumento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                    readOnly // Evita que el usuario modifique manualmente
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Lado derecho: Datos Generales, Solicitante, Encargado */}
          <div>
            {/* Datos Generales */}
            <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-medium text-gray-700 mb-4">
                Datos Generales
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombreEmpresa"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sede"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sede
                  </label>
                  <input
                    type="text"
                    id="sede"
                    name="sede"
                    value={formData.sede}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fechaEntrega"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    id="fechaEntrega"
                    name="fechaEntrega"
                    value={formData.fechaEntrega}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="codigoDocumento"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Código de Documento
                  </label>
                  <input
                    type="text"
                    id="codigoDocumento"
                    name="codigoDocumento"
                    value={formData.codigoDocumento}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="areaResponsable"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Área Responsable
                  </label>
                  <select
                    id="areaResponsable"
                    name="areaResponsable"
                    value={formData.areaResponsable}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecciona un área</option>
                    <option value="ACCIONISTA">ACCIONISTA</option>
                    <option value="ADM TECNICA">ADM TECNICA"</option>
                    <option value="ADMINISTRACION">ADMINISTRACION</option>
                    <option value="ATC">ATC</option>
                    <option value="COMERCIAL">COMERCIAL</option>
                    <option value="CONTABILIDAD">CONTABILIDAD</option>
                    <option value="CONTAC CENTER">CONTAC CENTER</option>
                    <option value="EJECUTIVO">EJECUTIVO</option>
                    <option value="FINANZAS">FINANZAS</option>
                    <option value="JEFATURA">JEFATURA</option>
                    <option value="LOGISTICA">LOGISTICA</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="MARKETING DIGITAL">MARKETING DIGITAL</option>
                    <option value="NOC">NOC</option>
                    <option value="OPERACIONES">OPERACIONES</option>
                    <option value="PROYECTOS">PROYECTOS</option>
                    <option value="RECURSOS HUMANOS">RECURSOS HUMANOS</option>
                    <option value="TECNOLOGIAS DE LA INFORMACION">
                      TECNOLOGIAS DE LA INFORMACION
                    </option>
                    <option value="TELEVENTAS">TELEVENTAS</option>
                    <option value="VENTAS">VENTAS</option>
                  </select>
                </div>
              </div>
            </section>
            <br />
            {/* Datos del Encargado de Área */}
            <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-medium text-gray-700 mb-4">
                Datos del Encargado de Área
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nombreEncargado"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre del Encargado
                  </label>
                  <input
                    type="text"
                    id="nombreEncargado"
                    name="nombreEncargado"
                    value={formData.nombreEncargado}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cargoEncargado"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cargo del Encargado
                  </label>
                  <input
                    type="text"
                    id="cargoEncargado"
                    name="cargoEncargado"
                    value={formData.cargoEncargado}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
        <br />
        <div className="grid grid-cols-1">
          {/* Datos de los Equipos */}
          <div>
            <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-medium text-gray-700 mb-4">
                Datos de los Equipos
              </h2>
              <div className="grid grid-cols-2 py-2 gap-6">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre de Equipo (Laptop, Celular, etc)
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.equipo.nombre}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="serie"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Serie
                  </label>
                  <input
                    type="text"
                    id="serie"
                    name="serie"
                    value={formData.equipo.serie}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 py-2 gap-6">
                <div>
                  <label
                    htmlFor="marca"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Marca
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={formData.equipo.marca}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="modelo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Modelo
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    value={formData.equipo.modelo}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 py-2 gap-6">
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Color
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.equipo.color}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="precio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.equipo.precio}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 py-2 gap-6">
                <div>
                  <label
                    htmlFor="codigo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Código (Inventario)
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.equipo.codigo}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddEquipo}
                className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Agregar Equipo
              </button>
            </section>
          </div>
        </div>
        <br />
        {/* Mostrar Equipos Agregados */}
        <section className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Equipos Registrados
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Marca
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Modelo
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Color
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Serie
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Precio
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Código
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.equipos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No hay registros de equipos.
                    </td>
                  </tr>
                ) : (
                  formData.equipos.map((equipo, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.nombre}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.marca}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.modelo}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.color}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.serie}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.precio}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {equipo.codigo}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipo(index)}
                          className="px-1 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <div className="mt-4">
            {/* Botón para vista previa */}
            <div className="mt-4 px-4 text-right">
              {/* <Button color="success" onClick={toggleModal}>
                Vista Previa del Acta en PDF
              </Button> */}
              <GenerateWord formData={formData} actaType={actaType} />
            </div>
          </div>
        </section>
      </div>
      {/*  <ModalActa
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        formData={formData}
        actaType={actaType}
      />*/}
    </div>
  );
}

export default Actas;
