import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Fuec = ({ mostrarMensaje }) => {
  const [dni, setdni] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const getData = async () => {
    if (dni) {
      const formData = new FormData();
      formData.append("dni", dni);
      getDataFunc(
        "Pvu",
        formData,
        setisLoading,
        setShowTable,
        setResults,
        mostrarMensaje
      );
    } else {
      mostrarMensaje("Debes dar el numero de bus", "warning_notification");
    }
  };

  const PvuInactivate = async (dni) => {
    if (dni) {
      const formData = new FormData();
      formData.append("dni", dni);
      try {
        const response = getDataFunc(
          "PvuInactivate",
          formData,
          setisLoading,
          setShowTable,
          setResults,
          mostrarMensaje
        );
        if (response.response.status == 200) {
          mostrarMensaje(
            "Usuario con DNI " + dni + "fue desactivado",
            "success_notification"
          );
        }
      } catch {}
    } else {
      mostrarMensaje(
        "Debes proporcionar el N° Documento o Nombre",
        "warning_notification"
      );
    }
  };

  const [tableData, setResults] = useState([]);

  const columns = [
    { key: "Documento", label: "DOCUMENTO", type: "number" },
    { key: "Apellido", label: "APELLIDO", type: "text" },
    { key: "Nombres", label: "NOMBRES", type: "text" },
    { key: "Email", label: "EMAIL", type: "text" },
    { key: "Estado", label: "ESTADO", type: "text" },
    { key: "Usuario", label: "USUARIO", type: "number" },
    { key: "Password", label: "PASSWORD", type: "text" },
  ];

  const updateTableData = (updatedData) => {
    setResults(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login title_fuec">PVU</h1>
      <hr />
      <form className="forms__box" method="post">
        <div className="form__init">
          <div className="input-container">
            <input
              className="input-field-large icon_input_dni"
              placeholder=""
              type="text"
              value={dni}
              onChange={(e) => setdni(e.target.value)}
            />
            <label className="input-label">
              N° Documento o Nombre de Cliente
            </label>
          </div>
          <Button isLoading={isLoading} getData={getData} />
        </div>
      </form>
      {showTable && (
        <div className="results__box">
          <div className="table_fuecOD">
            <DynamicTable
              data={tableData}
              columns={columns}
              itemsPerPage={30}
              updatedData={updateTableData}
              onCheckboxClick={PvuInactivate}
            />
          </div>
        </div>
      )}
      {ContainerButtonsLeft({ isLoading, showTable })}
    </div>
  );
};

export default Fuec;
