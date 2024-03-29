import React, { useState, useEffect } from "react";
import axios from "axios";

const TableRow = ({
  colaborador,
  colaboradores,
  setColaboradores,
  mostrarMensaje,
  selectColaborador,
  getColaboradores,
  empresas,
  roles,
  cargos,
  selectedUser, // Usuario seleccionado para editar
  setSelectedUser,
}) => {
  const [editableFields, setEditableFields] = useState({});

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

  const guardarCambioUsuario = async () => {
    try {
      // Crea un objeto con los datos para enviar al servidor
      const dataToUpdate = {
        num_documento: colaborador.num_documento,
        nombres: colaborador.nombres,
        apellidos: colaborador.apellidos,
        telefono: colaborador.telefono,
        email: colaborador.email,
        direccion: colaborador.direccion,
        ciudad: colaborador.ciudad,
        rol_id: colaborador.rol_id,
        empresa_id: colaborador.empresa_id,
      };
      // Solicitud PUT al servidor para actualizar colaborador
      const response = await axios.put(
        `http://127.0.0.1:8000/colaboradoresput/${colaborador.num_documento}/`,
        dataToUpdate
      );
      if (response.status === 200) {
        getColaboradores();
        mostrarMensaje(
          "Edicion de colaborador Exitosa",
          "success_notification"
        );
        toggleEditField(colaborador.num_documento); // Pasa a no editable
      }
    } catch (error) {
      mostrarMensaje(
        "Error al actualizar los datos del colaborador",
        "error_notification"
      );
    }
  };

  const eliminarUsuario = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/colaboradoresdel/${colaborador.num_documento}/`
      );
      if (response.status === 200) {
        mostrarMensaje("Ha sido elimiado el usuario", "success_notification");
        toggleEditField(colaborador.num_documento); // Pasa a no editable
      }
    } catch (error) {
      mostrarMensaje(
        "No se ha podido eliminar el usuario",
        "error_notification"
      );
    }
  };

  const handleEditClick = () => {
    setSelectedUser(colaborador); // Establece el usuario seleccionado
    toggleEditField(colaborador.num_documento); // Activa el modo de edición
  };

  return (
    <tr
      key={colaborador.num_documento}
      className="tr"
      onDoubleClick={() => toggleEditField(colaborador.num_documento)}
    >
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            name="num_documento"
            className="campo__input"
            value={colaborador.num_documento}
            onDoubleClick={() => toggleEditField(colaborador.num_documento)}
            onChange={(e) =>
              handleChange(
                colaborador.num_documento,
                "num_documento",
                e.target.value
              )
            }
            disabled={editableFields}
          />
        ) : (
          colaborador.num_documento
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="campo__input"
            name="nombres"
            onDoubleClick={() => toggleEditField(colaborador.num_documento)}
            onDragEnterCapture={() =>
              toggleEditField(colaborador.num_documento)
            }
            id="nombres"
            value={colaborador.nombres}
            onChange={(e) =>
              handleChange(colaborador.num_documento, "nombres", e.target.value)
            }
          />
        ) : (
          colaborador.nombres
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="campo__input"
            name="apellidos"
            id="apellidos"
            value={colaborador.apellidos}
            onChange={(e) =>
              handleChange(
                colaborador.num_documento,
                "apellidos",
                e.target.value
              )
            }
          />
        ) : (
          colaborador.apellidos
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="campo__input"
            name="telefono"
            id="telefono"
            value={colaborador.telefono}
            onChange={(e) =>
              handleChange(
                colaborador.num_documento,
                "telefono",
                e.target.value
              )
            }
          />
        ) : (
          colaborador.telefono
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="campo__input"
            name="email"
            value={colaborador.email}
            onChange={(e) =>
              handleChange(colaborador.num_documento, "email", e.target.value)
            }
          />
        ) : (
          colaborador.email
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="campo__input"
            value={colaborador.ciudad}
            onChange={(e) =>
              handleChange(colaborador.num_documento, "ciudad", e.target.value)
            }
          />
        ) : (
          colaborador.ciudad
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <select
            type="text"
            className="campo__input select__tb"
            value={colaborador.rol_id}
            onChange={(e) =>
              handleChange(colaborador.num_documento, "rol_id", e.target.value)
            }
          >
            {roles.map((rol, index) => (
              <option key={index} value={rol.id_rol}>
                {rol.detalle_rol}
              </option>
            ))}
          </select>
        ) : (
          colaborador.rol_id
        )}
      </td>
      <td className="colum">
        {editableFields[colaborador.num_documento] ? (
          <select
            className="campo__input select__tb"
            onChange={(e) =>
              handleChange(
                colaborador.num_documento,
                "empresa_id",
                e.target.value
              )
            }
          >
            {empresas.map((empresa, index) => (
              <option key={index} value={empresa.id_empresa}>
                {empresa.nombre_empresa}
              </option>
            ))}
          </select>
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
              onClick={() => guardarCambioUsuario(colaborador.num_documento)}
            >
              Guardar
            </button>
            <button
              className="buttom buttom__orange"
              onClick={() => toggleEditField(colaborador.num_documento)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="buttom"
              onClick={() =>
                selectColaborador(
                  colaborador.tipo_documento,
                  colaborador.num_documento,
                  colaborador.nombres,
                  colaborador.apellidos,
                  colaborador.telefono,
                  colaborador.email,
                  colaborador.cargo_id,
                  colaborador.direccion,
                  colaborador.ciudad,
                  colaborador.rol_id,
                  colaborador.empresa_id
                )
              }
            >
              Editar
            </button>
            <button
              className="buttom buttom__red"
              onClick={() => eliminarUsuario(colaborador.num_documento)}
            >
              Eliminar
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
