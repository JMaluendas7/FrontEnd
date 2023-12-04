import React from 'react';
import DynamicTable from './PruebaTabla'; // Asegúrate de que la ruta del archivo sea correcta

const TestData = () => {
  const data = [
    { id: 1, name: 'John', age: 30, status: 'Active' },
    { id: 2, name: 'Alice', age: 25, status: 'Inactive' },
    { id: 3, name: 'Bob', age: 35, status: 'Active' },
  ];

  const columns = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'age', label: 'Age', type: 'number' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ];

  return (
    <div>
      <h1>Prueba de tabla dinamica</h1>
      <p>Solo funcionalidad sin diseno</p>
      <DynamicTable data={data} columns={columns} />
    </div>
  );
};

export default TestData;
