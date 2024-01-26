import React, { useState } from "react";
import axios from "axios";
import DynamicTable from "./PruebaTabla2";
import descargarArchivo from "./AdminDownloadXlsx";
import useDateRange from "./AdminDateRange";

const Inicio = ({ mostrarMensaje }) => {
  const { startDate, endDate, renderDatePicker } = useDateRange();
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (empresa && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("empresa", empresa);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 28);
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
          Opcion: 28,
          empresa: empresa,
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
      const fileName = `5apps_ComercialTrazabilidadDeVentas`;
      descargarArchivo({ fileName: fileName, blob: response.data });
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "Year", label: "AÑO", type: "text" },
    { key: "mes", label: "MES", type: "text" },
    { key: "empresa", label: "EMPRESA", type: "text" },
    { key: "ciudad", label: "CIUDAD", type: "text" },
    { key: "Agencia", label: "AGENCIA", type: "text" },
    { key: "Taquillero", label: "TAQUILLERO", type: "text" },
    { key: "NEC", label: "NEC", type: "number" },
    { key: "cant", label: "CANTIDAD", type: "number" },
    { key: "valor", label: "VALOR", type: "number" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Trazabilidad de Ventas</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <option value="" disabled>
                Seleccionar
              </option>
              <option value={277}>BERLINAS DEL FONCE S.A.</option>
              <option value={278}>BERLITUR S.A.S.</option>
              <option value={9001}>SERVICIO ESPECIAL</option>
            </select>
            <label className="input-label-options label">Empresa</label>
          </div>
        </section>
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
            <div
              className="container__buttons_left"
              onClick={() => generarExcel(false)}
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
