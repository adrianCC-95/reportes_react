import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import { getActasNombres } from "../services/request/apiNexcloud";

const MenuActas = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedActa, setSelectedActa] = useState({});
  const [formData, setFormData] = useState({
    year: "",
    serialNumber: "",
    category: "Celulares",
  });

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 🔹 10 documentos por página
  const [dataActas, setDataActas] = useState([]);

  // 🔹 Estado para el switch de guardado automático
  const [autoSave, setAutoSave] = useState(
    JSON.parse(localStorage.getItem("autoSave")) || false
  );

  // 🔹 Manejar el cambio de switch
  const toggleAutoSave = () => {
    const newState = !autoSave;
    setAutoSave(newState);
    localStorage.setItem("autoSave", JSON.stringify(newState));
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.year) {
      errors.year = "El campo Año es obligatorio";
    } else if (!/^\d{4}$/.test(formData.year)) {
      errors.year = "El año debe contener solo números y tener 4 dígitos";
    }

    if (!formData.serialNumber.trim()) {
      errors.serialNumber = "El número de serie es obligatorio";
    } else if (formData.serialNumber.length < 2) {
      errors.serialNumber =
        "El número de serie debe tener al menos 2 caracteres";
    }

    if (!formData.category) {
      errors.category = "La categoría es obligatoria";
    }

    setErrors(errors); // Guarda los errores en el estado

    return errors; // 🔹 RETORNAR LOS ERRORES
  };

  const tipoActas = [
    {
      id: 1,
      nombre: "ENTREGA Y CONFORMIDAD",
      prefijo: "AEC",
      folder: "Entrega",
    },
    {
      id: 2,
      nombre: "DEVOLUCION Y CONFORMIDAD",
      prefijo: "ADC",
      folder: "Devolucion",
    },
    { id: 3, nombre: "PRESTAMO", prefijo: "PRE", folder: "Prestamo" },
  ];

  const openModal = (acta) => {
    setSelectedActa(acta);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedActa("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar solo el error del campo modificado
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Borra el error del campo actual
    }));
  };

  const handleNext = () => {
    const validationErrors = validateForm(); // Obtiene los errores

    if (Object.keys(validationErrors).length > 0) {
      return; // 🔹 Si hay errores, detiene la navegación
    }
    try {
      // Aquí podrías hacer otras operaciones asíncronas si es necesario
      navigate("/formulario-actas", {
        state: { ...formData, actaType: selectedActa },
      });
    } catch (error) {
      console.error("Error al navegar:", error);
    }
  };

  const getActasLista = async () => {
    const category = formData.category;
    const year = formData.year;
    const folder = selectedActa.folder;
    const folderFull = `${year}/${category}/${folder}`;
    setIsLoading(true);
    if (year === "" || category === "" || folder === "") {
      console.log(
        "error al traer los datos, verifique que los valores esten correctos",
        `${year}-${category}-${folder}`
      );
      setIsLoading(false);
    } else {
      const res = await getActasNombres(folderFull);
      if (res) setDataActas(res.archivos || []);
      setIsLoading(false);
    }
  };

  // 🔹 Calcula los documentos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = dataActas?.slice(indexOfFirstItem, indexOfLastItem);

  // 🔹 Cambiar de página
  const totalPages = Math.ceil(dataActas.length / itemsPerPage);
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Establecer el año actual al cargar el componente
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setFormData((prevData) => ({
      ...prevData,
      year: currentYear, // Establecer el año actual en el estado
    }));
  }, [modalIsOpen]); // El arreglo vacío significa que esto solo se ejecutará una vez cuando el componente se monte

  useEffect(() => {
    getActasLista();
  }, [modalIsOpen, formData, selectedActa]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-8">Menú de Actas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tipoActas.map((acta, index) => (
          <div
            key={index}
            onClick={() => openModal(acta)}
            className={`bg-white shadow-lg rounded-lg p-6 text-center cursor-pointer transition-transform duration-300 
                        hover:-translate-y-2 hover:shadow-xl hover:bg-gradient-to-r 
                        ${
                          index === 0
                            ? "from-blue-100 to-blue-200"
                            : index === 1
                            ? "from-green-100 to-green-200"
                            : "from-yellow-100 to-yellow-200"
                        }`}
          >
            <h2 className="text-xl font-medium">{`ACTA DE ${acta.nombre}`}</h2>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalIsOpen} toggle={closeModal} size="xl">
        <ModalHeader toggle={closeModal}>
          {`DATOS PARA ACTA DE ${selectedActa.nombre}`}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-6">
            {/* 📂 Columna Izquierda - Documentos Nextcloud */}
            <div className="border-r pr-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                📄 Documentos Encontrados
              </h3>

              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Spinner color="primary" />
                  <span className="ml-2 text-gray-600">
                    Cargando documentos...
                  </span>
                </div>
              ) : dataActas.length > 0 ? (
                <div className="border rounded-lg shadow-sm overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="py-2 px-4 border-b text-left">#</th>
                          <th className="py-2 px-4 border-b text-left">
                            Nombre del Archivo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDocuments.length === 0 ? (
                          <tr>
                            <td
                              colSpan="2"
                              className="py-2 px-4 border-b text-center text-gray-500"
                            >
                              No hay registros disponibles
                            </td>
                          </tr>
                        ) : (
                          currentDocuments.map((doc, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-100 transition"
                            >
                              <td className="py-2 px-4 border-b">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td className="py-2 px-4 border-b text-gray-800">
                                {doc}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* 🔹 Paginación */}
                  <div className="flex justify-between items-center p-3 bg-gray-100">
                    <button
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md disabled:bg-gray-300"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ◀ Anterior
                    </button>
                    <span className="text-gray-700 text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md disabled:bg-gray-300"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente ▶
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No se encontraron documentos.
                </p>
              )}
            </div>

            {/* 📋 Columna Derecha - Formulario */}
            <div>
              <Form>
                <FormGroup>
                  <Label for="year">Año</Label>
                  <Input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm">{errors.year}</p>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="serialNumber">Número de Serie</Label>
                  <Input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                  />
                  {errors.serialNumber && (
                    <p className="text-red-500">{errors.serialNumber}</p>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="category">Categoría de Producto</Label>
                  <Input
                    type="select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Celulares">Celulares</option>
                    <option value="Equipos">Equipos</option>
                  </Input>
                  {errors.category && (
                    <p className="text-red-500">{errors.category}</p>
                  )}
                </FormGroup>
                {/* 🔹 Interruptor más grande y centrado */}
                <FormGroup className="mt-8 flex flex-col items-center">
                  <Label className="text-lg font-semibold mb-4">
                    Desea guardar automaticamente el archivo en Nextcloud?
                  </Label>
                  <div
                    className={`relative w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                      autoSave ? "bg-green-500" : "bg-gray-400"
                    }`}
                    onClick={toggleAutoSave}
                  >
                    <div
                      className={`absolute w-8 h-8 bg-white rounded-full transition-all duration-300 ${
                        autoSave ? "translate-x-10" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </FormGroup>
              </Form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleNext}>
            Siguiente
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MenuActas;
