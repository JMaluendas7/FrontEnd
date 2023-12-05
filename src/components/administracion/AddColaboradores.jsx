import React, { useState, useEffect } from "react";
import axios from "axios";
import TableRow from "./TableRow";

const Contenido = ({ mostrarMensaje }) => {
  // Trae los tipos de documentos de identificacion
  const [dni, setDni] = useState([]);
  const docsTi = async () => {
    await axios.get("http://127.0.0.1:8000/api/docsti/").then((response) => {
      setDni(response.data);
    });
  };
  // Llamado a las empresas
  const [empresas, setEmpresas] = useState([]);
  const bussines = async () => {
    await axios.get("http://127.0.0.1:8000/api/bussines/").then((response) => {
      setEmpresas(response.data);
    });
  };
  // Llamado a los cargos
  const [cargos, setCargos] = useState([]);
  const getCargos = async () => {
    await axios.get("http://127.0.0.1:8000/api/cargos/").then((response) => {
      setCargos(response.data);
    });
  };

  // Llamado a los diferentes roles de la empresa
  const [roles, setRoles] = useState([]);
  const rol = async () => {
    await axios.get("http://127.0.0.1:8000/api/rol/").then((response) => {
      setRoles(response.data);
    });
  };

  // Estado para almacenar los colaboradores
  const [colaboradores, setColaboradores] = useState([]);

  // Llamado a lista de los colaboradores
  const getColaboradores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/colaboradores/");
      setColaboradores(response.data);
    } catch (error) {
      mostrarMensaje(
        "No se pueden visualizar los colaboradores",
        "error_notification"
      );
    }
  };

  // Al cargar la pagina se llaman las sgts funciones
  useEffect(() => {
    getColaboradores();
    getCargos();
    bussines();
    docsTi();
    rol();
  }, []);

  const generarExcel = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generar_excel/",
        colaboradores,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // Asegúrate de enviar las credenciales
        }
      );
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un enlace (link) para iniciar la descarga
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "colaboradores.xlsx"); // Nombre del archivo
      document.body.appendChild(link);

      // Hacer clic en el enlace para iniciar la descarga
      link.click();

      // Limpiar el objeto URL y el enlace después de la descarga
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

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
    if (editColaborador) {
      setShowForm(!showForm);
      setEditColaborador(null); // Reinicia el colaborador seleccionado al cerrar el formulario
    } else {
      setShowForm(!showForm);
    }
  };

  // Estados y funciones para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredColaboradores.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const paginacion = (pageNumber) => setCurrentPage(pageNumber);

  const totalRows = filteredColaboradores.length;
  const numeroPaginas = [];
  for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
    numeroPaginas.push(i);
  }

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

  // Aplicar el ordenamiento a los datos mostrados
  const sortedRows = [...currentRows].sort((a, b) => {
    if (orderBy.type === "asc") {
      return a[orderBy.field] > b[orderBy.field] ? 1 : -1;
    } else {
      return a[orderBy.field] < b[orderBy.field] ? 1 : -1;
    }
  });

  // Estado para almacenar los detalles del colaborador seleccionado para editar
  const [editColaborador, setEditColaborador] = useState(null);
  const [editColaboradorData, setEditColaboradorData] = useState(null);

  const selectColaborador = (
    tipo_documento,
    numDocumento,
    nombres,
    apellidos,
    telefono,
    email,
    cargo_id,
    direccion,
    ciudad,
    rol_id,
    empresa_id
  ) => {
    setEditColaborador(numDocumento);
    setShowForm(true); // Muestra el formulario al seleccionar un colaborador para editar
    setEditColaboradorData({
      tipo_documento,
      numDocumento,
      nombres,
      apellidos,
      telefono,
      email,
      cargo_id,
      direccion,
      ciudad,
      rol_id,
      empresa_id,
    });
    console.log(editColaboradorData.empresa_id); // Use optional chaining to avoid errors if editColaboradorData is null
  };

  // Función para envío de datos y registro de Colaboradores
  const enviarSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dataToUpdate = {
      num_documento: editColaboradorData.num_documento,
      nombres: editColaboradorData.nombres,
      apellidos: editColaboradorData.apellidos,
      telefono: editColaboradorData.telefono,
      email: editColaboradorData.email,
      direccion: editColaboradorData.direccion,
      ciudad: editColaboradorData.ciudad,
      cargo_id: editColaboradorData.cargo_id,
      rol_id: editColaboradorData.rol_id,
      empresa_id: editColaboradorData.empresa_id,
    };

    // Usa editColaborador para determinar si estás editando o agregando un nuevo colaborador
    const apiUrl = editColaborador
      ? `http://127.0.0.1:8000/colaboradoresput/${editColaboradorData.numDocumento}/`
      : `http://127.0.0.1:8000/addColaboradores/6/1/`;

    axios
      .put(apiUrl, editColaborador ? dataToUpdate : formData)
      .then((response) => {
        if (response.status === 200) {
          mostrarMensaje(
            editColaborador
              ? "Colaborador Actualizado Exitosamente"
              : "Colaborador Registrado Exitosamente",
            "success_notification"
          );
          setShowForm(false); // Oculta el formulario después de editar/agregar
          setEditColaborador(null); // Reinicia el colaborador seleccionado
          getColaboradores();
        }
      })
      .catch(() => {
        mostrarMensaje(
          `Colaborador ${editColaborador ? "no Actualizado" : "no Registrado"}`,
          "error_notification"
        );
      });
  };

  const handleInputChange = (colaboradorId, field, value) => {
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
            className="input-field input-field__search"
            placeholder=""
            value={searchValue}
            onChange={handleSearchChange}
          />
          <label className="input-label input-label__search" htmlFor="search">
            Buscar por cedula o nombre
          </label>
        </div>
        <section className="container__table">
          <table className="filas__container">
            <thead>
              <tr className="title__campos">
                <th className="colum">Numero Documento</th>
                <th className="colum" onClick={() => handleOrderBy("nombres")}>
                  <div className="colum__title">
                    <p className="colum__name">Nombre</p>
                    <figure className="colum__icon-cont">
                      <img className="colum__icon" src="/src/img/ordenar.png" />
                      <div className="overlay"></div>
                    </figure>
                  </div>
                </th>
                <th
                  className="colum"
                  onClick={() => handleOrderBy("apellidos")}
                >
                  <div className="colum__title">
                    <p className="colum__name">Apellido</p>
                    <figure className="colum__icon az"></figure>
                  </div>
                </th>
                <th className="colum">Telefono</th>
                <th className="colum">EMail</th>
                <th
                  className="colum"
                  onClick={() => handleOrderBy("contrato_id")}
                >
                  Cargo
                </th>
                <th className="colum">
                  <div className="colum__title">
                    <p className="colum__name">Direccion</p>
                    <figure className="colum__icon-cont">
                      <img className="colum__icon" src="/src/img/ordenar.png" />
                      <div className="overlay"></div>
                    </figure>
                  </div>
                </th>
                <th className="colum">Ciudad</th>
                <th className="colum">Rol</th>
                <th className="colum">Empresa</th>
                <th className="fijo"></th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((colaborador) => (
                <TableRow
                  key={colaborador.num_documento}
                  colaborador={colaborador}
                  colaboradores={filteredColaboradores}
                  setColaboradores={setColaboradores}
                  getColaboradores={getColaboradores}
                  mostrarMensaje={mostrarMensaje}
                  selectColaborador={selectColaborador}
                  empresas={empresas}
                  roles={roles}
                  cargos={cargos}
                />
              ))}
            </tbody>
          </table>
        </section>
        <div className="button__paginacion">
          {/* Controles de paginación */}
          {numeroPaginas.map((number) => (
            <button key={number} onClick={() => paginacion(number)}>
              {number}
            </button>
          ))}
        </div>
      </section>

      {/* Seccion de Registro de colaboraadores */}
      <section className="container_buttons">
        <button className="agregar" type="none" onClick={toggleForm}>
          <img
            className="img__options"
            src="/src/img/agregar_user.png"
            alt="Add User"
          />
          <p>Agregar colaborador</p>
        </button>
        <button className="agregar" type="none" onClick={generarExcel}>
          <img
            className="img__options"
            src="/src/img/rpto_excel.png"
            alt="Add User"
          />
          <p>Excel Colaboradores</p>
        </button>
      </section>
      <section className={`form ${showForm ? "show-form" : ""}`}>
        <h1 className="title__form">
          {editColaborador ? "Editar Colaborador" : "Agregar Colaborador"}
        </h1>
        <button className="cerrar__agregar" onClick={toggleForm}>
          <img
            className="icon__cerrar"
            src="/src/img/cerrar.png"
            alt="Cerrar"
          />
        </button>

        <form method="post" onSubmit={enviarSubmit}>
          <div className="camp__form">
            <div className="dropdown__input">
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
                  value={
                    editColaboradorData ? editColaboradorData.numDocumento : ""
                  }
                  onChange={(e) =>
                    setEditColaboradorData({
                      ...editColaboradorData,
                      numDocumento: e.target.value,
                    })
                  }
                />
                <label className="input-label label__form">
                  Numero Identificacion
                </label>
              </div>
            </div>
            <div className="input-container agg_colaborador">
              <input
                id="nombre"
                name="nombre"
                className="input-field"
                placeholder=""
                type="text"
                value={editColaboradorData ? editColaboradorData.nombres : ""}
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    nombres: e.target.value,
                  })
                }
              />
              <label className="input-label label__form">Nombres</label>
            </div>
            <div className="input-container agg_colaborador">
              <input
                id="apellido"
                name="apellido"
                className="input-field"
                placeholder=""
                type="text"
                value={editColaboradorData ? editColaboradorData.apellidos : ""}
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    apellidos: e.target.value,
                  })
                }
              />
              <label className="input-label label__form">Apellidos</label>
            </div>
            <div className="input-container agg_colaborador">
              <input
                id="email"
                name="email"
                className="input-field"
                placeholder=""
                type="email"
                value={editColaboradorData ? editColaboradorData.email : ""}
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    email: e.target.value,
                  })
                }
              />
              <label className="input-label label__form">Email</label>
            </div>
            <div className="input-container agg_colaborador">
              <input
                id="direccion"
                name="direccion"
                className="input-field"
                placeholder=""
                type="text"
                value={editColaboradorData ? editColaboradorData.direccion : ""}
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    direccion: e.target.value,
                  })
                }
              />
              <label className="input-label label__form">Direccion</label>
            </div>
            <div className="input-container agg_colaborador">
              <input
                id="ciudad"
                className="input-field"
                placeholder=""
                type="text"
                name="ciudad"
                value={editColaboradorData ? editColaboradorData.ciudad : ""}
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    ciudad: e.target.value,
                  })
                }
              />
              <label className="input-label label__form">Ciudad</label>
            </div>
            <div className="input-container agg_colaborador">
              <input
                id="telefono"
                className="input-field"
                placeholder="Telefono"
                type="number"
                name="telefono"
                value={editColaboradorData ? editColaboradorData.telefono : ""}
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    telefono: e.target.value,
                  })
                }
              />
              <label className="input-label label__form">Telefono</label>
            </div>
            <div className="input-container agg_colaborador">
              <select
                className="opciones"
                name="empresa_id"
                defaultValue={
                  editColaboradorData ? editColaboradorData.empresa_id : ""
                }
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    empresa_id: e.target.value,
                  })
                }
              >
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
                defaultValue={
                  editColaboradorData ? editColaboradorData.cargo_id : ""
                }
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    cargo_id: e.target.value,
                  })
                }
              >
                {cargos.map((cargo, index) => (
                  <option key={index} value={cargo.id_cargo}>
                    {cargo.detalle_cargo}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container agg_colaborador">
              <select
                className="opciones"
                name="rol_id"
                defaultValue={
                  editColaboradorData ? editColaboradorData.rol_id : ""
                }
                onChange={(e) =>
                  setEditColaboradorData({
                    ...editColaboradorData,
                    rol_id: e.target.value,
                  })
                }
              >
                {roles.map((rol, index) => (
                  <option key={index} value={rol.id_rol}>
                    {rol.detalle_rol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="submit-button" type="submit">
            {editColaborador ? "Actualizar Usuario" : "Registrar Usuario"}
          </button>
        </form>
      </section>
      <div className="container__botton-fixed"></div>
    </div>
  );
};

export default Contenido;
