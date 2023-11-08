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
    setLocalColaborador(updatedColaboradores);
  };

  // Función para manejar los cambios de los campos editables
  const handleFieldChange = (colaboradorId, field, value) => {
    // Crea una copia de los colaboradores
    const updatedColaboradores = [...colaboradores];
    // Encuentra el colaborador que deseas editar
    const colaborador = updatedColaboradores.find(
      (c) => c.id === colaboradorId
    );
    // Actualiza el valor del campo
    colaborador[field] = value;
    // Actualiza el estado de los colaboradores
    setLocalColaborador(updatedColaboradores);
  };

  // Función para cancelar la edición en una fila de la tabla
  const cancelarEdicion = (colaboradorId) => {
    // Obtiene el colaborador original antes de cualquier cambio
    const colaboradorOriginal = colaborador.find((c) => c.id === colaboradorId);

    // Crea una copia de los colaboradores
    const updatedColaboradores = [...colaborador];

    // Encuentra el colaborador que deseas editar
    const colaborador = updatedColaboradores.find(
      (c) => c.id === colaboradorId
    );

    // Restaura los valores originales del colaborador
    colaborador.nombres = colaboradorOriginal.nombres;
    colaborador.apellidos = colaboradorOriginal.apellidos;
    colaborador.telefono = colaboradorOriginal.telefono;

    // Actualiza el estado de los colaboradores
    setColaboradores(updatedColaboradores);

    // Luego, cambia el estado para indicar que la fila ya no está en modo de edición.
    toggleEditField(colaboradorId);
  };

  // Función para cambiar el estado de editable de un campo

  const toggleEditField = (colaboradorId) => {
    setEditableFields((prevEditableFields) => ({
      ...prevEditableFields,
      [colaboradorId]: !prevEditableFields[colaboradorId],
    }));
  };

  return (
    <tr key={colaborador.num_documento}>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="name"
            name="nombres"
            value={localColaborador.nombres}
            onChange={(e) => handleChange("nombres", e.target.value)}
          />
        ) : (
          localColaborador.nombres
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="apellidos"
            value={localColaborador.apellidos}
            onChange={(e) => handleChange("apellidos", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.apellidos
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="cedula"
            name="num_documento"
            value={localColaborador.num_documento}
            onChange={(e) => handleChange("num_documento", e.target.value)}
            disabled={editableFields}
          />
        ) : (
          localColaborador.num_documento
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="tele"
            name="telefono"
            value={localColaborador.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.telefono
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="correo"
            name="email"
            value={localColaborador.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!editableFields}
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
            value={localColaborador.contrato_id}
            onChange={(e) => handleChange("contrato_id", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.contrato_id
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="dire"
            name="direccion"
            value={localColaborador.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.direccion
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="ciudad"
            name="ciudad"
            value={localColaborador.ciudad}
            onChange={(e) => handleChange("ciudad", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.ciudad
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="rol"
            name="rol_id"
            value={localColaborador.rol_id}
            onChange={(e) => handleChange("rol_id", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.rol_id
        )}
      </td>
      <td>
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="empresa"
            name="empresa_id"
            value={localColaborador.empresa_id}
            onChange={(e) => handleChange("empresa_id", e.target.value)}
            disabled={!editableFields}
          />
        ) : (
          localColaborador.empresa_id
        )}
      </td>
      <td className="buttoms-sc">
        {editableFields[colaborador.num_documento] ? (
          <>
            <button
              className="buttom"
              onClick={() => handleSave(colaborador.num_documento)}
            >
              Guardar
            </button>
            <button
              className="buttom"
              onClick={() => cancelarEdicion(colaborador.num_documento)}
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
