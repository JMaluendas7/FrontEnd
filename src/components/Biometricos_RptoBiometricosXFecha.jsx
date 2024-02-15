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
      formData.append("empresa", 277);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 33);
      formData.append("SubOpcion", 16);

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
    data.append("Opcion", 33);
    data.append("SubOpcion", 0);
    data.append("empresa", 277);
    data.append("startDate", formattedStartDate);

    await generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "ReporteBiometricoPorFecha",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "FechaRegistro", label: "FECHA REGISTRO", type: "text" },
    { key: "L_UID", label: "UID", type: "text" },
    { key: "Hora_Registro", label: "HORA REGISTRO", type: "text" },
    { key: "L_TID", label: "TID", type: "text" },
    { key: "C_Name", label: "BIOMETRICO", type: "text" },
    { key: "Terminal", label: "EMPLEADO", type: "text" },
    { key: "Documento", label: "DOCUMENTO", type: "number" },
    { key: "c_Post", label: "POST", type: "text" },
    { key: "Cargo", label: "CARGO", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte De BioMetricos Por Fecha</h1>
      <hr />
      <section className="colum_table forms__box">
        {renderDatePicker()}
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
