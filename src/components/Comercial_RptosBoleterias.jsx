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
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [empresa, setEmpresa] = useState("");
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();

  const getData = async () => {
    if (tipoInforme && empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);
      formData.append("empresa", empresa);

      const res = await getDataFunc(
        "RP_consultas01",
        formData,
        setIsLoading,
        setShowTable,
        setResults,
        mostrarMensaje
      );
      if (
        (tipoInforme == 0 ||
          tipoInforme == 1 ||
          tipoInforme == 4 ||
          tipoInforme == 5 ||
          tipoInforme == 18 ||
          tipoInforme == 19 ||
          tipoInforme == 22) &&
        res.length > 0
      ) {
        generarExcel(res);
        setShowTable(false);
      }
    } else {
      mostrarMensaje(
        "Debe seleccionar todos los campos",
        "warning_notification"
      );
    }
  };

  const generarExcel = async (res) => {
    let url;
    res.length ? (url = "generar_excel") : (url = "XlsxRP_consultas01");
    const data = new FormData();
    if (res.length) {
      data.append("results", JSON.stringify(res));
    } else {
      data.append("results", JSON.stringify(results));
    }
    if (url != "generar_excel") {
      data.append("Opcion", tipoInforme);
      data.append("empresa", empresa);
      data.append("startDate", formattedStartDate);
    }
    let fileName = "";
    if (tipoInforme == 0) {
      fileName = `Estadisticas_DetalladoDeViajesPorConductor`;
    } else if (tipoInforme == 1) {
      fileName = `Estadisticas_EstadisticasDeOperaciones`;
    } else if (tipoInforme == 2) {
      fileName = `Estadisticas_TiquetesMovilesDetallados`;
    } else if (tipoInforme == 3) {
      fileName = `Estadisticas_TiquetesMovilesDelDia`;
    } else if (tipoInforme == 4) {
      fileName = `Estadisticas_Cafam`;
    } else if (tipoInforme == 5) {
      fileName = `Estadisticas_FuerzaPublica`;
    } else if (tipoInforme == 6) {
      fileName = `Estadisticas_Planillados-PasajerosPorRutas`;
    } else if (tipoInforme == 7) {
      fileName = `Estadisticas_Planillados-PasajerosPorTrayectos`;
    } else if (tipoInforme == 8) {
      fileName = "Estadisticas_Planillados-PasajerosOrigen-Destino";
    } else if (tipoInforme == 9) {
      fileName = `Estadisticas_TiquetesPromedioXBoleteria`;
    } else if (tipoInforme == 10) {
      fileName = `Estadisticas_ConsolidadoXBoleteriaPromedio`;
    } else if (tipoInforme == 18) {
      fileName = `Estadisticas_PasajerosQueViajaron`;
    } else if (tipoInforme == 19) {
      fileName = `Estadisticas_TarjetaJoven`;
    } else if (tipoInforme == 22) {
      fileName = `Estadisticas_PasajerosColsubsidio`;
    }
    generarExcelFunc(url, data, fileName, mostrarMensaje, setIsLoading);
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 6) {
    columns = [
      { key: "Mes", label: "MES", type: "number" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "nviajes", label: "N° VIAJES", type: "number" },
      { key: "butacas", label: "BUTACAS", type: "number" },
      { key: "tiquetes", label: "TIQUETES", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  } else if (tipoInforme == 7) {
    columns = [
      { key: "Mes", label: "MES", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "tiquetes", label: "TIQUETES", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  } else if (tipoInforme == 8) {
    columns = [
      { key: "Mes", label: "MES", type: "number" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "tiquetes", label: "TIQUETES", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
      { key: "lorigen", label: "L ORIGEN", type: "text" },
      { key: "ldestino", label: "L DESTINO", type: "text" },
      { key: "TIQOD", label: "TIQOD", type: "number" },
      { key: "ValorOD", label: "VALOR OD", type: "number" },
      { key: "PORCO", label: "PORCO", type: "number" },
      { key: "PORCV", label: "PORCV", type: "number" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Estadisticas por Boleteria</h1>
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
              // { value: 0, label: "Detallado de Viajes por Conductor" },
              { value: 1, label: "Estadisticas de Operaciones" },
              // { value: 2, label: "Tiquetes Moviles Detallados" },
              // { value: 3, label: "Tiquetes Moviles del Dia" },
              { value: 4, label: "Estadisticas Cafam" },
              { value: 5, label: "Estadisticas Fuerza Publica" },
              { value: 6, label: "Planillados - Pasajeros por Rutas" },
              { value: 7, label: "Planillados - Pasajeros por Trayectos" },
              { value: 8, label: "Planillados - Pasajeros Origen-Destino" },
              // { value: 9, label: "Tiquetes Promedio por Boleteria" },
              // { value: 10, label: "Consolidado por Boleteria Promedio" },
              { value: 18, label: "Pasajeros que Viajaron" },
              { value: 19, label: "Estadistica Tarjeta Joven" },
              { value: 22, label: "Pasajeros Colsubsidio" },
            ]}
          />
          {SelectEmpresa({
            empresa,
            onChange: (e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            },
            allowedCodes: [277, 278, 300, 310, 320, 2771, 9001],
          })}
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
