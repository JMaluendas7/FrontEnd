import useDateMY from "./AdminMY";
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
  const [showTable, setShowTable] = useState(false);
  const { month, year, renderDateMY } = useDateMY({ setShowTable });
  const [tipoInforme, setTipoInforme] = useState();
  const [tipoInforme2, setTipoInforme2] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [empresa, setEmpresa] = useState("");

  const getData = async () => {
    if (tipoInforme && tipoInforme2) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);
      formData.append("empresa", 277);
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
    let fileName = "";
    if (tipoInforme == 0) {
      fileName = `Dominicales_DetalladoDeViajesXConductor_${timestamp}.xlsx`;
    } else if (tipoInforme == 1) {
      fileName = `Dominicales_Consolidado-Empleado-Dominical-Bus_${timestamp}.xlsx`;
    } else if (tipoInforme == 2) {
      fileName = `Dominicales_TotalConductorXBus_${timestamp}.xlsx`;
    } else if (tipoInforme == 3) {
      fileName = `Dominicales_TotalXConductor_${timestamp}.xlsx`;
    } else if (tipoInforme == 4) {
      fileName = `Dominicales_TotalXBus_${timestamp}.xlsx`;
    } else if (tipoInforme == 5) {
      fileName = `Dominicales_DetalladoXBus_${timestamp}.xlsx`;
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

  const [tipoInforme2Options, setTipoInforme2Options] = useState();
  const handleTipoInformeChange2 = (e) => {
    const selectedTipoInforme2 = e.target.value;
    setTipoInforme(selectedTipoInforme2);

    // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
    if (selectedTipoInforme2 === "0") {
      setTipoInforme2Options([
        { value: "0", label: "Listado por Novedad" },
        { value: "1", label: "Empresa" },
        { value: "2", label: "Novedades" },
      ]);
    } else if (selectedTipoInforme2 === "1") {
      setTipoInforme2Options([
        { value: "0", label: "Listado Dominicales" },
        { value: "1", label: "Dominicales" },
      ]);
    } else if (selectedTipoInforme2 === "2") {
      setTipoInforme2Options([
        { value: "0", label: "Listado Archivo" },
        { value: "1", label: "Mensual" },
      ]);
    } else if (selectedTipoInforme2 === "3") {
      setTipoInforme2Options([
        { value: "0", label: "Listado Reporte" },
        { value: "1", label: "Por Mes" },
      ]);
    } else {
      setTipoInforme2Options([]);
    }
  };

  const handleTipoInformeChange3 = () => {
    if (tipoInforme == 0 && tipoInforme2 == 0) {
      return (
        <>
          <section className="row_section">
            <SelectOptions
              value={tipoInforme}
              onChange={(e) => {
                handleTipoInformeChange2(e);
              }}
              options={[
                { value: 0, label: "Ingreso" },
                { value: 1, label: "Permiso" },
                { value: 2, label: "Licencia" },
                { value: 3, label: "Suspension" },
                { value: 4, label: "Renuncia" },
                { value: 5, label: "Dominicales" },
                { value: 6, label: "Turno Adicional" },
                { value: 7, label: "Incapacidad" },
                { value: 8, label: "Traslado" },
                { value: 9, label: "Otro" },
                { value: 10, label: "Vacaciones" },
              ]}
            />
            <div className="input-container agg_colaborador">
              {renderDateMY()}
            </div>
            <SelectEmpresa
              empresa={empresa}
              onChange={(e) => {
                setEmpresa(e.target.value);
              }}
              allowedCodes={[277, 278, 300, 310, 320, 2771, 9000, 9001]}
            />
          </section>
        </>
      );
    }
    if (
      ((tipoInforme == 0 || tipoInforme == 1 || tipoInforme == 2) &&
        tipoInforme2 == 1) ||
      (tipoInforme == 3 && tipoInforme2 == 0)
    ) {
      return (
        <>
          <section className="row_section">
            <div className="input-container agg_colaborador">
              {renderDateMY()}
            </div>
            <SelectEmpresa
              empresa={empresa}
              onChange={(e) => {
                setEmpresa(e.target.value);
              }}
              allowedCodes={[277, 278, 300, 310, 320, 2771, 9000, 9001]}
            />
          </section>
        </>
      );
    }
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Generador de Informes</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <SelectOptions
            value={tipoInforme}
            onChange={(e) => {
              setTipoInforme(e.target.value);
              setShowTable(false);
              handleTipoInformeChange2(e);
            }}
            options={[
              { value: 0, label: "Tipo Novedad" },
              { value: 1, label: "Domincales" },
              { value: 2, label: "Archivo" },
              { value: 3, label: "Reporte" },
            ]}
            label="Categoria Informe"
          />
        </section>
        <section className="contabilidad_section">
          {tipoInforme2Options && (
            <SelectOptions
              value={tipoInforme2}
              onChange={(e) => setTipoInforme2(e.target.value)}
              options={tipoInforme2Options}
            />
          )}
          {tipoInforme2 && (
            <>
              <div className="input-container agg_colaborador">
                {handleTipoInformeChange3()}
              </div>
              {Button({ isLoading, getData })}
            </>
          )}
        </section>
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box fade">
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
