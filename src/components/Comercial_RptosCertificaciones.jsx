import Button from "./AdminButton";
import InputDni from "./AdminInputDni";
import DynamicTable from "./AdminTable";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [dni, setdni] = useState("");

  const getData = async () => {
    if (dni) {
      const formData = new FormData();
      formData.append("documento", dni);
      getDataFunc(
        "Rp_certificaciones",
        formData,
        setIsLoading,
        setShowTable,
        setResults,
        mostrarMensaje
      );
    } else {
      mostrarMensaje(
        "Debes digitar el numero de documento",
        "warning_notification"
      );
    }
  };

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", 99);
    data.append("empresa", 277);
    generarExcelFunc(
      "XlsxRP_consultas01",
      data,
      "Estadisticas_Certificaciones",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "documento", label: "DOCUMENTO", type: "number" },
    { key: "apellido", label: "APELLIDO", type: "text" },
    { key: "nombres", label: "NOMBRE", type: "text" },
    { key: "empresa", label: "EMPRESA", type: "text" },
    { key: "numero", label: "NUMERO", type: "text" },
    { key: "importefinal", label: "IMPORTE FINAL", type: "number" },
    { key: "viaje", label: "VIAJE", type: "number" },
    { key: "Fecha", label: "FECHA", type: "text" },
    { key: "Hora", label: "HORA", type: "text" },
    { key: "origen", label: "ORIGEN", type: "text" },
    { key: "destino", label: "DESTINO", type: "text" },
    { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
  ];

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Certificaciones</h1>
      <hr />
      <section className="colum_table forms__box">
        <div className="form__init">
          <InputDni dni={dni} onChange={(e) => setdni(e.target.value)} />
          {Button({ isLoading, getData })}
        </div>
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
