import React, { useEffect, useState } from "react";
import { fetchInventoryByPersonal } from "../../services/request/inventoryService";

const InventoryTable = ({ nombrePersonal, onEquipoSeleccionado }) => {
  const [equipos, setEquipos] = useState([]);
  const [equipos2, setEquipos2] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  const handleSeleccionarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo); // Guardar el equipo seleccionado
    onEquipoSeleccionado(equipo); // Enviar datos al formulario destino
  };

  useEffect(() => {
    const obtenerInventario = async () => {
      const data = await fetchInventoryByPersonal(nombrePersonal);

      setEquipos(data[0]);
      setEquipos2(data[1]);
    };

    if (nombrePersonal) {
      obtenerInventario();
    }
  }, [nombrePersonal]);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Inventario 2024
        </h2>

        {equipos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Código</th>
                  <th className="p-2 border">Producto</th>
                  <th className="p-2 border">Marca</th>
                  <th className="p-2 border">Modelo</th>
                  <th className="p-2 border">Serie</th>
                  <th className="p-2 border">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((equipo, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={equipoSeleccionado?.id === equipo.id}
                        onChange={() => handleSeleccionarEquipo(equipo)}
                        className="w-4 h-4"
                      />
                    </td>

                    <td className="p-2 border">{equipo.CODIGO}</td>
                    <td className="p-2 border">{equipo["NOMBRE PRODUCTO"]}</td>
                    <td className="p-2 border">{equipo.MARCA}</td>
                    <td className="p-2 border">{equipo.MODELO}</td>
                    <td className="p-2 border">{equipo["NRO. SERIE"]}</td>
                    <td className="p-2 border">{equipo.DESCRIPCION}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            No se encontraron equipos asignados a {nombrePersonal}.
          </p>
        )}
      </div>
      <br />
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Equipos</h2>

        {equipos2.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-2 border">Código</th>
                  <th className="p-2 border">Producto</th>
                  <th className="p-2 border">Marca</th>
                  <th className="p-2 border">Modelo</th>
                  <th className="p-2 border">Serie</th>
                  <th className="p-2 border">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {equipos2.map((equipo, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 border">{equipo.CODIGO}</td>
                    <td className="p-2 border">{equipo["NOMBRE PRODUCTO"]}</td>
                    <td className="p-2 border">{equipo.MARCA}</td>
                    <td className="p-2 border">{equipo.MODELO}</td>
                    <td className="p-2 border">{equipo["NRO. SERIE"]}</td>
                    <td className="p-2 border">{equipo.DESCRIPCION}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            No se encontraron equipos asignados a {nombrePersonal}.
          </p>
        )}
      </div>
    </>
  );
};

export default InventoryTable;
