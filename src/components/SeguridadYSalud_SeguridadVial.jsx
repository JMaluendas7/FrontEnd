import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./AdminTable";
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
    if (formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("empresa", empresa);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 34);
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

  const generarExcel = async (via) => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", 34);
    data.append("SubOpcion", tipoInforme);
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    let fileName = "";
    if (tipoInforme == 0) {
      fileName = `SeguridadVial_NumeroDespachosXDia_Consolidado`;
    } else if (tipoInforme == 1) {
      fileName = `SeguridadVial_NumeroDespachosXDia_Detallado`;
    } else if (tipoInforme == 2) {
      fileName = `SeguridadVial_CantidadVehiculosTrabajaronXDia_Consolidado`;
    } else if (tipoInforme == 3) {
      fileName = `SeguridadVial_CantidadVehiculosTrabajaronXDia_Detallado`;
    } else if (tipoInforme == 4) {
      fileName = `SeguridadVial_HorasEfectivasConductores_Consolidado`;
    } else if (tipoInforme == 5) {
      fileName = `SeguridadVial_HorasEfectivasXConductor_Detallado`;
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
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "viajes", label: "VIAJES", type: "text" },
      { key: "HorasViaje", label: "HORAS VIAJE", type: "text" },
      { key: "KmViaje", label: "KM VIAJE", type: "text" },
    ];
  } else if (tipoInforme == 1) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "viaje", label: "VIAJE", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "matricula", label: "MATRICULA", type: "text" },
      { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
      { key: "fechaArribo", label: "FECHA ARRIBO", type: "text" },
      { key: "Horas", label: "HORAS", type: "text" },
      { key: "longitud", label: "LONGITUD", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "ruta", label: "RUTA", type: "text" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "nvehiculos", label: "N° VEHICULOS", type: "text" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "matricula", label: "MATRICULA", type: "text" },
    ];
  } else if (tipoInforme == 4) {
    columns = [
      { key: "Servicio", label: "SERVICIO", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "Nviajes", label: "N° VIAJES", type: "text" },
      { key: "HorasEfectivas", label: "HORAS EFECTIVAS", type: "text" },
      { key: "KMRecorridosViaje", label: "KM RECORRIDOS", type: "text" },
    ];
  } else if (tipoInforme == 5) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "Servicio", label: "SERVICIO", type: "text" },
      { key: "viaje", label: "VIAJE", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "matricula", label: "MATRICULA", type: "text" },
      { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
      { key: "fechaArribo", label: "FECHA ARRIBO", type: "text" },
      { key: "HorasViaje", label: "HORAS VIAJE", type: "text" },
      { key: "longitudViajeKM", label: "KM VIAJE", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "ruta", label: "RUTA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "HorasEfectivas", label: "HORAS EFECTIVAS", type: "text" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte de Seguridad Vial</h1>
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
              {
                value: 0,
                label: "Numero Viajes (Despachos) X Dia - Consolidado",
              },
              {
                value: 1,
                label: "Numero Viajes (Despachos) X Dia - Detallado",
              },
              {
                value: 2,
                label:
                  "Cantidad de Vehiculos que Trabajaron X Dia - Consolidado",
              },
              {
                value: 3,
                label: "Cantidad de Vehiculos que Trabajaron X Dia - Detallado",
              },
              {
                value: 4,
                label: "Horas Efectivas Conductores - Consolidado",
              },
              {
                value: 5,
                label: "Horas Efectivas X Conductor - Detallado",
              },
            ]}
          />
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            allowedCodes={[277, 278, 300, 310, 320, 2771, 9001]}
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
