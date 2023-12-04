import React, { useState } from 'react';

const DynamicTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortBy = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig.key !== null) {
      const sorted = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return data;
  };

    const renderCell = (item, column) => {
        const cellValue = item[column.key];
        
        if (column.type === 'text') {
            return <td key={column.key}>{cellValue}</td>;
        } else if (column.type === 'number') {
            return <td key={column.key}>{parseFloat(cellValue).toFixed(2)}</td>;
        } else if (column.type === 'select') {
            return (
            <td key={column.key}>
                <select value={cellValue}>
                {column.options.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </select>
            </td>
            );
        } else if (column.type === 'editable') {
            const handleChange = (e) => {
            // Implementa la lógica para actualizar el valor editable
            // probablemente a través de algún método o función proporcionada.
            };
        
            return (
            <td key={column.key}>
                <input
                type="text"
                value={cellValue}
                onChange={(e) => handleChange(e.target.value)}
                />
            </td>
            );
        } else {
            return <td key={column.key}>{cellValue}</td>;
        }
    };

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} onClick={() => sortBy(column.key)}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData().map((item, index) => (
          <tr key={index}>
            {columns.map((column) => renderCell(item, column))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
