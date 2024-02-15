import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";

const Container = ({ Component, mostrarMensaje, username }) => {
  const [containerClass, setContainerClass] = useState("container-initial");

  const Modulo = useMemo(
    () => lazy(() => import(`./components/${Component}.jsx`)),
    [Component]
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      setContainerClass("container-final");
    }, 70);
    return () => clearTimeout(delay);
  }, []);

  return (
    <div className={`container ${containerClass}`}>
      <Suspense fallback={<div className="loader"></div>}>
        <Modulo mostrarMensaje={mostrarMensaje} username={username} />
      </Suspense>
    </div>
  );
};

export default Container;
