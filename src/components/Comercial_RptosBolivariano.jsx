import Button from "./AdminButton";
import getDataFunc from "./AdminGetData";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import React, { useState, useEffect } from "react";
import SelectEmpresa from "./AdminSelectedEmpresas";
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
      formData.append("empresa", empresa);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 22);
      formData.append("SubOpcion", 1);

      getDataFunc(
        "RP_Consultas05",
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

  useEffect(() => {
    if (results.length > 0) {
      generarExcel();
    }
  }, [results]);

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    generarExcelFunc(
      "generar_excel",
      data,
      "TiquetesConvenioBolivariano",
      mostrarMensaje,
      setIsLoading
    );
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Tiquetes Convenio Bolivariano</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <SelectEmpresa
            empresa={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value);
            }}
            allowedCodes={[277, 278, 9001]}
          />
        </section>
        <section className="contabilidad_section">
          <div className="content__dateDH">{renderDatePicker()}</div>
        </section>
        {Button({ isLoading, getData })}
      </section>
      <ContainerButtonsLeft isLoading={isLoading} />
    </div>
  );
};

export default Inicio;
