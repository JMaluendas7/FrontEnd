import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import ButtonGenerar from "./AdminButton";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

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
      formData.append("Opcion", 29);
      formData.append("SubOpcion", 1);
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
    data.append("Opcion", 29);
    data.append("SubOpcion", 1);
    data.append("empresa", 277);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "DetalladoCombustible",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  const columns = [
    { key: "pvh_EmpID", label: "ID EMPRESA", type: "text" },
    { key: "emp_nomempresa", label: "NOMBRE EMPRESA", type: "text" },
    { key: "pvh_year", label: "AÑO", type: "number" },
    { key: "pvh_mes", label: "MES", type: "number" },
    { key: "pvh_Bus", label: "BUS", type: "number" },
    { key: "pvh_placa", label: "PLACA", type: "text" },
    { key: "pvh_nomcto", label: "PRODUCTO", type: "text" },
    { key: "Egreso", label: "EGRESO", type: "number" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Detallado de Combustible</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">{renderDatePicker()}</section>
        <ButtonGenerar isLoading={isLoading} getData={getData} />
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
