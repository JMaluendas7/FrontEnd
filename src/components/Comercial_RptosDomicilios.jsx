import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    const formData = new FormData();
    if (formattedStartDate && formattedEndDate) {
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("empresa", 277);
      formData.append("Opcion", 11);
      formData.append("SubOpcion", 0);
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
        "Debe seleccionar todos los campos",
        "warning_notification"
      );
    }
  };

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("startDate", formattedStartDate);
    data.append("Opcion", 11);
    data.append("SubOpcion", 0);
    data.append("empresa", 277);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "Estadisticas_DomiciliosPorLinea",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "year", label: "AÑO", type: "text" },
    { key: "mes", label: "MES", type: "text" },
    { key: "NOMBRE", label: "LINEA", type: "text" },
    { key: "cont", label: "CANTIDAD", type: "number" },
    { key: "VALOR", label: "VALOR", type: "number" },
  ];

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Domicilios por Linea</h1>
      <hr />
      <section className="colum_table forms__box">
        <div className="content__dateDH">{renderDatePicker()}</div>
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
