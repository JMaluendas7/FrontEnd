import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import TableUsers from "./administracion/TableUsers";
import "/src/css/administracion/AddUser.css";
import "/src/css/administracion/Pruebas.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useDateRange from "./AdminDateRange";

const Pruebas = () => {
  const {
    formattedStartDate,
    formattedEndDate,
    dateRangeText,
    renderDatePicker,
  } = useDateRange();
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

  const getUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/login/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  };

  useEffect(() => {
    getUsers();
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
  const [showUserFields, setShowUserFields] = useState(true);

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
        getUsers();
        mostrarMensaje("Ha sido registrado el usuario", "success_notification");
      }
    } catch (error) {
      mostrarMensaje(
        "No se ha podido registrar el usuario",
        "error_notification"
      );
    }
  };

  // Notificacion de Registo *Se debe Mejorar*
  const [mensaje, setMensaje] = useState({
    visible: true,
  });
  const mostrarMensaje = (mensaje, color, imagen) => {
    setMensaje({
      visible: true,
    });
  };

  // useState para campo de Mes Año
  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange1 = (e) => {
    setSelectedDate(e.target.value);
  };

  // Proceso 2 inputs date
  const [startDate2, setStartDate2] = useState(null);
  const [endDate2, setEndDate2] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate2(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate2(date);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Pruebas</h1>
      <div className="loader"></div>
      <h3 className="subtitulo_logi">Campo Search con dropdown list</h3>
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
          <p>
            Botones input con bordes 360 y CheckBox modificado; Este Form esta
            usando Grid
          </p>
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
          <>
            <p>Boton envio de submit</p>
            <button className="submit-button" type="submit">
              Registrar Usuario
            </button>
          </>
        )}
      </form>

      <p>Input de busqueda adaptable a cualquier busqueda necesaria</p>
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

      <p>Tabla dinamica con edicion, eliminacion, orden, paginacion, etc</p>
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
        <p>Campo de Menu desplegable</p>
        <div className="input-container">
          <select
            className="opciones dni"
            name="tipo_documento"
            defaultValue={"dni"}
          >
            <option value="dni" disabled>
              DNI
            </option>
            <option className="option" value="C.C.">
              Cedula de ciudadania
            </option>
            <option className="option" value="T.I.">
              Tarjeta de Identidad
            </option>
          </select>
        </div>
        <p>Campo Fecha</p>
        <input type="date" className="input-field"></input>
        <div>
          <p>Campo Fecha de mes y año</p>
          <label className="label">Selecciona año y mes:</label>
          <input
            type="month"
            className="input-field"
            value={selectedDate}
            onChange={handleDateChange1}
            min="YYYY-01"
            max="YYYY-12"
          />
          <p>Campo fecha de rango en 2 inputs</p>
          <label>Selecciona el rango de fechas:</label>
          <div className="div__flex">
            <h3> Desde </h3>
            <DatePicker
              className="input-field"
              selected={startDate2}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate2}
              endDate={endDate2}
              placeholderText="Fecha inicial"
            />
            <h3> Hasta </h3>
            <DatePicker
              className="input-field"
              selected={endDate2}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate2}
              endDate={endDate2}
              minDate={startDate2}
              placeholderText="Fecha final"
            />
          </div>
          <br />
          <p>Campo fecha de rango en 1 input</p>
          <div>
            <label>Selecciona el rango de fechas:</label>
            <div className="content__dateDH">
              {renderDatePicker()}
              <p>{dateRangeText}</p>
            </div>
          </div>
        </div>
      </section>
      <div>
        {mensaje.visible && (
          <div className="contenedor__notificaciones cn2">
            <div className="container_notificacion">
              <div className={`registro_ok error_notification`}>
                <h2 className="txt_noti">
                  Mensaje con notificacion no exitosa
                </h2>
              </div>
              <div className="cerrar_noti" />
            </div>
            <div className="container_notificacion">
              <div className={`registro_ok warning_notification`}>
                <h2 className="txt_noti">
                  Mensaje de notificacion con texto largo para prueba de la
                  adaptabilidad del componente.
                </h2>
              </div>
              <div className="cerrar_noti" />
            </div>
            <div className="container_notificacion">
              <div className={`registro_ok success_notification`}>
                <h2 className="txt_noti">
                  Mensaje cuando la respuesta sea exitosa
                </h2>
              </div>
              <div className="cerrar_noti" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pruebas;
