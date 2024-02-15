import useDate from "./AdminDate";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import ButtonGenerar from "./AdminButtonGenerar";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { DateF, renderDatePicker1, selectedDate } = useDate();
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [results, setResults] = useState([]);
  const [empresa, setEmpresa] = useState("");

  const getData = async () => {
    if (DateF && empresa) {
      const formData = new FormData();
      formData.append("selectedDate", DateF);
      formData.append("Terminal", tipoInforme);
      if (empresa == 277) {
        formData.append("Opcion", 2);
      } else if (empresa == 300) {
        formData.append("Opcion", 4);
      }

      getDataFunc(
        "RP_MIGRACION",
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
    if (tipoInforme == 1) {
      fileName = `MigracionReporteBogota`;
    } else if (tipoInforme == 2) {
      fileName = `MigracionReporteAtlantico`;
    } else if (tipoInforme == 3) {
      fileName = `MigracionReporteBolivar`;
    } else if (tipoInforme == 4) {
      fileName = `MigracionReporteCesar`;
    } else if (tipoInforme == 5) {
      fileName = `MigracionReporteNorteDeSantander`;
    } else if (tipoInforme == 6) {
      fileName = `MigracionReporteSantander`;
    }
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", 2);
    data.append("empresa", 277);
    data.append("startDate", DateF);
    generarExcelFunc(
      "XlsxRP_MIGRACION",
      data,
      fileName,
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic

  const columns = [
    { key: "tipodoc", label: "TIPO DOC", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "text" },
    { key: "Apellido", label: "APELLIDO", type: "text" },
    { key: "Apellido2", label: "APELLIDO2", type: "text" },
    { key: "nombres", label: "NOMBRES", type: "text" },
    { key: "Nacionalidad", label: "NACIONALIDAD", type: "text" },
    { key: "fechanacimiento", label: "FECHA NACIMIENTO", type: "text" },
    { key: "sexo", label: "SEXO", type: "text" },
    { key: "telefonos", label: "TELEFONO", type: "text" },
    { key: "direccion", label: "DIRECCION", type: "text" },
    { key: "fechaPARTIDA", label: "FECHA PARTIDA", type: "text" },
    { key: "HORA_VIAJE", label: "HORA VIAJE", type: "text" },
    { key: "ModoTransporte", label: "MODO TRANSPORTE", type: "text" },
    { key: "TipoTransporte", label: "TIPO TRNASPORTE", type: "text" },
    { key: "NIT", label: "NIT", type: "text" },
    { key: "PAISORIGEN", label: "PAIS ORIGEN", type: "text" },
    { key: "DEPARTAMENTO_ORIGEN", label: "DEPARTAMENTO ORIGEN", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  const [tipoInforme2Options, setTipoInforme2Options] = useState("");
  const handleTipoInformeChange2 = (e) => {
    const selectedTipoInforme2 = e.target.value;
    // setTipoInforme(selectedTipoInforme2);

    // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
    if (selectedTipoInforme2 == "277") {
      setTipoInforme2Options([
        { value: "1", label: "Bogota" },
        { value: "2", label: "Atlantico" },
        { value: "3", label: "Bolivar" },
        { value: "4", label: "Cesar" },
        { value: "5", label: "Norte de Santander" },
        { value: "6", label: "Santander" },
      ]);
    } else if (selectedTipoInforme2 === "300") {
      setTipoInforme2Options([
        { value: "2", label: "Atlantico" },
        { value: "3", label: "Bolivar" },
        { value: "4", label: "Cesar" },
      ]);
    } else {
      setTipoInforme2Options([]);
    }
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Migración</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">
          {renderDatePicker1()}
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              handleTipoInformeChange2(e);
            }}
            allowedCodes={[277, 300]}
          />
          {tipoInforme2Options && (
            <SelectOptions
              value={tipoInforme}
              onChange={(e) => {
                setTipoInforme(e.target.value);
                setShowTable(false);
              }}
              options={tipoInforme2Options}
              label="Ciudad"
            />
          )}
        </section>
        <ButtonGenerar isLoading={isLoading} getData={getData} />
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
