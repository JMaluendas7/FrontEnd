import React, { lazy, Suspense, useMemo } from "react";

const Container = ({ Component, mostrarMensaje }) => {
  const Modulo = useMemo(() => lazy(() => import(`./components/${Component}`)), [Component]);

  return (
    <div className="container">
      <Suspense fallback={<div>Cargando...</div>}>
        <Modulo mostrarMensaje={mostrarMensaje} />
      </Suspense>
    </div>
  );
};

export default Container;
