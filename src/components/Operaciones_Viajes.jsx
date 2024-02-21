import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./AdminTable";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";
import Button from "./AdminButton";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 0);
      formData.append("SubOpcion", 0);
      formData.append("empresa", empresa);
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
    data.append("Opcion", 0);
    data.append("SubOpcion", 0);
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "ReporteOperacionesViajes",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "AAA", label: "Año", type: "number" },
    { key: "mes", label: "Mes", type: "text" },
    { key: "CATEGORIA", label: "CATEGORIA", type: "text" },
    { key: "Nbuses", label: "BUSES", type: "number" },
    { key: "tipoviaje", label: "TIPO VIAJE", type: "text" },
    { key: "TOTAL", label: "TOTAL", type: "text" },
    { key: "VCANCELA", label: "VCANCELA", type: "text" },
    { key: "VACTIVO", label: "VACTIVO", type: "text" },
    { key: "CUMPLIMIENTO", label: "CUMPLIMIENTO", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte de Viajes</h1>
      <hr />
      <section className="contabilidad__table forms__box">
        <section className="contabilidad_section">
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 9001]}
          />
          {renderDatePicker()}
          {Button({ isLoading, getData })}
        </section>
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={15}
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
