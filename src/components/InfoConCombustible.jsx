import React, { useState } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import DynamicTable from "./PruebaTabla";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const rptoCombustible = async () => {
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
      formData.append("Opcion", 29);
      formData.append("SubOpcion", 0);

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
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoOViajes/",
        {
          results: results,
          Opcion: 29,
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
    const [start, end] = dates;
    setSelectedDate(dates);
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      const formattedStartDate = start.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const formattedEndDate = end.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      setDateRangeText(`${formattedStartDate} - ${formattedEndDate}`);
    } else {
      setDateRangeText("");
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "pvh_empid", label: "ID EMPRESA", type: "text" },
    { key: "emp_nomempresa", label: "NOMBRE EMPRESA", type: "text" },
    { key: "pvh_year", label: "AÑO", type: "number" },
    { key: "pvh_mes", label: "MES", type: "number" },
    { key: "cantbus", label: "N° Buses", type: "number" },
    { key: "Valor", label: "Valor", type: "number" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Consolidado de Combustible</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">
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
        </section>
        <button
          className="submit-button"
          // onClick={generarExcel}
          onClick={rptoCombustible}
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
