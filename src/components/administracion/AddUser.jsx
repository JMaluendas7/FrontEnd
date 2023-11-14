import React, { useState, useEffect } from "react";
import Select from "react-select";
import "/src/css/users/AddUser.css";

const Contenido = () => {
  // Llamado a lista de los colaboradores
  const [colaboradores, setColaboradores] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users/")
      .then((response) => response.json())
      .then((colaboradores) => {
        setColaboradores(colaboradores);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

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

  const enviarSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    fetch("http://127.0.0.1:8000/addUsers/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          // Solicitud exitosa RTA 200
          console.log("Colaborador registrado con éxito.");
          mostrarMensaje();
        } else {
          // Fallo de solicitud
          console.error("Error al registrar el colaborador.");
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud: ", error);
      });
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
