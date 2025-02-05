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
} from "reactstrap";

const MenuActas = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedActa, setSelectedActa] = useState({});
  const [formData, setFormData] = useState({
    year: "",
    serialNumber: "",
    category: "Celulares",
  });

  const tipoActas = [
    { id: 1, nombre: "ENTREGA Y CONFORMIDAD", prefijo: "AEC" },
    { id: 2, nombre: "DEVOLUCION Y CONFORMIDAD", prefijo: "ADC" },
    { id: 3, nombre: "PRESTAMO", prefijo: "PRE" },
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
  };

  const handleNext = () => {
    closeModal();
    navigate("/formulario-actas", {
      state: { ...formData, actaType: selectedActa },
    });
  };

  // Establecer el año actual al cargar el componente
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setFormData((prevData) => ({
      ...prevData,
      year: currentYear, // Establecer el año actual en el estado
    }));
  }, [modalIsOpen]); // El arreglo vacío significa que esto solo se ejecutará una vez cuando el componente se monte

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
      <Modal isOpen={modalIsOpen} toggle={closeModal}>
        <ModalHeader
          toggle={closeModal}
        >{`DATOS PARA ACTA DE ${selectedActa.nombre}`}</ModalHeader>
        <ModalBody>
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
            </FormGroup>
          </Form>
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
