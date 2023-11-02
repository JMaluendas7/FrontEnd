import React from "react";

const Contenidodos = () => {
  return (
    <div className="efect">
      <h1 className="titulo_login">Prueba</h1>
      <form method="post" action="">
        <div className="input-container">
          <input
            id="inputField"
            className="input-field"
            placeholder="Nombre"
            type="text"
          />
          <label className="input-label" htmlFor="inputField">
            Nombre
          </label>
        </div>
        <div className="input-container">
          <input
            id="inputField2"
            className="input-field2"
            placeholder="Apellido"
            type="text"
          />
          <label className="input-label2" htmlFor="inputField2">
            Apellido
          </label>
        </div>

        <button type="submit">Iniciar Sesion</button>
      </form>
    </div>
  );
};

export default Contenidodos;
