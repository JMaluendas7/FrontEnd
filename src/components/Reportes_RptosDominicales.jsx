import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [empresa, setEmpresa] = useState("");

  const getData = async () => {
    if (tipoInforme && empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);
      formData.append("empresa", empresa);
      getDataFunc(
        "RP_Dominicales",
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
    let fileName;
    if (tipoInforme == 0) {
      fileName = `Dominicales_DetalladoDeViajesXConductor`;
    } else if (tipoInforme == 1) {
      fileName = `Dominicales_Consolidado-Empleado-Dominical-Bus`;
    } else if (tipoInforme == 2) {
      fileName = `Dominicales_TotalConductorXBus`;
    } else if (tipoInforme == 3) {
      fileName = `Dominicales_TotalXConductor`;
    } else if (tipoInforme == 4) {
      fileName = `Dominicales_TotalXBus`;
    } else if (tipoInforme == 5) {
      fileName = `Dominicales_DetalladoXBus`;
    }
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    generarExcelFunc(
      "generar_excel",
      data,
      fileName,
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 0) {
    columns = [
      { key: "fecha", label: "FECHA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "VIAJES", type: "text" },
      { key: "bus", label: "DISPONIBLES", type: "number" },
    ];
  } else if (tipoInforme == 1) {
    columns = [
      { key: "fecha", label: "FECHA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "VIAJES", type: "text" },
      { key: "bus", label: "DISPONIBLES", type: "number" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "fecha", label: "FECHA", type: "number" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "VIAJES", type: "text" },
      { key: "bus", label: "DISPONIBLES", type: "number" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "Total_dominicales", label: "TOTAL DOMINICALES", type: "text" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reportes de Dominicales</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <SelectOptions
            value={tipoInforme}
            onChange={(e) => {
              setTipoInforme(e.target.value);
              setShowTable(false);
            }}
            options={[
              { value: 0, label: "Detallado de Viajes por Conductor" },
              { value: 1, label: "Consolidado Empleado-Dominical-Bus" },
              { value: 2, label: "Total Coductor por Bus" },
              { value: 3, label: "Total por Conductor" },
              { value: 4, label: "Total por Bus" },
              { value: 5, label: "Detallado por Bus" },
            ]}
          />
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 300, 310, 2771, 9000, 9001]}
          />
        </section>
        <section className="contabilidad_section">{renderDatePicker()}</section>
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
