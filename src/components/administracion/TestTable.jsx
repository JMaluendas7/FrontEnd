import React from "react";
import DynamicTable from "./PruebaTabla"; // Asegúrate de que la ruta del archivo sea correcta

const TestData = () => {
  const data = [
    { id: 1, nombre: "Juan", edad: 30, status: "Activo" },
    { id: 2, nombre: "Oscar", edad: 25, status: "Inactivo" },
    { id: 3, nombre: "Orlando", edad: 35, status: "Activo" },
  ];

  const columns = [
    { key: "id", label: "Id", type: "number" },
    { key: "nombre", label: "Nombre", type: "text" },
    { key: "edad", label: "Edad", type: "number" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
      ],
    },
  ];

  return (
    <div>
      <h1>Prueba de tabla dinamica</h1>
      <p>Solo funcionalidad sin diseño</p>
      <DynamicTable data={data} columns={columns} />
    </div>
  );
};

export default TestData;
