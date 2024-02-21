import Button from "./AdminButton";
import DynamicTable from "./AdminTable";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 0);
      formData.append("SubOpcion", 0);
      formData.append("empresa", empresa);
      getDataFunc(
        "Sp_RptHistoFuec",
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
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxSp_RptHistoFuec",
      data,
      "InformeFuec",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "Numero_Fuec", label: "N° FUEC", type: "text" },
    { key: "Nit_Cliente", label: "NIT CLIENTE", type: "text" },
    { key: "Nombre_Cliente", label: "NOMBRE CLIENTE", type: "text" },
    { key: "Domento_Repre", label: "DOCUMENTO", type: "number" },
    { key: "Representante", label: "REPRESENTANTE", type: "text" },
    { key: "Recorrido", label: "RECORRIDO", type: "text" },
    { key: "Bus", label: "BUS", type: "text" },
    { key: "Placa", label: "PLACA", type: "text" },
    { key: "Nombre_Conductor1", label: "NOMBRE C1", type: "text" },
    { key: "Nombre_Conductor2", label: "NOMBRE C2", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe FUEC</h1>
      <hr />
      <section className="contabilidad__table forms__box">
        <section className="contabilidad_section">
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <option value="" disabled>
                Seleccionar
              </option>
              <option value={"860015624-1"}>BERLINAS DEL FONCE S.A.</option>
              <option value={"800017584-6"}>COMPAÑIA LIBERTADOR S.A.</option>
              <option value={"800204916-1"}>
                CARTAGENA INTERNATIONAL TRAVELS S.A.S. "CIT"
              </option>
            </select>
            <label className="input-label-options label">Empresa</label>
          </div>
          {renderDatePicker()}
          {Button({ isLoading, getData })}
        </section>
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={30}
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
