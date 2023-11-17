import React, { useEffect } from "react";

const Notificacion = ({ mensaje, color, imagen }) => {
  return (
    <div id="notificaciones" className="notificaciones">
      <div className={`registro_ok ${color}`}>
        <img className="imgnoti" src={`src/img/${imagen}.png`} alt="" />
        <h2>{mensaje}</h2>
      </div>
    </div>
  );
};

export default Notificacion;
