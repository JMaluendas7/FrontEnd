import React from "react";
import "./css/contenido.css";

const Container = ({ component }) => {
  return (
    <div className="container">
      {component && React.createElement(component)}
      <h1>Hola</h1>
    </div>
  );
};

export default Container;
