import React from "react";
import "./css/contenido.css";

const Container = ({ children }) => {
  return (
    <div className="container">
      {children}
      <h1 className="container-title">Titulo Prueba</h1>
    </div>
  );
};

export default Container;
