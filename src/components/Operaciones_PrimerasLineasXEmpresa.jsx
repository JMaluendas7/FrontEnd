import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./AdminTable";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";
import Button from "./AdminButton";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [tipoInforme, setTipoInforme] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (tipoInforme && empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("empresa", empresa);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 26);
      formData.append("SubOpcion", tipoInforme);

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
    data.append("Opcion", 26);
    data.append("SubOpcion", tipoInforme);
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    let fileName = "";
    if (tipoInforme == 0) {
      fileName = `InformeConsolidadoPLEA`;
    } else if (tipoInforme == 1) {
      fileName = `InformeDetalladoPLEA`;
    }
    generarExcelFunc(
      "XlsxRP_Consultas05",
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
      { key: "Empresa", label: "EMPRESA", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "ciudad", label: "CIUDAD", type: "text" },
      { key: "cont", label: "CANTIDAD DE ALISTAMIENTOS", type: "number" },
    ];
  } else if (tipoInforme == 1) {
    columns = [
      { key: "veh_empreal", label: "EMPRESA ID", type: "number" },
      { key: "Empresa", label: "EMPRESA", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "dia", label: "DIA", type: "number" },
      { key: "bus", label: "BUS", type: "number" },
      { key: "matricula", label: "PLACA", type: "text" },
      { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
      { key: "ciudad", label: "CIUDAD", type: "text" },
      { key: "viaje", label: "VIAJE", type: "text" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">
        Informe de Estadisticas de Primeras Lineas de las Empresas Aliadas
      </h1>
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
              { value: 0, label: "Informe Consolidado" },
              { value: 1, label: "Informe Detallado" },
            ]}
          />
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 300, 310, 320, 9001]}
          />
        </section>
        <section className="contabilidad_section">
          <div className="content__dateDH">{renderDatePicker()} </div>
        </section>
        {Button({ isLoading, getData })}
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
