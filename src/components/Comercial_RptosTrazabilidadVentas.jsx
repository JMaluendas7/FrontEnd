import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("empresa", empresa);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 28);
      formData.append("SubOpcion", 0);
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
    data.append("startDate", formattedStartDate);
    data.append("Opcion", 28);
    data.append("SubOpcion", 0);
    data.append("empresa", empresa);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "ComercialTrazabilidadDeVentas",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "Year", label: "AÑO", type: "text" },
    { key: "mes", label: "MES", type: "text" },
    { key: "empresa", label: "EMPRESA", type: "text" },
    { key: "ciudad", label: "CIUDAD", type: "text" },
    { key: "Agencia", label: "AGENCIA", type: "text" },
    { key: "Taquillero", label: "TAQUILLERO", type: "text" },
    { key: "NEC", label: "NEC", type: "number" },
    { key: "cant", label: "CANTIDAD", type: "number" },
    { key: "valor", label: "VALOR", type: "number" },
  ];

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Trazabilidad de Ventas</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <SelectEmpresa
            empresa={empresa}
            setEmpresa={setEmpresa}
            setShowTable={setShowTable}
            onChange={(e) => {
              setEmpresa(e.target.value);
              setShowTable(false);
            }}
            allowedCodes={[277, 278, 9001]}
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
