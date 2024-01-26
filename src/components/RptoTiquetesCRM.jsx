import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const rptoConsolidadoPM = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (tipoInforme && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00";
      const formattedDate = Date2.toISOString().split("T")[0] + "T00:00:00.00";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Date", formattedDate);
      formData.append("Opcion", tipoInforme);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/TiquetesCRM/",
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
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generar_excel/",
        results,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un enlace (link) para iniciar la descarga
      const link = document.createElement("a");
      link.href = url;
      let fileName = "";
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      if (tipoInforme == 0) {
        fileName = `ReporteTiquetesCRM_Personas_${timestamp}.xlsx`;
      } else if (tipoInforme == 1) {
        fileName = `ReporteTiquetesCRM_ViajeroFrecuente_${timestamp}.xlsx`;
      } else if (tipoInforme == 2) {
        fileName = `ReporteTiquetesCRM_VentaOnline_${timestamp}.xlsx`;
      }
      link.setAttribute("download", fileName); // Nombre del archivo
      document.body.appendChild(link);

      // Hacer clic en el enlace para iniciar la descarga
      link.click();

      // Limpiar el objeto URL y el enlace después de la descarga
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };
  // Utiliza useEffect para ejecutar generarExcel cuando results se actualice
  useEffect(() => {
    if (results.length > 0) {
      generarExcel();
    }
  }, [results]);

  // Manejo de campo date inicioFin
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeText, setDateRangeText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (dates) => {
    setSelectedDate(dates);
    const [start, end] = dates;
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

  // Manejo de campo date inicioFin
  const [Date2, setDate2] = useState("");
  const [show, setShow] = useState(false);

  const handleDateChange2 = (date) => {
    setDate2(date);
    if (date) {
      const formattedDate = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      setDateRangeText(`${formattedDate}`);
    } else {
      setDateRangeText("");
    }
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte de Tiquetes CRM</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={tipoInforme}
              onChange={(e) => {
                setTipoInforme(e.target.value);
              }}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={0}>Personas</option>
              <option value={1}>Viajero Frecuente</option>
              <option value={2}>Venta Online</option>
            </select>
            <label className="input-label-options label">Tipo Informe</label>
          </div>
        </section>
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
          <div className="content__dateDH">
            <div className="input-container">
              <DatePicker
                className="input-field-datepicker datepicker icon_calendar"
                selected={Date2}
                onChange={handleDateChange2}
                inputMode="none"
                onBlur={() => setShow(false)}
                onSelect={() => setShow(false)}
                onInputClick={() => setShow(true)}
                onClickOutside={() => setShow(false)}
                open={show}
                locale={es}
              />
              <label
                className={`input-label-datepicker ${
                  selectedDate ? "label" : ""
                }`}
              >
                Fecha de Transacción
              </label>
            </div>
          </div>
        </section>
        <button
          className="submit-button"
          onClick={rptoConsolidadoPM}
          disabled={isLoading}
        >
          {isLoading ? "Generando..." : "Generar reporte"}
        </button>
      </section>
      {/* Handle animacion (Loading) */}
      {isLoading && <div className="loader"></div>}
    </div>
  );
};

export default Inicio;
