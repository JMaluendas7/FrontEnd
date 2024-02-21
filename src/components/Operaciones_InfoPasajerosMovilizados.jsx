import getDataFunc from "./AdminGetData";
import DynamicTable from "./AdminTable";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import React, { useState, useEffect } from "react";
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
      formData.append("Opcion", 1);
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

  // useEffect para ejecutar calcularPorcentajes cuando results se actualice
  useEffect(() => {
    const calcularPorcentajesYAgregar = () => {
      const nuevosResultados = results.map((fila) => ({
        ...fila,
        porcentajeCalculado: ((100 * fila.cont) / fila.BUTACAS).toFixed(2),
      }));

      if (!sonIguales(results, nuevosResultados)) {
        setResults(nuevosResultados);
      }
    };

    calcularPorcentajesYAgregar();
  }, [results]);

  const sonIguales = (array1, array2) =>
    JSON.stringify(array1) === JSON.stringify(array2);

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", 1);
    data.append("SubOpcion", tipoInforme);
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    let fileName = "";
    if (tipoInforme == 0) {
      fileName = `InformePasajerosMovilizadosConsolidadoTotal`;
    } else if (tipoInforme == 1) {
      fileName = `InformePasajerosMovilizadosConsolidadoLinea`;
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
      { key: "EMPRESA", label: "EMPRESA", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "NVIAJES", label: "VIAJES", type: "number" },
      { key: "BUTACAS", label: "SILLAS DISP", type: "number" },
      { key: "cont", label: "PASAJEROS", type: "number" },
      { key: "porcentajeCalculado", label: "% OCUPACION", type: "number" },
      { key: "VALOR", label: "VALOR", type: "number" },
    ];
  } else {
    columns = [
      { key: "EMPRESA", label: "EMPRESA", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "LINEA", label: "LINEA", type: "text" },
      { key: "NVIAJES", label: "VIAJES", type: "number" },
      { key: "BUTACAS", label: "SILLAS DISP", type: "number" },
      { key: "cont", label: "PASAJEROS", type: "number" },
      { key: "porcentajeCalculado", label: "% OCUPACION", type: "text" },
      { key: "VALOR", label: "VALOR", type: "number" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">
        Informe Consolidado de Pasajeros Movilizados
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
              { value: 0, label: "Informe Consolidado Total" },
              { value: 1, label: "Informe Consolidado por Linea" },
            ]}
          />
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 310, 320, 9001]}
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
