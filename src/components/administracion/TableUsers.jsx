import React, { useState, useEffect } from "react";
import axios from "axios";

const TableUsers = ({
  key,
  user,
  users,
  setusers,
  mostrarMensaje,
  empresas,
  roles,
}) => {
  const [editableFields, setEditableFields] = useState({});

  const handleChange = (userId, field, value) => {
    // Realiza los cambios en el user correspondiente
    const updatedUser = users.map((user) => {
      if (user.documento_num === userId) {
        return {
          ...user,
          [field]: value,
        };
      }
      return user;
    });

    // Actualiza el estado de los users
    setusers(updatedUser);
  };

  const toggleEditField = (userId) => {
    setEditableFields((prevEditableFields) => ({
      ...prevEditableFields,
      [userId]: !prevEditableFields[userId],
    }));
  };

  return (
    <tr key={key} className="tr">
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            value={user.documento_num}
            onChange={(e) =>
              handleChange(user.documento_num, "documento_num", e.target.value)
            }
            disabled={editableFields}
          />
        ) : (
          user.documento_num
        )}
      </td>
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            value={user.first_name}
            onChange={(e) =>
              handleChange(user.documento_num, "first_name", e.target.value)
            }
          />
        ) : (
          user.first_name
        )}
      </td>
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            value={user.last_name}
            onChange={(e) =>
              handleChange(user.documento_num, "last_name", e.target.value)
            }
          />
        ) : (
          user.last_name
        )}
      </td>
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            value={user.username}
            onChange={(e) =>
              handleChange(user.documento_num, "username", e.target.value)
            }
          />
        ) : (
          user.username
        )}
      </td>
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            value={user.email}
            onChange={(e) =>
              handleChange(user.documento_num, "email", e.target.value)
            }
          />
        ) : (
          user.email
        )}
      </td>
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={user.is_active} // Establece el estado del checkbox basado en user.is_active
            onChange={(e) =>
              handleChange(user.documento_num, "is_active", e.target.checked)
            }
          />
        ) : user.is_active ? (
          <span>Activo</span>
        ) : (
          <span>Inactivo</span>
        )}
      </td>
      <td className="colum">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            value={user.date_joined}
            onChange={(e) =>
              handleChange(user.documento_num, "date_joined", e.target.value)
            }
          />
        ) : (
          user.date_joined
        )}
      </td>
      <td className="buttoms-sc">
        {editableFields[user.documento_num] ? (
          <>
            <button
              type="button"
              className="buttom"
              onClick={() => guardarCambioUsuario(user.documento_num)}
            >
              Guardar
            </button>
            <button
              className="buttom"
              onClick={() => toggleEditField(user.documento_num)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="buttom"
              onClick={() => toggleEditField(user.documento_num)}
            >
              Editar
            </button>
            <button
              className="buttom"
              onClick={() => eliminarUsuario(user.documento_num)}
            >
              Eliminar
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default TableUsers;
