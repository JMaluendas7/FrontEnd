import React, { useState, useEffect } from "react";

const DynamicTable = ({
  data,
  columns,
  itemsPerPage,
  updatedData,
  onCheckboxClick,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [editableRow, setEditableRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setSelectedRows([]);
  }, [data]);

  const sortBy = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig.key !== null) {
      const sorted = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return data;
  };

  // Paginacion
  const totalPages = Math.ceil(sortedData().length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Manejo de doble click en las filas
  const handleDoubleClick = (rowIndex) => {
    if (editableRow !== rowIndex) {
      setEditableRow(rowIndex);
      setEditedValues({ ...data[rowIndex] });
    }
  };

  // Manejo de evento boton enter
  const handleKeyPress = (e, rowIndex) => {
    if (e.key === "Enter") {
      setEditableRow(null);
      setEditedValues({});
    }
  };

  // Manejo de edicion de campos
  const handleEditChange = (columnKey, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [columnKey]: value,
    }));
  };

  // Manejo de guardar la data en local
  const handleSaveEdit = () => {
    const updatedDataCopy = [...data];
    updatedDataCopy[editableRow] = {
      ...data[editableRow],
      ...editedValues,
    };
    // Actualizar los datos originales con los valores editados
    updatedData(updatedDataCopy);
    setEditableRow(null);
    setEditedValues({});
  };

  // Manejo de fila seleccionada
  const handleSelectRow = (index, isSelected) => {
    if (isSelected) {
      setSelectedRows([...selectedRows, index]);
    } else {
      const updatedSelection = selectedRows.filter(
        (rowIndex) => rowIndex !== index
      );
      setSelectedRows(updatedSelection);
    }
  };

  // Renderizado de celda
  const renderCell = (item, column, rowIndex) => {
    const cellValue = item[column.key];

    // Checkbox
    if (column.key === "Estado") {
      return (
        <td key={column.key} className="colum">
          <input
            type="checkbox"
            checked={cellValue === 1 || cellValue === true}
            onChange={(e) => handleSelectRow(rowIndex, e.target.checked)}
            onClick={() => onCheckboxClick(item.Documento)}
            className="checkmark"
          />
        </td>
      );
    }

    if (editableRow === rowIndex) {
      return (
        <td key={column.key}>
          <input
            type={column.type === "boolean" ? "checkbox" : "text"}
            value={
              editedValues[column.key] !== undefined
                ? editedValues[column.key]
                : cellValue
            }
            onChange={(e) => handleEditChange(column.key, e.target.value)}
            className="campo__input"
          />
        </td>
      );
    }

    if (column.type === "text") {
      return (
        <td key={column.key} className="colum">
          {cellValue}
        </td>
      );
    } else if (column.type === "number") {
      return (
        <td key={column.key} className="colum">
          {typeof cellValue === "number" && !isNaN(cellValue)
            ? Number.isInteger(cellValue)
              ? cellValue.toLocaleString("es-CO")
              : cellValue.toLocaleString("es-CO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
            : cellValue}
        </td>
      );
    } else if (column.type === "select") {
      return (
        <td key={column.key} className="colum">
          <select value={cellValue} className="campo__input select__tb">
            {column.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </td>
      );
    } else {
      return <td key={column.key}>{cellValue}</td>;
    }
  };

  return (
    <section className="container__table">
      <table className="filas__container">
        <thead>
          <tr className="title__campos">
            {/* Columna de checkbox */}
            {/* {columns.length > 0 && (
              <th key={columns[0].key} className="colum">
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentItems.length}
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked
                        ? currentItems.map((_, index) => index)
                        : []
                    )
                  }
                  className="campo__input"
                />
              </th>
            )} */}
            {/* Cabecera de la tabla */}
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => sortBy(column.key)}
                className="colum"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={index}
              onDoubleClick={() => handleDoubleClick(index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              tabIndex={0}
              className="tr"
            >
              {/* Checkbox en su propia columna */}
              {columns.length > 0 && renderCell(item, columns[0], index)}
              {/* Resto de las celdas */}
              {columns
                .slice(1)
                .map((column) => renderCell(item, column, index))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <ul className="paginacion_table">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li key={index} className="li_paginacion">
              <button
                className="button_paginacion"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
      {editableRow !== null && (
        <div>
          <button onClick={handleSaveEdit}>Guardar</button>
        </div>
      )}
    </section>
  );
};

export default DynamicTable;
