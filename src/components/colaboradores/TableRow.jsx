import React, { useState, useEffect } from "react";
import axios from "axios";

const TableRow = ({
  colaborador,
  colaboradores,
  setColaboradores,
  mostrarMensaje,
  empresas,
  roles,
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
      };

      // Solicitud PUT al servidor para actualizar colaborador
      const response = await axios.put(
        `http://127.0.0.1:8000/colaboradoresput/${colaborador.num_documento}/`,
        dataToUpdate
      );
      if (response.status === 200) {
        // Limpia el objeto localChanges si es necesario, hacer no editable y notificacion
        mostrarMensaje("Edicion de colaborador Exitosa");
        toggleEditField(colaborador.num_documento); // Pasa a no editable

        console.log("Usuario editado exitosamente");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del colaborador:", error);
    }
  };

  const eliminarUsuario = async () => {
    try {
      // Solicitud PUT al servidor para actualizar colaborador
      const response = await axios.delete(
        `http://127.0.0.1:8000/colaboradoresdel/${colaborador.num_documento}/`
      );
      if (response.status === 200) {
        // Limpia el objeto localChanges si es necesario, hacer no editable y notificacion
        mostrarMensaje();
        toggleEditField(colaborador.num_documento); // Pasa a no editable
        console.log("Usuario eliminado exitosamente");
      }
    } catch (error) {
      console.error("Error al eliminar el colaborador:", error);
    }
  };

  return (
    <tr key={colaborador.num_documento}>
      <td className="cedula">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            name="num_documento"
            className="cedula"
            value={colaborador.num_documento}
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
      <td className="name">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="name"
            name="nombres"
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
      <td className="name">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="name"
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
      <td className="tele">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="tele"
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
      <td className="correo">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="correo"
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
      <td className="cont">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="cont"
            name="contrato_id"
            value={colaborador.contrato_id}
            onChange={(e) =>
              handleChange(
                colaborador.num_documento,
                "contrato_id",
                e.target.value
              )
            }
          />
        ) : (
          colaborador.contrato_id
        )}
      </td>
      <td className="dire">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="dire"
            name="direccion"
            value={colaborador.direccion}
            onChange={(e) =>
              handleChange(
                colaborador.num_documento,
                "direccion",
                e.target.value
              )
            }
          />
        ) : (
          colaborador.direccion
        )}
      </td>
      <td className="ciudad">
        {editableFields[colaborador.num_documento] ? (
          <input
            type="text"
            className="ciudad"
            name="ciudad"
            value={colaborador.ciudad}
            onChange={(e) =>
              handleChange(colaborador.num_documento, "ciudad", e.target.value)
            }
          />
        ) : (
          colaborador.ciudad
        )}
      </td>
      <td className="rol">
        {editableFields[colaborador.num_documento] ? (
          <select
            type="text"
            className="rol select__tb"
            name="rol_id"
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
      <td className="empresa">
        {editableFields[colaborador.num_documento] ? (
          <select
            className="empresa select__tb"
            name="empresa_id"
            value={colaborador.empresa_id}
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
              className="buttom"
              onClick={() => toggleEditField(colaborador.num_documento)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="buttom"
              onClick={() => toggleEditField(colaborador.num_documento)}
            >
              Editar
            </button>
            <button
              className="buttom"
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