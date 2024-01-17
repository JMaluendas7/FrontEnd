import React, { useState } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTable from "./PruebaTabla";

const Inicio = ({ mostrarMensaje }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const RptoConductores = async () => {
    setShowTable(false);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/RptoConductores/",
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
  };

  const generarExcel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoConductores/",
        {
          results: results,
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

      // Obtener el nombre del archivo del header 'Content-Disposition' de la respuesta
      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);

      let fileName = "";
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      fileName = `5apps_DetalladoCombustible_${timestamp}.xlsx`;

      if (fileNameMatch && fileNameMatch.length > 1) {
        fileName = fileNameMatch[1]; // Usar el nombre del archivo recibido del backend
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Establecer el nombre del archivo
      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      setIsLoading(false);
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "numero_bus", label: "N° BUS", type: "number" },
    { key: "matricula", label: "MATRICULA", type: "text" },
    { key: "nombre", label: "NOMBRE", type: "text" },
    { key: "apellido", label: "APELLIDO", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "number" },
    { key: "estado", label: "ESTADO", type: "text" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reportes de Conductores</h1>
      <hr />
      <section className="colum_table forms__box">
        <p>Informe del Estado de Conductores en Fics</p>
        <button
          className="submit-button"
          // onClick={generarExcel}
          onClick={RptoConductores}
          disabled={isLoading}
        >
          {isLoading ? "Generando..." : "Generar reporte"}
        </button>
      </section>
      {/* Handle animacion (Loading) */}
      {isLoading && <div class="loader"></div>}

      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
            />
            <div className="buttons_left">
              <div className="container__buttons_left" onClick={generarExcel}>
                <div className="descargar-xlsx">
                  <div className="buttons_left-label">Exportar a XLSX</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;
