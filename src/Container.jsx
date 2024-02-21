import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
import recargar from "/src/img/icons_buttons/recargar.png";
import ContainerButtonsLeft from "./components/AdminButtonsLeft";

const Container = ({ Component, mostrarMensaje, username }) => {
  const [containerClass, setContainerClass] = useState("container-initial");
  const [moduleKey, setModuleKey] = useState(0); // Estado para almacenar una clave única del módulo

  const Modulo = useMemo(
    () => lazy(() => import(`./components/${Component}.jsx`)),
    [Component, moduleKey] // ModuleKey como dependencia del useMemo
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      setContainerClass("container-final");
    }, 70);
    return () => clearTimeout(delay);
  }, []);

  const reloadModule = () => {
    setModuleKey((prevKey) => prevKey + 1); // Actualizacion de moduleKey para forzar la recarga del módulo
  };

  return (
    <div className={`container ${containerClass}`}>
      {" "}
      <div className="buttons__VE">
        <button onClick={reloadModule} className="recargar" type="submit">
          <img className="volver_img" src={recargar}></img>
        </button>
      </div>
      <Suspense fallback={<ContainerButtonsLeft isLoading={true} />}>
        <Modulo
          key={moduleKey}
          mostrarMensaje={mostrarMensaje}
          username={username}
        />{" "}
      </Suspense>
    </div>
  );
};

export default Container;
