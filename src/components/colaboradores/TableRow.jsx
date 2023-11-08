import React, { useState } from "react";

const TableRow = ({ colaborador, editable, onEdit, onSave, onCancel, onChange }) => {
  const [localColaborador, setLocalColaborador] = useState({ ...colaborador });

  const handleInputChange = (field, value) => {
    setLocalColaborador({
      ...localColaborador,
      [field]: value,
    });
    onChange(localColaborador.id, field, value);
  };

  return (
    <tr key={colaborador.id}>
      <td>
        {editable ? (
          <input
            type="text"
            className="name"
            value={localColaborador.nombres}
            onChange={(e) => handleInputChange("nombres", e.target.value)}
          />
        ) : (
          localColaborador.nombres
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="name"
            value={localColaborador.apellidos}
            onChange={(e) => handleInputChange("apellidos", e.target.value)}
          />
        ) : (
          localColaborador.apellidos
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="cedula"
            value={localColaborador.num_documento}
            onChange={(e) => handleInputChange("num_documento", e.target.value)}
          />
        ) : (
          localColaborador.num_documento
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="tele"
            value={localColaborador.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
          />
        ) : (
          localColaborador.telefono
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="correo"
            value={localColaborador.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        ) : (
          localColaborador.email
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="cont"
            value={localColaborador.contrato_id}
            onChange={(e) => handleInputChange("contrato_id", e.target.value)}
          />
        ) : (
          localColaborador.contrato_id
        )}
      </td>
      <td>
        {editable ? (
          <input
          type="text"
          className="dire"
          value={localColaborador.direccion}
          onChange={(e) => handleInputChange("direccion", e.target.value)}
          />
        ) : (
          localColaborador.direccion
        )}
      </td>
      <td>
        {editable ? (
          <input
          type="text"
          className="ciudad"
          value={localColaborador.ciudad}
          onChange={(e) => handleInputChange("ciudad", e.target.value)}
          />
        ) : (
          localColaborador.ciudad
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="rol"
            value={localColaborador.rol_id}
            onChange={(e) => handleInputChange("rol_id", e.target.value)}
          />
        ) : (
          localColaborador.rol_id
        )}
      </td>
      <td>
        {editable ? (
          <input
            type="text"
            className="empresa"
            value={localColaborador.empresa_id}
            onChange={(e) => handleInputChange("empresa_id", e.target.value)}
          />
        ) : (
          localColaborador.empresa_id
        )}
      </td>
      <td>
        {editable ? (
          <>
            <button onClick={() => onSave(localColaborador.id)}>Guardar</button>
            <button onClick={() => onCancel(localColaborador.id)}>Cancelar</button>
          </>
        ) : (
          <button onClick={() => onEdit(localColaborador.id)}>Editar</button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
