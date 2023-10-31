import React from 'react';
import './css/contenido.css'; // Importa el archivo de estilos CSS

const Container = ({ children }) => {
  return (
    <div className="container">
      {children}
    </div>
  );
};

export default Container;
