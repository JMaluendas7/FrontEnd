import React, { useState, useEffect } from "react";

const TableRow = ({
  colaborador,
  colaboradores,
  setColaboradores,
  getColaboradores,
}) => {
  const [editableFields, setEditableFields] = useState({});
  const [localColaborador, setLocalColaborador] = useState({
    nombres: colaborador.nombres,
    apellidos: colaborador.apellidos,
    num_documento: colaborador.num_documento,
    telefono: colaborador.telefono,
    email: colaborador.email,
    contrato_id: colaborador.contrato_id,
    direccion: colaborador.direccion,
    ciudad: colaborador.ciudad,
    rol_id: colaborador.rol_id,
    empresa_id: colaborador.empresa_id,
  });

  const handleChange = (colaboradorId, field, value) => {
    // Realiza los cambios en el colaborador correspondiente
    const updatedColaboradores = colaboradores.map((c) => {
      if (c.num_documento === colaboradorId) {
        return {
          ...c,
          [field]: value,
        };
      }
      return c;
    });

    // Actualiza el estado de los colaboradores
    setColaboradores(updatedColaboradores);
  };

  const toggleEditField = (colaboradorId) => {
    setEditableFields((prevEditableFields) => ({
      ...prevEditableFields,
      [colaboradorId]: !prevEditableFields[colaboradorId],
    }));
  };

  const handleFieldChange = (field, value) => {
    // Actualiza el estado local del colaborador en modo edición
    setLocalColaborador((prevLocalColaborador) => ({
      ...prevLocalColaborador,
      [field]: value,
    }));
  };

  

  const cancelarEdicion = (colaboradorId) => {
    // Recupera los datos originales del colaborador
    const colaboradorOriginal = colaboradores.find(
      (c) => c.num_documento === colaboradorId
    );

    if (colaboradorOriginal) {
      // Revierte los cambios en el estado local del colaborador
      setLocalColaborador(colaboradorOriginal);

      // Cambia el estado para indicar que la fila ya no está en modo de edición
      toggleEditField(colaboradorId);
    }
  };
  

  return (
    <tr key={colaborador.num_documento}>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="name"
            name="nombres"
            id="nombres"
            value={localColaborador.nombres}
            onChange={(e) => handleFieldChange("nombres", e.target.value)}
          />
        ) : (
          colaborador.nombres
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="apellidos"
            value={localColaborador.apellidos}
            onChange={(e) => handleChange(colaborador.num_documento, "apellidos", e.target.value)}
          />
        ) : (
          colaborador.apellidos
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="cedula"
            name="num_documento"
            value={colaborador.num_documento}
            onChange={(e) => handleChange(colaborador.num_documento, "num_documento", e.target.value)}
            disabled={editableFields}
          />
        ) : (
          colaborador.num_documento
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="tele"
            name="telefono"
            value={colaborador.telefono}
            onChange={(e) => handleChange(colaborador.num_documento, "telefono", e.target.value)}
          />
        ) : (
          colaborador.telefono
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="correo"
            name="email"
            value={localColaborador.email}
            onChange={(e) => handleChange(colaborador.num_documento, "email", e.target.value)}
          />
        ) : (
          localColaborador.email
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="cont"
            name="contrato_id"
            value={colaborador.contrato_id}
            onChange={(e) => handleChange(colaborador.num_documento, "contrato_id", e.target.value)}
          />
        ) : (
          colaborador.contrato_id
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="dire"
            name="direccion"
            value={colaborador.direccion}
            onChange={(e) => handleChange(colaborador.num_documento, "direccion", e.target.value)}
          />
        ) : (
          colaborador.direccion
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="ciudad"
            name="ciudad"
            value={colaborador.ciudad}
            onChange={(e) => handleChange(colaborador.num_documento, "ciudad", e.target.value)}
          />
        ) : (
          colaborador.ciudad
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="rol"
            name="rol_id"
            value={colaborador.rol_id}
            onChange={(e) => handleChange(colaborador.num_documento, "rol_id", e.target.value)}
          />
        ) : (
          colaborador.rol_id
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="empresa"
            name="empresa_id"
            value={colaborador.empresa_id}
            onChange={(e) => handleChange(colaborador.num_documento, "empresa_id", e.target.value)}
          />
        ) : (
          colaborador.empresa_id
        )}
      </td>
      <td className="buttoms-sc">
        {editableFields[colaborador.num_documento] ? (
          <>
            <button
              type="button"
              className="buttom"
              onClick={() => handleSave(colaborador.num_documento)}
            >
              Guardar
            </button>
            <button
              className="buttom"
              onClick={() => toggleEditField(colaborador.num_documento)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            className="buttom"
            onClick={() => toggleEditField(colaborador.num_documento)}
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
