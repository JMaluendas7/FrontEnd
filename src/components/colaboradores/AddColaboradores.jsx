import React, { useState, useEffect } from "react";
import TableRow from "./TableRow";
import "/src/css/colaboradores/AddColaboradores.css";

const Contenido = () => {
  // Llamado a los tipos de documentos de identificacion
  const [dni, setDni] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/docsti/")
      .then((response) => response.json())
      .then((dni) => {
        setDni(dni);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Llamado a las empresas
  const [empresas, setEmpresas] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bussines/")
      .then((response) => response.json())
      .then((empresas) => {
        setEmpresas(empresas);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Llamado a los diferentes roles de la empresa
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/rol/")
      .then((response) => response.json())
      .then((roles) => {
        setRoles(roles);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  }, []);

  // Funcion para envio de datos y registro de Colaboradores
  const enviarSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch("http://127.0.0.1:8000/addColaboradores/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          // Solicitud exitosa RTA 200
          console.log("Colaborador registrado con éxito.");
          mostrarMensaje();
          fetchColaboradores();
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
    }, 5000);
  };

  // Llamado a lista de los colaboradores
  // Estado para almacenar los colaboradores
  const [colaboradores, setColaboradores] = useState([]);
  const [editableFields, setEditableFields] = useState({});
  // Función para obtener los datos de los colaboradores desde la API
  const fetchColaboradores = async () => {
    fetch("http://127.0.0.1:8000/colaboradores/")
      .then((response) => response.json())
      .then((data) => {
        setColaboradores(data);
        // Inicializa el estado editableFields con campos editables en falso
        const initialEditableFields = {};
        data.forEach((colaborador) => {
          initialEditableFields[colaborador.id] = false;
        });
        setEditableFields(initialEditableFields);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  };

  // Llama a la función para obtener los datos de los colaboradores cuando el componente se monta
  useEffect(() => {
    fetchColaboradores();
  }, []);

  // Función para manejar los cambios de los campos editables
  const handleFieldChange = (colaboradorId, field, value) => {
    // Crea una copia de los colaboradores
    const updatedColaboradores = [...colaboradores];
    // Encuentra el colaborador que deseas editar
    const colaborador = updatedColaboradores.find((c) => c.id === colaboradorId);
    // Actualiza el valor del campo
    colaborador[field] = value;
    // Actualiza el estado de los colaboradores
    setColaboradores(updatedColaboradores);
  };

  // Función para cancelar la edición en una fila de la tabla
  const cancelarEdicion = (colaboradorId) => {
    // Obtiene el colaborador original antes de cualquier cambio
    const colaboradorOriginal = colaboradores.find((c) => c.id === colaboradorId);

    // Crea una copia de los colaboradores
    const updatedColaboradores = [...colaboradores];

    // Encuentra el colaborador que deseas editar
    const colaborador = updatedColaboradores.find((c) => c.id === colaboradorId);

    // Restaura los valores originales del colaborador
    colaborador.nombres = colaboradorOriginal.nombres;
    colaborador.apellidos = colaboradorOriginal.apellidos;
    colaborador.telefono = colaboradorOriginal.telefono;

    // Actualiza el estado de los colaboradores
    setColaboradores(updatedColaboradores);

    // Luego, cambia el estado para indicar que la fila ya no está en modo de edición.
    toggleEditField(colaboradorId);
  };

  // Función para cambiar el estado de editable de un campo
  const toggleEditField = (colaboradorId) => {
    setEditableFields((prevEditableFields) => ({
      ...prevEditableFields,
      [colaboradorId]: !prevEditableFields[colaboradorId],
    }));
  };

  // Falta tener IDs unicos
  return (
    <div className="Efect">
      <h1 className="titulo_login">Administracion de Colaboradores</h1>
      <h3 className="subtitulo_logi">Gestion Humana</h3>

      <section className="usuarios__container">
      <h1>Lista de Colaboradores</h1>
      <table className="usuarios__container">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Numero Documento</th>
            <th>Telefono</th>
            <th>EMail</th>
            <th>Contrato</th>
            <th>Direccion</th>
            <th>Ciudad</th>
            <th>Rol</th>
            <th>Empresa</th>
          </tr>
        </thead>
        <tbody>
        {colaboradores.map((colaborador) => (
          <TableRow
            key={colaborador.id}
            colaborador={colaborador}
            editable={editableFields[colaborador.id]}
            onEdit={toggleEditField}
            // onSave={guardarCambios} // Implementa la función guardarCambios
            onCancel={cancelarEdicion} // Implementa la función cancelarEdicion
            onChange={handleFieldChange}
          />
        ))}
        </tbody>
      </table>
      </section>

      {/* Seccion de Registro de colaboraadores */}
      <h1>Crear Colaborador</h1>
      <form method="post" onSubmit={enviarSubmit}>
        <div className="form">
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
            <div className="input-container nom">
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
            <div className="input-container nom">
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
            <div className="input-container dir">
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
            <div className="input-container dir">
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
            <div className="input-container dir">
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
            <div className="input-container tel">
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
            <div className="input-container tel">
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
          <div className="input-container">
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
          <div className="input-container">
            <select className="opciones" name="cargo_id" defaultValue={"cargo"}>
              <option value="cargo" disabled>
                Cargo
              </option>
              <option value="opciosdfn2">Auxiliar de Recursos Humanos</option>
              <option value="opciodn3">Opción 3</option>
              <option value="opcison4">Opción 4</option>
            </select>
          </div>
          <div className="input-container">
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
        <button className="submit-button" type="submit">
          Registrar Usuario
        </button>
      </form>
      <div>
        {mensajeVisible && (
          <div id="notificaciones" className="notificaciones">
            <div className="registro_ok">
              <h2>Colaborador Registrado Exitosamente</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contenido;
