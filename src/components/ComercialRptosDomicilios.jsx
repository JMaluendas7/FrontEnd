import React, { useState } from "react";
import axios from "axios";
import DynamicTable from "./PruebaTabla2";
import descargarArchivo from "./AdminDownloadXlsx";
import useDateRange from "./AdminDateRange";

const Inicio = ({ mostrarMensaje }) => {
  const { startDate, endDate, renderDatePicker } = useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    if (startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("empresa", 277);
      formData.append("Opcion", 11);
      formData.append("SubOpcion", 0);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoDomicilios/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
            crossDomain: true,
            xsrfCookieName: "csrftoken",
            xsrfHeaderName: "X-CSRFToken",
          }
        );
        if (response.status === 200) {
          if (response.data.results && response.data.results.length > 0) {
            setResults(response.data.results);
            setShowTable(true);
            setIsLoading(false);
          } else {
            mostrarMensaje("Respuesta vacía", "warning_notification");
            setIsLoading(false);
          }
        }
      } catch (error) {
        mostrarMensaje("Respuesta no Exitosa", "error_notification");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      mostrarMensaje(
        "Debe seleccionar todos los campos",
        "warning_notification"
      );
    }
  };

  const generarExcel = async () => {
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoComercial/",
        {
          results: results,
          startDate: startDate,
          Opcion: 11,
          empresa: 277,
        },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      const fileName = `Estadisticas_DomiciliosPorLinea`;
      descargarArchivo({ fileName: fileName, blob: response.data });
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "year", label: "AÑO", type: "text" },
    { key: "mes", label: "NOMBRE", type: "text" },
    { key: "NOMBRE", label: "LINEA", type: "text" },
    { key: "cont", label: "CANTIDAD", type: "number" },
    { key: "VALOR", label: "VALOR", type: "number" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Domicilios por Linea</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">
          <div className="content__dateDH">{renderDatePicker()}</div>
        </section>
        <button
          className="submit-button"
          onClick={getData}
          disabled={isLoading}
        >
          {isLoading ? "Generando..." : "Generar reporte"}
        </button>
      </section>
      {/* Handle animacion (Loading) */}
      {isLoading && <div className="loader"></div>}
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
            />
          </div>
          <div className="buttons_left">
            <div className="container__buttons_left" onClick={generarExcel}>
              <div className="descargar-xlsx">
                <div className="buttons_left-label">Exportar a XLSX</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;
