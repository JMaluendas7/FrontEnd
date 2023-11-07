import React, { useState, useEffect} from "react";
import "/src/css/colaboradores/AddColaboradores.css";

const Contenido = () => {
  // Llamado a los tipos de documentos de identificacion
  const [dni, setDni] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/docsti/')
      .then((response) => response.json())
      .then((dni) => {
        setDni(dni);
      })
      .catch((error) => {
        console.error('Error al llamar a la API: ', error);
      });
  }, []);

  // Llamado a las empresas
  const [empresas, setEmpresas] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/bussines/')
      .then((response) => response.json())
      .then((empresas) => {
        setEmpresas(empresas);
      })
      .catch((error) => {
        console.error('Error al llamar a la API: ', error);
      });
  }, []);

  // Llamado a los diferentes roles de la empresa
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/rol/')
      .then((response) => response.json())
      .then((roles) => {
        setRoles(roles);
      })
      .catch((error) => {
        console.error('Error al llamar a la API: ', error);
      });
  }, []);

  const enviarSubmit = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);

    fetch('http://127.0.0.1:8000/addColaboradores/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.status === 201) {
          // Solicitud exitosa RTA 201
          console.log('Colaborador registrado con éxito.');
        } else {
          // Fallo de solicitud
          console.error('Error al registrar el colaborador.');
        }
      })
      .catch((error) => {
        console.error('Error al enviar la solicitud: ', error);
      });
  };

  
    // Falta tener IDs unicos
  return (
    <div className="Efect">
      <h1 className="titulo_login">Registro de Colaboradores</h1>
      <h3 className="subtitulo_logi">Gestion Humana</h3>
      <form method="post" onSubmit={enviarSubmit}>
        <div className="form">
          <div className="a">
            <div className="input-container">
              <select className="opciones dni" name="tipo_documento" defaultValue={"dni"}>
                <option value="dni" disabled>DNI</option>
                {dni.map((docTi, index) => (
                  <option key={index} value={docTi.id_tipoDocumento}>{docTi.denominacion}</option>
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
            <select className="opciones" name="empresa_id" defaultValue={"empresa"}>
              <option value="empresa" disabled>Empresa</option>
              {empresas.map((empresa, index) => (
                <option key={index} value={empresa.id_empresa}>{empresa.nombre_empresa}</option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <select className="opciones" name="cargo_id" defaultValue={"cargo"}>
              <option value="cargo" disabled>Cargo</option>
              <option value="opciosdfn2">Auxiliar de Recursos Humanos</option>
              <option value="opciodn3">Opción 3</option>
              <option value="opcison4">Opción 4</option>
            </select>
          </div>
          <div className="input-container">
            <select className="opciones" name="rol_id" defaultValue={"rol"}>
              <option value="rol" disabled>Rol</option>
              {roles.map((rol, index) => (
                <option key={index} value={rol.id_rol}>{rol.detalle_rol}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="submit-button" type="submit">Registrar Usuario</button>
      </form>
    </div>
  );
};

export default Contenido;