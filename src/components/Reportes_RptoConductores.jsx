import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    getDataFunc(
      "RptoConductores",
      null,
      setIsLoading,
      setShowTable,
      setResults,
      mostrarMensaje
    );
  };

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", 99);
    generarExcelFunc(
      "generarRptoConductores",
      data,
      "InformeDeEstadoConductoresEnFics",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "numero_bus", label: "N° BUS", type: "number" },
    { key: "matricula", label: "MATRICULA", type: "text" },
    { key: "nombre", label: "NOMBRE", type: "text" },
    { key: "apellido", label: "APELLIDO", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "number" },
    { key: "estado", label: "ESTADO", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reportes de Conductores</h1>
      <hr />
      <section className="colum_table forms__box">
        <p>Informe del Estado de Conductores en Fics</p>
        {Button({ isLoading, getData })}
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={20}
              updatedData={updateTableData}
            />
          </div>
        </div>
      )}
      {ContainerButtonsLeft({ isLoading, showTable, generarExcel })}
    </div>
  );
};

export default Inicio;
