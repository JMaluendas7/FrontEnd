import React, { useState } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "/src/css/fuec/Rpto_fuec.css";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTable from "./PruebaTabla";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    setShowTable(false);
    setIsLoading(true);
    const formData = new FormData();
    if (empresa && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 0);
      formData.append("SubOpcion", 0);
      formData.append("empresa", empresa);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoOperaciones/",
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
    const concepto = 0;
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoOViajes/",
        {
          results: results,
          Opcion: 0,
          SubOpcion: 0,
          empresa: empresa,
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

      let fileName = "";
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      if (concepto == 0) {
        fileName = `5apps_ReporteOperacionesViajes_${timestamp}.xlsx`;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Manejo de campo date inicioFin
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeText, setDateRangeText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (dates) => {
    setSelectedDate(dates);
    const [start, end] = dates;

    const formatDate = (date) =>
      date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

    setStartDate(start);
    setEndDate(end);
    setDateRangeText(
      start && end ? `${formatDate(start)} - ${formatDate(end)}` : ""
    );
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "AAA", label: "Año", type: "number" },
    { key: "mes", label: "Mes", type: "text" },
    { key: "CATEGORIA", label: "CATEGORIA", type: "text" },
    { key: "Nbuses", label: "BUSES", type: "number" },
    { key: "tipoviaje", label: "TIPO VIAJE", type: "text" },
    { key: "TOTAL", label: "TOTAL", type: "text" },
    { key: "VCANCELA", label: "VCANCELA", type: "text" },
    { key: "VACTIVO", label: "VACTIVO", type: "text" },
    { key: "CUMPLIMIENTO", label: "CUMPLIMIENTO", type: "text" },
  ];

  const itemsPerPage = 15;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte de Viajes</h1>
      <hr />
      <section className="contabilidad__table forms__box">
        <section className="contabilidad_section">
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
              {/* <option value={300}>COMPAÑIA LIBERTADOR S.A.</option>
              <option value={310}>
              CARTAGENA INTERNATIONAL TRAVELS S.A.S. "CIT"
              </option>
            <option value={2771}>TRANSCARGA BERLINAS S.A.</option> */}
              <option value={9001}>SERVICIO ESPECIAL</option>
              {/* <option value={320}>TOURLINE EXPRESS S.A.S.</option> */}
              {/* <option value={9000}>DATA TEST TIC</option> */}
            </select>
            <label className="input-label-options label">Empresa</label>
          </div>
          <div className="content__dateDH">
            <div className="input-container">
              <DatePicker
                className="input-field-datepicker datepicker icon_calendar"
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                inputMode="none"
                onFocus={(e) => e.target.blur()}
                onBlur={(e) => e.target.blur()}
                disabledInput
                locale={es}
              />
              <label
                className={`input-label-datepicker ${
                  selectedDate ? "label" : ""
                }`}
              >
                Rango de Fecha
              </label>
            </div>
          </div>
          <button
            className="submit-button"
            onClick={getData}
            disabled={isLoading}
          >
            {isLoading ? "Consultando..." : "Consultar Reporte"}
          </button>
        </section>
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
