import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import TableUsers from "./TableUsers";
import "/src/css/administracion/AddUser.css";

const Contenido = () => {
  // Llamado a lista de los colaboradores
  const [colaboradores, setColaboradores] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/")
      .then((response) => {
        setColaboradores(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Llamado a lista de los usuarios
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/login/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // useState para contener el valor de busqueda
  const [searchValue, setSearchValue] = useState("");

  // Funcion para actualizar el useState de busqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Funcion para filtrado de datos
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.documento_num} ${user.first_name} ${user.last_name}`;
    return fullName.toLowerCase().includes(searchValue.toLowerCase());
  });

  // Creacion de Array de los Colaboradores para menu desplegable
  const arrColaboradores = colaboradores.map((item) => ({
    value: item.num_documento,
    label: `${item.num_documento} - ${item.nombres} ${item.apellidos}`,
  }));

  // Manejo de valor para el Select
  const [seleccion, setSeleccion] = useState(null);
  const cambio = (seleccion) => {
    setSeleccion(seleccion);
  };

  const enviarSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/addUsers/",
        formData
      );

      if (response.status === 200) {
        // Solicitud exitosa RTA 200
        console.log("Colaborador registrado con éxito.");
        mostrarMensaje();
      } else {
        // Fallo de solicitud
        console.error("Error al registrar el colaborador.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud: ", error);
    }
  };

  // Notificacion de Registo *Se debe Mejorar*
  const [mensajeVisible, setMensajeVisible] = useState(false); // Mueve la declaración aquí

  const mostrarMensaje = () => {
    setMensajeVisible(true);
    setTimeout(() => {
      setMensajeVisible(false);
    }, 300000);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Registro de Usuarios</h1>
      <h3 className="subtitulo_logi">
        Registro de usuarios para acceso al aplicativo
      </h3>
      <form method="post" onSubmit={enviarSubmit}>
        <div className="form-regUsers">
          <div className="cc input-container">
            <div>
              <Select
                value={seleccion}
                onChange={cambio}
                options={arrColaboradores}
                isSearchable
                name="id_user"
                className="select"
                placeholder="Numero de Cedula o Nombre"
              />
            </div>
          </div>
          <div className="user input-container">
            <input
              id="usuario"
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label" htmlFor="usuario">
              Usuario
            </label>
          </div>
          <div className="pass input-container">
            <input
              id="contrasena"
              name="contrasena"
              className="input-field"
              placeholder=""
              type="password"
            />
            <label className="input-label" htmlFor="contrasena">
              Contraseña
            </label>
          </div>
          <label className="custom-checkbox">
            <input type="checkbox" name="superuser" />
            <span className="checkmark"></span> Es Super Usuario
          </label>
        </div>
        <button className="submit-button" type="submit">
          Registrar Usuario
        </button>
      </form>

      <div className="input-container search">
        <input
          type="text"
          name="search"
          id="search"
          className="input-field"
          placeholder=""
          value={searchValue}
          onChange={handleSearchChange}
        />
        <label className="input-label" htmlFor="search">
          Buscar por cedula o nombre
        </label>
      </div>

      <section className="container__table">
        <table className="filas__container">
          <thead>
            <tr className="title__campos">
              <th>Numero Documento</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>UserName</th>
              <th>EMail</th>
              <th>Activo</th>
              <th>Ultima Sesion</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <TableUsers
                key={user.num_documento} // Establece 'key' directamente aquí
                user={user}
                users={filteredUsers}
                setUsers={setUsers}
                mostrarMensaje={mostrarMensaje}
              />
            ))}
          </tbody>
        </table>
      </section>
      <div>
        {mensajeVisible && (
          <div id="notificaciones" className="notificaciones">
            <div className="registro_ok">
              <h2>Acceso a Usuario Exitoso</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contenido;
