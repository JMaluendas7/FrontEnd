import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import TableUsers from "./TableUsers";
import "/src/css/administracion/AddUser.css";

const Contenido = ({ mostrarMensaje }) => {
  // Llamado a lista de los colaboradores
  const [colaboradores, setColaboradores] = useState([]);
  const getColaboradores = () => {
    axios.get("http://127.0.0.1:8000/api/users/").then((response) => {
      setColaboradores(response.data);
    });
  };

  // Llamado a lista de los usuarios
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios.get("http://127.0.0.1:8000/api/login/").then((response) => {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    getUsers();
    getColaboradores();
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
  // useState para desplegar usuario y contraseña
  const [showUserFields, setShowUserFields] = useState(false);

  const cambio = (seleccion) => {
    setSeleccion(seleccion);
    setShowUserFields(true); // Muestra los campos cuando se selecciona un usuario
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
        mostrarMensaje(
          "Ha sido registrado el colaborador",
          "success_notification"
        );
        getUsers();
      }
    } catch (error) {
      mostrarMensaje(
        "No se ha podido eliminar el usuario",
        "error_notification"
      );
    }
  };

  const videoRef = useRef();
  const [fotoTomada, setFotoTomada] = useState(null);

  const tomarFoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const capturarImagen = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    const imagenCapturada = canvas.toDataURL("image/jpeg");

    // Convertir la URL base64 a un archivo Blob
    const imagenBlob = dataURItoBlob(imagenCapturada);

    const formData = new FormData();
    formData.append("imagen", imagenBlob, "nombre_imagen.jpg"); // Adjuntar el archivo al FormData
    console.log(
      "¿El FormData tiene algún valor adjunto?",
      formData.has("imagen")
    );
    console.log(formData);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/subir_ft/",
        formData
      );
      console.log("Imagen enviada correctamente:", response.data);
      mostrarMensaje(
        "Se ha subido correctamente la imagen a la base de datos",
        "success_notification"
      );
    } catch (error) {
      console.error("Error al enviar la imagen:", error);
    }
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
          {showUserFields && (
            <div className="user input-container">
              <input
                id="usuario"
                name="usuario"
                className="input-field"
                placeholder=""
                type="text"
              />
              <label className="input-label">Usuario</label>
            </div>
          )}
          {showUserFields && (
            <div className="pass input-container">
              <input
                id="contrasena"
                name="contrasena"
                className="input-field"
                placeholder=""
                type="password"
              />
              <label className="input-label">Contraseña</label>
            </div>
          )}
          {showUserFields && (
            <label className="custom-checkbox">
              <input type="checkbox" name="superuser" />
              <span className="checkmark"></span> Es Super Usuario
            </label>
          )}
        </div>
        {showUserFields && (
          <button className="submit-button" type="submit">
            Registrar Usuario
          </button>
        )}
      </form>

      <div>
        <button onClick={tomarFoto}>Activar Cámara</button>
        <br />
        <video ref={videoRef} autoPlay />
        <br />
        <button onClick={capturarImagen}>Tomar Foto</button>
        <br />
        {fotoTomada && <img src={fotoTomada} alt="Foto Capturada" />}
      </div>

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
        <label className="input-label">Buscar por cedula o nombre</label>
      </div>

      <section className="container__table">
        <table className="filas__container">
          <thead>
            <tr className="title__campos">
              <th className="colum">Numero Documento</th>
              <th className="colum">Nombre</th>
              <th className="colum">Apellido</th>
              <th className="colum">UserName</th>
              <th className="colum">EMail</th>
              <th className="colum">Activo</th>
              <th className="colum">Ultima Sesion</th>
              <th className="fijo"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <TableUsers
                key={user.documento_num}
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
