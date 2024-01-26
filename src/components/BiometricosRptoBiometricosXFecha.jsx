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
    setShowTable(false);
    setIsLoading(true);
    const formData = new FormData();
    if (startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("empresa", 277);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 33);
      formData.append("SubOpcion", 16);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoPlaneacion/",
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
          Opcion: 33,
          SubOpcion: 0,
          empresa: 277,
          startDate: startDate,
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
      const fileName = "5apps_ReporteBiometricoPorFecha";
      descargarArchivo({
        fileName: fileName,
        blob: response.data,
      });
    } catch (error) {
      mostrarMensaje("Error al generar el archivo Excel", "error_notification");
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "FechaRegistro", label: "FECHA REGISTRO", type: "text" },
    { key: "L_UID", label: "UID", type: "text" },
    { key: "Hora_Registro", label: "HORA REGISTRO", type: "text" },
    { key: "L_TID", label: "TID", type: "text" },
    { key: "C_Name", label: "BIOMETRICO", type: "text" },
    { key: "Terminal", label: "EMPLEADO", type: "text" },
    { key: "Documento", label: "DOCUMENTO", type: "number" },
    { key: "c_Post", label: "POST", type: "text" },
    { key: "Cargo", label: "CARGO", type: "text" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte De BioMetricos Por Fecha</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">
          <div className="content__dateDH">
            <section className="contabilidad_section">
              <div className="content__dateDH">{renderDatePicker()}</div>
            </section>
          </div>
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
