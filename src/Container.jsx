import React, { lazy, Suspense, useMemo } from "react";
// import './components/Contenido';
// import './components/administracion/AddColaboradores';

const Container = ({ Component, mostrarMensaje }) => {
  const Modulo = useMemo(() => lazy(() => import(`./components/${Component}.jsx`)), [Component]);

  return (
    <div className="container">
      <Suspense fallback={<div>Cargando...</div>}>
        <Modulo mostrarMensaje={mostrarMensaje} />
      </Suspense>
    </div>
  );
};

export default Container;
