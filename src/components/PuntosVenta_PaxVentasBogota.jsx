import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import useDateRange from "./AdminDateRange";
import ButtonGenerar from "./AdminButtonGenerar";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("empresa", 277);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 13);
      formData.append("SubOpcion", 0);
      formData.append("Cadena01", 23776);
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
    data.append("Opcion", 13);
    data.append("Opcion2", 2);
    data.append("SubOpcion", 0);
    data.append("SubOpcion2", 1);
    data.append("empresa", 277);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "InformePasajesVendidosBogota",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "numero", label: "N°", type: "text" },
    { key: "importefinal", label: "IMPORTE FINAL", type: "text" },
    { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
    { key: "Agencia", label: "AGENCIA", type: "text" },
    { key: "nombre", label: "PAIS", type: "text" },
    { key: "texto", label: "TEXTO", type: "text" },
    { key: "Estado", label: "ESTADO", type: "text" },
    { key: "Descripcion", label: "DESCRIPCION", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "text" },
    { key: "apellido", label: "APELLIDO", type: "text" },
    { key: "nombres", label: "NOMBRES", type: "text" },
    { key: "telefonos", label: "TELEFONOS", type: "text" },
    { key: "email", label: "EMAIL", type: "text" },
    { key: "viaje", label: "VIAJE", type: "text" },
    { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
    { key: "origen", label: "ORIGEN", type: "text" },
    { key: "destino", label: "DESTINO", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Pasajes Vendidos en Bogota</h1>
      <hr />
      <section className="colum_table forms__box">
        {renderDatePicker()}
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
