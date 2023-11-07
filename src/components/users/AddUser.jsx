import React from "react";
import "/src/css/users/AddUser.css";


const Contenido = () => {
  return (
    <div className="Efect">
      <h1 className="titulo_login">Registro de Usuarios</h1>
      <h3 className="subtitulo_logi">Registro de usuarios para acceso al aplicativo</h3>
      <form method="post" action="">
        <div className="form-regUsers">
          <div className="cc input-container">
            <input
              id="num_identificacion"
              className="input-field"
              placeholder="Tipo de Identificacion"
              type="number"
              name="num_identificacion"
              />
            <label className="input-label" htmlFor="num_identificacion">
              Num Identificacion
            </label>
          </div>
          <div className="user input-container">
            <input
              id="usuario"
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
              id="pass"
              className="input-field"
              placeholder=""
              type="password"
              />
            <label className="input-label" htmlFor="pass">
              Contrasena
            </label>
          </div>
          <label class="custom-checkbox">
            <input type="checkbox"/>
            <span class="checkmark"></span> Es Super Usuario
          </label>
        </div>
        <button class="submit-button" type="submit">Registrar Usuario</button>
      </form>
    </div>
  );
};

export default Contenido;

{/* <div className="input-container">
  <input
    id="nombres"
    className="input-field"
    placeholder="Nombres"
    name="nombres"
    type="text"
  />
  <label className="input-label" htmlFor="nombres">
    Nombres
  </label>
</div>
<div className="input-container">
  <input
    id="Apellidos"
    className="input-field"
    placeholder="Apellidos"
    type="text"
  />
  <label className="input-label" htmlFor="Apellidos">
    Apellidos
  </label>
</div> */}