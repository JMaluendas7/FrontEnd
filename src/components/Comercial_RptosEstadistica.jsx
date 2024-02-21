import Button from "./AdminButton";
import DynamicTable from "./AdminTable";
import getDataFunc from "./AdminGetData";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import React, { useState, useEffect } from "react";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [tipoInforme, setTipoInforme] = useState("");
  const [showTable, setShowTable] = useState(false);
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
        "RP_consultas01",
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
      fileName = `Estadisticas_Planillados-PasajerosOrigen-Destino`;
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
    let url;
    if (
      tipoInforme == 0 ||
      tipoInforme == 1 ||
      tipoInforme == 4 ||
      tipoInforme == 5 ||
      // tipoInforme == 9 ||
      tipoInforme == 10 ||
      tipoInforme == 18 ||
      tipoInforme == 19 ||
      tipoInforme == 22
    ) {
      url = "generar_excel";
    } else {
      url = "XlsxRP_consultas01";
    }
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    if (url != "generar_excel") {
      data.append("Opcion", tipoInforme);
      data.append("empresa", empresa);
      data.append("startDate", formattedStartDate);
    }
    console.log(results);
    generarExcelFunc(url, data, fileName, mostrarMensaje, setIsLoading);
  };

  // Handle of table dynamic
  let columns = [];

  useEffect(() => {
    if (
      (tipoInforme == 0 ||
        tipoInforme == 1 ||
        tipoInforme == 4 ||
        tipoInforme == 5 ||
        tipoInforme == 9 ||
        tipoInforme == 10 ||
        tipoInforme == 18 ||
        tipoInforme == 19 ||
        tipoInforme == 22) &&
      results.length > 0
    ) {
      (async () => {
        // console.log(results[1].length);
        setShowTable(false);
        generarExcel();
      })();
    }
  }, [results]);

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
  } else if (tipoInforme == 22) {
    columns = [
      { key: "id", label: "ID", type: "number" },
      { key: "Pasajenumero", label: "N° PASAJE", type: "text" },
      { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
      { key: "importefinal", label: "IMPORTE FINAL", type: "number" },
      { key: "boleteria", label: "BOLETERIA", type: "text" },
      { key: "mediopago", label: "MEDIO PAGO", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "text" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombres", label: "NOMBRES", type: "text" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "TERMINALORIGEN", label: "TERMINAL ORIGEN", type: "text" },
      { key: "TORIGEN", label: "T ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "TERMINALDESTINO", label: "TERMINAL DESTINO", type: "text" },
      { key: "TDESTINO", label: "T DESTINO", type: "text" },
      { key: "viaje", label: "VIAJE", type: "number" },
    ];
  }

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reportes de Estadistica</h1>
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
              // { value: 1, label: "Estadisticas de Operaciones" },
              { value: 2, label: "Tiquetes Moviles Detallados" },
              { value: 3, label: "Tiquetes Moviles del Dia" },
              { value: 4, label: "Estadisticas Cafam" },
              { value: 5, label: "Estadisticas Fuerza Publica" },
              { value: 6, label: "Planillados - Pasajeros por Rutas" },
              { value: 7, label: "Planillados - Pasajeros por Trayectos" },
              { value: 8, label: "Planillados - Pasajeros Origen-Destino" },
              { value: 9, label: "Tiquetes Promedio por Boleteria" },
              { value: 10, label: "Consolidado por Boleteria Promedio" },
              { value: 18, label: "Pasajeros que Viajaron" },
              { value: 19, label: "Estadistica Tarjeta Joven" },
              { value: 22, label: "Pasajeros Colsubsidio" },
            ]}
          />
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 300, 310, 320, 2771, 9001]}
          />
        </section>
        <section className="contabilidad_section">
          <div className="content__dateDH">{renderDatePicker()}</div>
        </section>
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
