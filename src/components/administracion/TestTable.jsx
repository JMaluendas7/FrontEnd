import React, { useState } from "react";
import DynamicTable from "./PruebaTabla"; // Asegúrate de que la ruta del archivo sea correcta

const TestData = () => {
  const cargoOptions = ["Desarrollador", "Diseñador", "Gerente", "Analista"];
  const rolOptions = ["Admin", "User", "Guest"];
  const empresaOptions = ["Empresa A", "Empresa B", "Empresa C"];

  const [tableData, setTableData] = useState([
    {
      id: 1,
      nombres: "Juan",
      apellidos: "Perez",
      telefono: 123456789,
      email: "juan@example.com",
      direccion: "Calle 123",
      ciudad: "Ciudad A",
      cargo: "Desarrollador",
      rol: "Admin",
      empresa: "Empresa A",
    },
    {
      id: 2,
      nombres: "María",
      apellidos: "López",
      telefono: 987654321,
      email: "maria@example.com",
      direccion: "Av. Principal",
      ciudad: "Ciudad B",
      cargo: "Diseñador",
      rol: "Usuario",
      empresa: "Empresa B",
    },
    {
      id: 3,
      nombres: "Carlos",
      apellidos: "González",
      telefono: 55555555,
      email: "carlos@example.com",
      direccion: "Calle Principal",
      ciudad: "Ciudad C",
      cargo: "Gerente",
      rol: "Admin",
      empresa: "Empresa C",
    },
    {
      id: 4,
      nombres: "Luis",
      apellidos: "Martínez",
      telefono: 33333333,
      email: "luis@example.com",
      direccion: "Calle 5ta",
      ciudad: "Ciudad A",
      cargo: "Analista",
      rol: "Usuario",
      empresa: "Empresa A",
    },
    {
      id: 5,
      nombres: "Ana",
      apellidos: "Hernández",
      telefono: 77777777,
      email: "ana@example.com",
      direccion: "Av. Central",
      ciudad: "Ciudad B",
      cargo: "Desarrollador",
      rol: "Admin",
      empresa: "Empresa B",
    },
    {
      id: 6,
      nombres: "Pablo",
      apellidos: "Díaz",
      telefono: 22222222,
      email: "pablo@example.com",
      direccion: "Calle 8",
      ciudad: "Ciudad C",
      cargo: "Gerente",
      rol: "Usuario",
      empresa: "Empresa C",
    },
    {
      id: 7,
      nombres: "Elena",
      apellidos: "Sánchez",
      telefono: 66666666,
      email: "elena@example.com",
      direccion: "Av. Norte",
      ciudad: "Ciudad A",
      cargo: "Analista",
      rol: "Admin",
      empresa: "Empresa A",
    },
    {
      id: 8,
      nombres: "Javier",
      apellidos: "Gómez",
      telefono: 44444444,
      email: "javier@example.com",
      direccion: "Calle 10",
      ciudad: "Ciudad B",
      cargo: "Desarrollador",
      rol: "Usuario",
      empresa: "Empresa B",
    },
    {
      id: 9,
      nombres: "Isabel",
      apellidos: "Rodríguez",
      telefono: 88888888,
      email: "isabel@example.com",
      direccion: "Av. Sur",
      ciudad: "Ciudad C",
      cargo: "Gerente",
      rol: "Admin",
      empresa: "Empresa C",
    },
    {
      id: 10,
      nombres: "Sofía",
      apellidos: "Fernández",
      telefono: 99999999,
      email: "sofia@example.com",
      direccion: "Calle 15",
      ciudad: "Ciudad A",
      cargo: "Analista",
      rol: "Usuario",
      empresa: "Empresa A",
    },
  ]);

  const columns = [
    { key: "id", label: "Numero Documento", type: "number" },
    { key: "nombres", label: "Nombres", type: "text" },
    { key: "apellidos", label: "Apellidos", type: "text" },
    { key: "telefono", label: "Telefono", type: "number" },
    { key: "email", label: "EMail", type: "editable" },
    { key: "direccion", label: "Direccion", type: "text" },
    { key: "ciudad", label: "Ciudad", type: "text" },
    { key: "cargo", label: "Cargo", type: "select", options: cargoOptions },
    { key: "rol", label: "Rol", type: "select", options: rolOptions },
    {
      key: "empresa",
      label: "Empresa",
      type: "select",
      options: empresaOptions,
    },
  ];

  const itemsPerPage = 10;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div>
      <h1>Prueba de tabla dinámica</h1>
      <p>Solo funcionalidad sin diseño</p>
      <DynamicTable
        data={tableData}
        columns={columns}
        itemsPerPage={itemsPerPage}
        updatedData={updateTableData}
      />
    </div>
  );
};

export default TestData;
