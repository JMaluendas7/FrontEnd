import React, { useState } from "react";
import axios from "axios";
import DynamicTable from "./PruebaTabla2";
import descargarArchivo from "./AdminDownloadXlsx";

const Inicio = ({ mostrarMensaje }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [dni, setdni] = useState("");

  const getData = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    if (dni) {
      const now = new Date();
      const formattedNow = now.toISOString().split(".")[0] + "Z";

      formData.append("empresa", 277);
      formData.append("startDate", formattedNow);
      formData.append("endDate", formattedNow);
      formData.append("Opcion", 12);
      formData.append("SubOpcion", 0);
      formData.append("documento", dni);

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
        "Debes digitar el numero de documento",
        "warning_notification"
      );
    }
  };

  const generarExcel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoComercial/",
        {
          results: results,
          Opcion: 12,
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
      const fileName = `Estadisticas_ViajesPorPasajero`;
      descargarArchivo({ fileName: fileName, blob: response.data });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "nombre", label: "EMPRESA", type: "text" },
    { key: "viaje", label: "VIAJE", type: "number" },
    { key: "fechapartida", label: "F PARTIDA", type: "text" },
    { key: "vehiculo", label: "VEHICULO", type: "text" },
    { key: "NUMERO", label: "NUMERO", type: "text" },
    { key: "importefinal", label: "IMPORTE FINAL", type: "number" },
    { key: "LINEA", label: "LINEA", type: "text" },
    { key: "origen", label: "ORIGEN", type: "text" },
    { key: "destino", label: "DESTINO", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "number" },
    { key: "nombres", label: "NOMBRE", type: "text" },
    { key: "apellido", label: "APELLIDO", type: "text" },
    { key: "telefonos", label: "TELEFONO", type: "text" },
    { key: "email", label: "EMAIL", type: "text" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Viajes Por Pasajero</h1>
      <hr />
      <section className="colum_table forms__box">
        <div className="form__init">
          <div className="input-container">
            <input
              name="direccion"
              className="input-field-large icon_input_dni"
              placeholder=""
              type="number"
              value={dni}
              onChange={(e) => setdni(e.target.value)}
            />
            <label className="input-label">Numero De Documento</label>
          </div>
          <button
            className="submit-button"
            onClick={getData}
            disabled={isLoading}
          >
            {isLoading ? "Generando..." : "Generar reporte"}
          </button>
        </div>
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
            <div
              className="container__buttons_left"
              onClick={() => generarExcel()}
            >
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
