import React, { useState } from "react";
import DynamicTable from "./AdminTable";
import getDataFunc from "./AdminGetData";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";
import Button from "./AdminButton";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("empresa", 277);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 31);
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
    data.append("Opcion", 31);
    data.append("SubOpcion", 0);
    data.append("empresa", 277);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "MicroSegurosReporte",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "Empresa", label: "EMPRESA", type: "text" },
    { key: "Año", label: "AÑO", type: "text" },
    { key: "Mes", label: "MES", type: "text" },
    { key: "Numero", label: "NUMERO", type: "text" },
    { key: "Nombre de la Agencia", label: "AGENCIA", type: "text" },
    { key: "Identificacion", label: "IDENTIFICACION", type: "text" },
    { key: "Fecha Documento", label: "FECHA DOCUMENTO", type: "text" },
    { key: "Egreso", label: "EGRESO", type: "number" },
    { key: "Ingreso", label: "INGRESO", type: "number" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte De MicroSeguros</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">{renderDatePicker()}</section>
        {Button({ isLoading, getData })}
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={100}
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
