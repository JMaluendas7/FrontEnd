import useDate from "./AdminDate";
import Button from "./AdminButton";
import getDataFunc from "./AdminGetData";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import React, { useState, useEffect } from "react";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { DateF, renderDatePicker1 } = useDate();
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (tipoInforme && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Date", DateF);
      formData.append("Opcion", tipoInforme);
      getDataFunc(
        "Rp_CRM",
        formData,
        setIsLoading,
        null,
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
      fileName = `ReporteTiquetesCRM_Personas`;
    } else if (tipoInforme == 1) {
      fileName = `ReporteTiquetesCRM_ViajeroFrecuente`;
    } else if (tipoInforme == 2) {
      fileName = `ReporteTiquetesCRM_VentaOnline`;
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
  useEffect(() => {
    if (results.length > 0) {
      generarExcel();
    }
  }, [results]);

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte de Tiquetes CRM</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <SelectOptions
            value={tipoInforme}
            onChange={(e) => {
              setTipoInforme(e.target.value);
            }}
            options={[
              { value: 0, label: "Personas" },
              { value: 1, label: "Viajero Frecuente" },
              { value: 2, label: "Venta Online" },
            ]}
          />
        </section>
        <section className="contabilidad_section">
          {renderDatePicker()}
          {renderDatePicker1()}
        </section>
        {Button({ isLoading, getData })}
      </section>
      {ContainerButtonsLeft({ isLoading })}
    </div>
  );
};

export default Inicio;
