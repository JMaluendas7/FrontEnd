import Button from "./AdminButton";
import InputDni from "./AdminInputDni";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [dni, setdni] = useState("");

  const getData = async () => {
    if (dni) {
      const now = new Date();
      const formattedNow = now.toISOString().split(".")[0] + "Z";

      const formData = new FormData();
      formData.append("empresa", 277);
      formData.append("startDate", formattedNow);
      formData.append("endDate", formattedNow);
      formData.append("Opcion", 12);
      formData.append("SubOpcion", 0);
      formData.append("Cadena01", dni);

      getDataFunc(
        "RP_Consultas05",
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
    data.append("Opcion", 12);
    data.append("SubOpcion", 0);
    data.append("empresa", 277);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "Estadisticas_ViajesPorPasajero",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "nombre", label: "EMPRESA", type: "text" },
    { key: "viaje", label: "VIAJE", type: "number" },
    { key: "fechapartida", label: "F PARTIDA", type: "text" },
    { key: "vehiculo", label: "VEHICULO", type: "text" },
    { key: "NUMERO", label: "NUMERO", type: "text" },
    { key: "importefinal", label: "IMPORTE FINAL", type: "number" },
    { key: "LINEA", label: "LINEA", type: "text" },
    { key: "origen", label: "ORIGEN", type: "text" },
    { key: "destino", label: "DESTINO", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "number" },
    { key: "nombres", label: "NOMBRE", type: "text" },
    { key: "apellido", label: "APELLIDO", type: "text" },
    { key: "telefonos", label: "TELEFONO", type: "text" },
    { key: "email", label: "EMAIL", type: "text" },
  ];

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Viajes Por Pasajero</h1>
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
