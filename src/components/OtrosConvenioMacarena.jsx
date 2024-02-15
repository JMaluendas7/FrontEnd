import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import useDateRange from "./AdminDateRange";
import ButtonGenerar from "./AdminButtonGenerar";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    const formData = new FormData();
    if (tipoInforme && formattedStartDate && formattedEndDate) {
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);

      getDataFunc(
        "RP_Macarena",
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
    data.append("Opcion", tipoInforme);
    data.append("startDate", formattedStartDate);
    data.append("empresa", 277);
    let fileName = "";
    if (tipoInforme == 1) {
      fileName = `InformeRelacionDeTiquetesMacarena`;
    } else if (tipoInforme == 2) {
      fileName = `InformeRelacionDeTiquetesVencioMacarena`;
    }
    generarExcelFunc(
      "XlxsRP_Macarena",
      data,
      fileName,
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 1) {
    columns = [
      { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
      { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
      { key: "boldev", label: "BOLDEV", type: "text" },
      { key: "IMPORTEOPERACION", label: "IMPORTE OPERACION", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "ID", label: "ID", type: "text" },
      { key: "FECHAPARTIDA", label: "F PARTIDA", type: "text" },
      { key: "BUS", label: "BUS", type: "text" },
      { key: "MATRICULA", label: "MATRICULA", type: "text" },
      { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
      { key: "NOMBRES", label: "NOMBRE", type: "text" },
      { key: "APELLIDO", label: "APELLIDO", type: "text" },
      { key: "estado", label: "ESTADO", type: "text" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
      { key: "Fecha_vencimiento", label: "FECHA VENCIMIENTO", type: "text" },
      { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
      { key: "boldev", label: "BOLDEV", type: "text" },
      { key: "IMPORTEOPERACION", label: "IMPORTE OPERACION", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "ID", label: "ID", type: "text" },
      { key: "FECHAPARTIDA", label: "F PARTIDA", type: "text" },
      { key: "BUS", label: "BUS", type: "text" },
      { key: "MATRICULA", label: "MATRICULA", type: "text" },
      { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
      { key: "NOMBRES", label: "NOMBRE", type: "text" },
      { key: "APELLIDO", label: "APELLIDO", type: "text" },
      { key: "estado", label: "ESTADO", type: "text" },
      { key: "Dif_DiasVencimiento", label: "DIAS VENCIMIENTO", type: "text" },
    ];
  }

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte Convenio Macarena</h1>
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
              { value: 1, label: "Relacion de Tiquetes" },
              { value: 2, label: "Relacion de Tiquetes Vencidos" },
            ]}
          />
        </section>
        <section className="contabilidad_section">
          <div className="content__dateDH">{renderDatePicker()}</div>
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
