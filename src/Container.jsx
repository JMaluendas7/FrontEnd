import React, { lazy, Suspense } from "react";
import "./css/contenido.css";

const Container = ({ Component, mostrarMensaje }) => {
  const Modulo = lazy(() => import(`./components/${Component}`));

  return (
    <div className="container">
      <Suspense fallback={<div>Cargando...</div>}>
        <Modulo mostrarMensaje={mostrarMensaje} />
      </Suspense>
    </div>
  );
};

export default Container;
