import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoInforme, setTipoInforme] = useState("");
  const [concepto, setConcepto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (
      tipoInforme &&
      empresa &&
      concepto &&
      formattedStartDate &&
      formattedEndDate
    ) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("codigo", "");
      formData.append("tipoInforme", tipoInforme);
      formData.append("concepto", concepto);
      formData.append("empresa", empresa);

      getDataFunc(
        "RP_CuotaAdmon",
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
    data.append("tipoInforme", tipoInforme);
    data.append("empresa", empresa);
    let fileName = "";
    if (tipoInforme == 1) {
      fileName = `ReporteAgenciaDeViajes`;
    } else if (tipoInforme == 2) {
      fileName = `ReporteCiudades`;
    } else if (tipoInforme == 3) {
      fileName = `ReportePropietarios`;
    } else if (tipoInforme == 4) {
      fileName = `ReporteCiudadesColibertador`;
    } else if (tipoInforme == 5) {
      fileName = `ReporteAgenciasBerlitur`;
    }
    generarExcelFunc(
      "XlsxRP_CuotaAdmon",
      data,
      fileName,
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 2) {
    columns = [
      { key: "year", label: "AÑO", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "ciudad", label: "CIUDAD", type: "text" },
      { key: "Base", label: "BASE", type: "number" },
      { key: "CuotaAdmon", label: "CUOTA ADMON", type: "number" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "Año", label: "AÑO", type: "text" },
      { key: "Mes", label: "MES", type: "text" },
      { key: "Detalle", label: "DETALLE", type: "text" },
      { key: "Identifica", label: "IDENTIFICACION", type: "text" },
      { key: "NombreTercero", label: "NOMBRE DEL TERCERO", type: "text" },
      { key: "base", label: "BASE", type: "number" },
      { key: "VrEgresos", label: "VR EGRESOS", type: "number" },
      { key: "VrIngresos", label: "VR INGRESOS", type: "number" },
    ];
  } else if (tipoInforme == 4) {
    columns = [
      { key: "Concepto", label: "CONCEPTO", type: "text" },
      { key: "CptoDet", label: "DETALLE", type: "text" },
      { key: "Ciudadorigen", label: "CIUDAD ID", type: "text" },
      { key: "Loc_Nombreloc", label: "CIUDAD", type: "text" },
      { key: "ValorBase", label: "BASE", type: "number" },
      { key: "Admon", label: "CUOTA ADMON", type: "number" },
    ];
  } else if (tipoInforme == 5) {
    columns = [
      { key: "pla_agenciavendio", label: "COD. AGENCIA", type: "text" },
      { key: "age_nomagencia", label: "NOMBRE AGENCIA", type: "text" },
      { key: "valor", label: "BASE", type: "number" },
      { key: "Tvalor", label: "CUOTA ADMON", type: "number" },
    ];
  }

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte Cuota de Administración</h1>
      <hr />
      <section className="contabilidad__table forms__box">
        <div className="contabilidad_fr">
          <section className="contabilidad_section">
            <SelectOptions
              value={tipoInforme}
              onChange={(e) => {
                setTipoInforme(e.target.value);
                setShowTable(false);
              }}
              options={[
                { value: 1, label: "Agencia de Viajes" },
                { value: 2, label: "Ciudades" },
                { value: 3, label: "Propietarios" },
                { value: 4, label: "Ciudades - Colibertador" },
                { value: 5, label: "Agencias - Berlitur" },
              ]}
            />
            <SelectOptions
              value={concepto}
              onChange={(e) => {
                setConcepto(e.target.value);
                setShowTable(false);
              }}
              options={[
                { value: "080101", label: "Cuota Admon" },
                { value: "080103", label: "Cuota Admon Agencias" },
              ]}
              label="Concepto"
            />
          </section>
          <section className="contabilidad_section">
            <SelectEmpresa
              empresa={empresa}
              setEmpresa={setEmpresa}
              setShowTable={setShowTable}
              onChange={(e) => {
                setEmpresa(e.target.value);
                setShowTable(false);
              }}
              allowedCodes={[277, 278, 300, 310, 320, 2771, 9001]}
            />
            <div className="content__dateDH">{renderDatePicker()}</div>
          </section>
        </div>
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
