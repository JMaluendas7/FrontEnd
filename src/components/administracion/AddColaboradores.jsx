import React, { useState, useEffect } from "react";
import axios from "axios";
import TableRow from "./TableRow";
import "/src/css/administracion/AddColaboradores.css";

const Contenido = () => {
  // Trae los tipos de documentos de identificacion
  const [dni, setDni] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/docsti/")
      .then((response) => {
        setDni(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Llamado a las empresas
  const [empresas, setEmpresas] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/bussines/")
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Llamado a los diferentes roles de la empresa
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/rol/")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Estado para almacenar los colaboradores
  const [colaboradores, setColaboradores] = useState([]);

  // Llamado a lista de los colaboradores
  const getColaboradores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/colaboradores/");
      setColaboradores(response.data);
    } catch (error) {
      console.error("Error al llamar a la API: ", error);
    }
  };

  // Funcion para envio de datos y registro de Colaboradores
  const enviarSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    axios
      .post("http://127.0.0.1:8000/addColaboradores/", formData)
      .then((response) => {
        if (response.status === 200) {
          mostrarMensaje(
            "Colaborador Registrado Exitosamente",
            "green",
            "/src/img/ok.png"
          );
          getColaboradores();
        } else {
          console.error("Error al registrar el colaborador.");
          mostrarMensaje(
            "Colaborador No Registrado",
            "red",
            "/src/img/error.png"
          );
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud: ", error);
        mostrarMensaje(
          "Colaborador No Registrado",
          "red",
          "/src/img/error.png"
        );
      });
  };

  // Notificacion de Registo *Se debe Mejorar*
  const [mensaje, setMensaje] = useState({
    visible: false,
    mensaje: "",
    color: "",
    imagen: "",
  });
  const mostrarMensaje = (mensaje, color, imagen) => {
    setMensaje({
      visible: true,
      mensaje,
      color,
      imagen,
    });
    setTimeout(() => {
      setMensaje({
        visible: false,
        mensaje: "",
        imagen: "",
      });
    }, 6000);
  };

  // Llama a la función para obtener los datos de los colaboradores cuando el componente se monta
  useEffect(() => {
    getColaboradores();
  }, []);

  // useState para contener el valor de busqueda
  const [searchValue, setSearchValue] = useState("");

  // Funcion para actualizar el useState de busqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Funcion para filtrado de datos
  const filteredColaboradores = colaboradores.filter((colaborador) => {
    const fullName = `${colaborador.num_documento} ${colaborador.nombres} ${colaborador.apellidos}`;
    return fullName.toLowerCase().includes(searchValue.toLowerCase());
  });


  // Funcion abrir cerrar formulario
  const [showForm, setShowForm] = useState(false);

  // Función para manejar la visualización del formulario al hacer clic en el botón
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Estados y funciones para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredColaboradores.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalRows = filteredColaboradores.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  // jK skldjflsfjskdfjs
    // Estado para el ordenamiento
  const [orderBy, setOrderBy] = useState({
    field: "",
    type: "asc", // o "desc"
  });

  // Función para cambiar el orden
  const handleOrderBy = (field) => {
    if (orderBy.field === field) {
      setOrderBy({
        ...orderBy,
        type: orderBy.type === "asc" ? "desc" : "asc",
      });
    } else {
      setOrderBy({
        field,
        type: "asc",
      });
    }
  };

  // ... (tu código actual)

  // Aplicar el ordenamiento a los datos mostrados
  const sortedRows = [...currentRows].sort((a, b) => {
    if (orderBy.type === "asc") {
      return a[orderBy.field] > b[orderBy.field] ? 1 : -1;
    } else {
      return a[orderBy.field] < b[orderBy.field] ? 1 : -1;
    }
  });

  // Falta tener IDs unicos
  return (
    <div className="Efect">
      <h1 className="titulo_login">Administracion de Colaboradores</h1>
      <h3 className="subtitulo_logi">Gestion Humana</h3>
      <section className="usuarios__container">
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
                <th className="colum">Numero Documento</th>
                <th className="colum" onClick={() => handleOrderBy("nombres")}>Nombre</th>
                <th className="colum" onClick={() => handleOrderBy("apellidos")}>Apellido</th>
                <th className="colum">Telefono</th>
                <th className="colum">EMail</th>
                <th className="colum">Contrato</th>
                <th className="colum">Direccion</th>
                <th className="colum">Ciudad</th>
                <th className="colum">Rol</th>
                <th className="colum">Empresa</th>
                <th className="fijo">Emp</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((colaborador) => (
                <TableRow
                  key={colaborador.num_documento} // Establece 'key' directamente aquí
                  colaborador={colaborador}
                  colaboradores={filteredColaboradores}
                  setColaboradores={setColaboradores}
                  getColaboradores={getColaboradores}
                  mostrarMensaje={mostrarMensaje}
                  empresas={empresas}
                  roles={roles}
                />
              ))}
            </tbody>
          </table>
        </section>
        <div>
          {/* Controles de paginación */}
          {pageNumbers.map((number) => (
            <button key={number} onClick={() => paginate(number)}>
              {number}
            </button>
          ))}
        </div>
      </section>

      {/* Seccion de Registro de colaboraadores */}
      <button className="agregar" type="none" onClick={toggleForm}>
        <img className="img__options" src="/src/img/add_user.png" alt="Add User" />
        <p>Agregar colaborador</p>
      </button>
      <section className={`form ${showForm ? 'show-form' : ''}`} >

        <h1>Agregar Colaborador</h1>
        <button className="cerrar__agregar" onClick={toggleForm}>
          <img className="icon__cerrar" src="/src/img/eliminar.png" alt="Cerrar"/>
        </button>
        <form method="post" onSubmit={enviarSubmit}>
          <div className="camp__form">
            <div className="a">
              <div className="input-container">
                <select
                  className="opciones dni"
                  name="tipo_documento"
                  defaultValue={"dni"}
                  >
                  <option value="dni" disabled>
                    DNI
                  </option>
                  {dni.map((docTi, index) => (
                    <option key={index} value={docTi.id_tipodocumento}>
                      {docTi.denominacion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-container">
                <input
                  id="numDocumento"
                  name="numDocumento"
                  className="input-field numId"
                  placeholder=""
                  type="number"
                  />
                <label className="input-label" htmlFor="numDocumento">
                  Numero Identificacion
                </label>
              </div>
            </div>

            <div className="b">
              <div className="input-container agg_colaborador">
                <input
                  id="nombre"
                  name="nombre"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label" htmlFor="nombre">
                  Nombres
                </label>
              </div>
              <div className="input-container agg_colaborador">
                <input
                  id="apellido"
                  name="apellido"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label" htmlFor="apellido">
                  Apellidos
                </label>
              </div>
            </div>
            <div className="c">
              <div className="input-container agg_colaborador">
                <input
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder=""
                  type="email"
                  />
                <label className="input-label" htmlFor="email">
                  Email
                </label>
              </div>
              <div className="input-container agg_colaborador">
                <input
                  id="direccion"
                  name="direccion"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label" htmlFor="direccion">
                  Direccion
                </label>
              </div>
              <div className="input-container agg_colaborador">
                <input
                  id="ciudad"
                  className="input-field"
                  placeholder=""
                  type="text"
                  name="ciudad"
                  />
                <label className="input-label" htmlFor="ciudad">
                  Ciudad
                </label>
              </div>
            </div>
            <div className="d">
              <div className="input-container agg_colaborador">
                <input
                  id="telefono"
                  className="input-field"
                  placeholder="Telefono"
                  type="number"
                  name="telefono"
                  />
                <label className="input-label" htmlFor="telefono">
                  Telefono
                </label>
              </div>
              <div className="input-container agg_colaborador">
                <input
                  id="contrato_id"
                  className="input-field"
                  placeholder=""
                  type="number"
                  name="contrato_id"
                  />
                <label className="input-label" htmlFor="contrato_id">
                  Numero de Contrato
                </label>
              </div>
            </div>
            <div className="e">
              <div className="input-container agg_colaborador">
                <select
                  className="opciones"
                  name="empresa_id"
                  defaultValue={"empresa"}
                  >
                  <option value="empresa" disabled>
                    Empresa
                  </option>
                  {empresas.map((empresa, index) => (
                    <option key={index} value={empresa.id_empresa}>
                      {empresa.nombre_empresa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container agg_colaborador">
                <select
                  className="opciones"
                  name="cargo_id"
                  defaultValue={"cargo"}
                  >
                  <option value="cargo" disabled>
                    Cargo
                  </option>
                  <option value="opciosdfn2">Auxiliar de Recursos Humanos</option>
                  <option value="opciodn3">Opción 3</option>
                  <option value="opcison4">Opción 4</option>
                </select>
              </div>
              <div className="input-container agg_colaborador">
                <select className="opciones" name="rol_id" defaultValue={"rol"}>
                  <option value="rol" disabled>
                    Rol
                  </option>
                  {roles.map((rol, index) => (
                    <option key={index} value={rol.id_rol}>
                      {rol.detalle_rol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button className="submit-button" type="submit">
            Registrar Usuario
          </button>
        </form>
      </section>
      <div className="container__botton-fixed"></div>
      <div>
        {mensaje.visible && (
          <div id="notificaciones" className="notificaciones">
            <div className={`registro_ok ${mensaje.color}`}>
              <img className="imgnoti" src={mensaje.imagen} alt="" />
              <h2>{mensaje.mensaje}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contenido;
