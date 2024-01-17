import React, { lazy, Suspense, useMemo } from "react";
// import './components/Contenido';
// import './components/administracion/AddColaboradores';

const Container = ({ Component, mostrarMensaje, username }) => {
  const Modulo = useMemo(
    () => lazy(() => import(`./components/${Component}.jsx`)),
    [Component]
  );

  return (
    <div className="container">
      <Suspense fallback={<div class="loader"></div>}>
        <Modulo mostrarMensaje={mostrarMensaje} username={username} />
      </Suspense>
    </div>
  );
};

export default Container;
