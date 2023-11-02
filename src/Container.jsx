import React, { lazy, Suspense } from "react";
import "./css/contenido.css";

const Container = ({ Component }) => {
  const Modulo = lazy(() => import(`./components/${Component}`));

  return (
    <div className="container">
      <Suspense fallback={<div>Cargando...</div>}>
        <Modulo />
      </Suspense>
    </div>
  );
};

export default Container;
