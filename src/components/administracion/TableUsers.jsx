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

  // const guardarCambioUsuario = async () => {
  //   try {
  //     // Crea un objeto con los datos para enviar al servidor
  //     const dataToUpdate = {
  //       first_name: user.first_name,
  //       last_name: user.last_name,
  //       documento_num: user.documento_num,
  //       usernae: user.username,
  //       email: user.email,
  //       is_active: user.is_active,
  //       date_joined: user.date_joined,
  //     };

  //     // Solicitud PUT al servidor para actualizar user
  //     const response = await axios.put(
  //       `http://127.0.0.1:8000/usersput/${user.documento_num}/`,
  //       dataToUpdate
  //     );
  //     if (response.status === 200) {
  //       // Limpia el objeto localChanges si es necesario, hacer no editable y notificacion
  //       mostrarMensaje("Edicion de user Exitosa", "", "");
  //       toggleEditField(user.documento_num); // Pasa a no editable

  //       console.log("Usuario editado exitosamente");
  //     }
  //   } catch (error) {
  //     console.error("Error al actualizar los datos del user:", error);
  //   }
  // };

  // const eliminarUsuario = async () => {
  //   try {
  //     // Solicitud PUT al servidor para actualizar user
  //     const response = await axios.delete(
  //       `http://127.0.0.1:8000/usersdel/${user.documento_num}/`
  //     );
  //     if (response.status === 200) {
  //       // Limpia el objeto localChanges si es necesario, hacer no editable y notificacion
  //       mostrarMensaje();
  //       toggleEditField(user.documento_num); // Pasa a no editable
  //       console.log("Usuario eliminado exitosamente");
  //     }
  //   } catch (error) {
  //     console.error("Error al eliminar el user:", error);
  //   }
  // };

  return (
    <tr key={key}>
      <td className="cedula">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            name="documento_num"
            className="cedula"
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
      <td className="name">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            className="name"
            name="nombres"
            id="nombres"
            value={user.first_name}
            onChange={(e) =>
              handleChange(user.documento_num, "first_name", e.target.value)
            }
          />
        ) : (
          user.first_name
        )}
      </td>
      <td className="name">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            className="name"
            name="apellidos"
            id="apellidos"
            value={user.last_name}
            onChange={(e) =>
              handleChange(user.documento_num, "last_name", e.target.value)
            }
          />
        ) : (
          user.last_name
        )}
      </td>
      <td className="tele">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            name="telefono"
            id="telefono"
            value={user.username}
            onChange={(e) =>
              handleChange(user.documento_num, "username", e.target.value)
            }
          />
        ) : (
          user.username
        )}
      </td>
      <td className="correo">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            className="correo"
            name="email"
            value={user.email}
            onChange={(e) =>
              handleChange(user.documento_num, "email", e.target.value)
            }
          />
        ) : (
          user.email
        )}
      </td>
      <td className="cont">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            className="cont"
            name="contrato_id"
            value={user.is_active}
            onChange={(e) =>
              handleChange(user.documento_num, "is_active", e.target.value)
            }
          />
        ) : (
          user.is_active
        )}
      </td>
      <td className="dire">
        {editableFields[user.documento_num] ? (
          <input
            type="text"
            className="dire"
            name="date_joined"
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
              <img className="img__buttom" src="/src/img/guardar.png"></img>
            </button>
            <button
              className="buttom"
              onClick={() => toggleEditField(user.documento_num)}
            >
              <img className="img__buttom" src="/src/img/sin-editar.png"></img>
            </button>
          </>
        ) : (
          <>
            <button
              className="buttom"
              onClick={() => toggleEditField(user.documento_num)}
            >
              <img className="img__buttom" src="/src/img/editar.png"></img>
            </button>
            <button
              className="buttom"
              onClick={() => eliminarUsuario(user.documento_num)}
            >
              <img className="img__buttom" src="/src/img/eliminar.png"></img>
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default TableUsers;
