import Button from "./AdminButton";
import DynamicTable from "./AdminTable";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
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
  const [Opcion, setOpcion] = useState(9);

  const getData = async () => {
    if (empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", Opcion);
      formData.append("SubOpcion", tipoInforme);
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
    data.append("Opcion", Opcion);
    data.append("SubOpcion", tipoInforme);
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "InformeOcupacionXLineas",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 0) {
    columns = [
      { key: "year", label: "AÑO", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "nbuses", label: "N° BUSES", type: "number" },
      { key: "viajes", label: "VIAJES", type: "viajes" },
      { key: "disponibles", label: "DISPONIBLES", type: "number" },
      { key: "pasajeros", label: "PASAJEROS", type: "number" },
      { key: "valorbruto", label: "V BRUTO", type: "number" },
      { key: "seguro", label: "SEGURO", type: "number" },
      { key: "valorneto", label: "V NETO", type: "number" },
      { key: "ocupacion", label: "OCUPACION", type: "number" },
      { key: "promPaxxviaje", label: "PROM PAX VIAJE", type: "number" },
      {
        key: "promValxviaje_Bruto",
        label: "PROM PAX VJE BRUTO",
        type: "number",
      },
      {
        key: "promValxviaje_Neto",
        label: "PROM PAX VJE NETO",
        type: "number",
      },
      { key: "promTarifa_bruto", label: "PROM TAR BRUTO", type: "number" },
      {
        key: "promViajesMensualxbus",
        label: "PROM VJE MENS X BUS",
        type: "number",
      },
      {
        key: "promProdxbus_bruto",
        label: "PROM PROD X BUS BRUTO",
        type: "number",
      },
      {
        key: "PromProdxbus_Neto",
        label: "PROM PROD X BUS NETO",
        type: "number",
      },
    ];
  } else if (tipoInforme == 1) {
    columns = [
      { key: "YEAR", label: "AÑO", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "Recorrido", label: "RECORRIDO", type: "text" },
      { key: "viajes", label: "VIAJES", type: "number" },
      { key: "disponibles", label: "DISPONIBLES", type: "number" },
      { key: "pasajeros", label: "PASAJEROS", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
      { key: "Seguro", label: "SEGURO", type: "number" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "Servicio", label: "SERVICIO", type: "text" },
      { key: "YEAR", label: "AÑO", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "Recorrido", label: "RECORRIDO", type: "text" },
      { key: "viajes", label: "VIAJES", type: "text" },
      { key: "disponibles", label: "BUTACAS", type: "text" },
      { key: "pasajeros", label: "PASAJEROS", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
      { key: "Seguro", label: "SEGURO", type: "number" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "Servicio", label: "SERVICIO", type: "text" },
      { key: "YEAR", label: "AÑO", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "viajes", label: "VIAJES", type: "text" },
      { key: "disponibles", label: "BUTACAS", type: "text" },
      { key: "pasajeros", label: "PASAJEROS", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  } else if (tipoInforme == 4) {
    columns = [
      { key: "year", label: "AÑO", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "recorrido", label: "RECORRIDO", type: "text" },
      { key: "HORA", label: "HORA", type: "text" },
      { key: "viajes", label: "VIAJES", type: "text" },
      { key: "disponibles", label: "BUTACAS", type: "text" },
      { key: "pasajeros", label: "PASAJEROS", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
      { key: "Seguro", label: "SEGURO", type: "number" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
  const [tipoInformeOptions, setTipoInformeOptions] = useState();
  const handleTipoInforme = (e) => {
    const selectedTipoInforme2 = e.target.value;

    // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
    if (selectedTipoInforme2 == "300") {
      setTipoInformeOptions([
        { value: "0", label: "Consolidado Total" },
        { value: "1", label: "Consolidado Por Linea" },
        { value: "2", label: "Consolidado Por Ruta" },
        { value: "3", label: "Consolidado Mensual" },
        { value: "4", label: "Consolidado Por Horario" },
      ]);
    } else {
      setTipoInformeOptions([
        { value: "0", label: "Informe Consolidado" },
        { value: "1", label: "Informe Detallado" },
      ]);
    }
  };
  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe de Ocupacion por Lineas</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              handleTipoInforme(e);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 310, 300, 320, 9001]}
          />
          {tipoInformeOptions && (
            <SelectOptions
              value={tipoInforme}
              onChange={(e) => {
                setTipoInforme(e.target.value);
                setShowTable(false);
              }}
              options={tipoInformeOptions}
            />
          )}
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
