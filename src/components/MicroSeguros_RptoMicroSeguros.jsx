import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./AdminTable";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";
import Button from "./AdminButton";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 1);
      formData.append("SubOpcion", 4);
      formData.append("empresa", empresa);
      getDataFunc(
        "RP_Consultas04",
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
    const url = "XlsxFics_MicroSegurosGET";
    const data = {
      results: results,
      Opcion: 1,
      SubOpcion: 2,
      empresa: empresa,
      startDate: formattedStartDate,
    };

    let fileName = "";
    if (empresa == 277) {
      fileName = `InformeVentaDeTiquetesConMicroseguros_Berlinas`;
    } else if (empresa == 278) {
      fileName = `InformeVentaDeTiquetesConMicroseguros_Berlitur`;
    }
    await generarExcelFunc(url, data, fileName, mostrarMensaje, setIsLoading);
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  const columns = [
    { key: "mes", label: "MES", type: "number" },
    { key: "NVIAJES", label: "NVIAJE", type: "number" },
    { key: "BUTACAS", label: "SILLAS", type: "number" },
    { key: "cont", label: "PASAJEROS", type: "number" },
    { key: "VALOR", label: "VALOR", type: "number" },
    { key: "MIcroseguro_Vendieron", label: "MICRO VENDIDOS", type: "number" },
    { key: "MIcroseguro_VIAJARON", label: "MICRO VIAJARON", type: "number" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">
        Informe de Venta de Tiquetes con Microseguros
      </h1>
      <hr />
      <section className="contabilidad_section forms__box">
        <SelectEmpresa
          empresa={empresa}
          onChange={(e) => {
            setEmpresa(e.target.value);
            setShowTable(false);
          }}
          allowedCodes={[277, 278]}
        />
        <div className="content__dateDH">{renderDatePicker()}</div>
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
