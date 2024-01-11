import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

import DatePicker from "react-datepicker";

const Inicio = ({ mostrarMensaje }) => {
  const [codigo, setCodigo] = useState("");
  const [tipoInforme, setTipoInforme] = useState("");
  const [concepto, setConcepto] = useState("");
  const [empresa, setEmpresa] = useState("");

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [results, setResults] = useState([]);
  const rptoCuotaAdmin = async () => {
    setIsLoading(true);
    const formData = new FormData(); // Creacion del FormData

    if (tipoInforme && empresa && concepto && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      // Agregar las fechas al formData
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);

      // Obtiene los valores de los campos
      formData.append("codigo", codigo);
      formData.append("tipoInforme", tipoInforme);
      formData.append("concepto", concepto);
      formData.append("empresa", empresa);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoCuotaAdmin/",
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
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoAdmin/",
        { results: results, tipoInforme: tipoInforme },
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

      if (tipoInforme == 1) {
        fileName = `5apps_ReporteAgenciaDeViajes_${timestamp}.xlsx`;
      } else if (tipoInforme == 2) {
        fileName = `5apps_ReporteCiudades_${timestamp}.xlsx`;
      } else if (tipoInforme == 3) {
        fileName = `5apps_ReportePropietarios_${timestamp}.xlsx`;
      } else if (tipoInforme == 4) {
        fileName = `5apps_ReporteCiudadesColibertador_${timestamp}.xlsx`;
      } else if (tipoInforme == 5) {
        fileName = `5apps_ReporteAgenciasBerlitur_${timestamp}.xlsx`;
      }

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

  // Utiliza useEffect para ejecutar generarExcel cuando results se actualice
  useEffect(() => {
    if (results.length > 0) {
      generarExcel();
      mostrarMensaje("Respuesta Exitosa", "success_notification");
      setIsLoading(false);
    }
  }, [results]);

  // Manejo de campo date inicioFin
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeText, setDateRangeText] = useState("");

  const handleDateChange = (dates) => {
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

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte cuota de administración</h1>
      <hr />
      <section className="contabilidad__table">
        <div className="contabilidad_fr">
          <section className="contabilidad_section">
            <div className="input-container agg_colaborador">
              <label className="label">Tipo Informe:</label>
              <select
                className="opciones"
                value={tipoInforme}
                onChange={(e) => setTipoInforme(e.target.value)}
              >
                <option value="" disabled selected>
                  Seleccionar
                </option>
                <option disabled value={1}>
                  Agencias De Viajes
                </option>
                <option value={2}>Ciudades</option>
                <option value={3}>Propietarios</option>
                <option value={4}>Ciudades - Colibertador</option>
                <option value={5}>Agencias - Berlitur</option>
              </select>
            </div>
            <div className="input-container agg_colaborador">
              <label className="label">Concepto:</label>
              <select
                className="opciones"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
              >
                <option value="" disabled selected>
                  Seleccionar
                </option>
                <option value={"080101"}>Cuota Admon</option>
                <option value={"080103"}>Cuota Admon Agencias</option>
              </select>
            </div>
          </section>
          <section className="contabilidad_section">
            <div className="input-container agg_colaborador">
              <label className="label">Empresa:</label>
              <select
                className="opciones"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              >
                <option value="" disabled selected>
                  Seleccionar
                </option>
                <option value={277}>BERLINAS DEL FONCE S.A.</option>
                <option value={278}>BERLITUR S.A.S.</option>
                <option value={300}>COMPAÑIA LIBERTADOR S.A.</option>
                <option value={310}>
                  CARTAGENA INTERNATIONAL TRAVELS S.A.S. "CIT"
                </option>
                <option value={320}>TOURLINE EXPRESS S.A.S.</option>
                <option value={2771}>TRANSCARGA BERLINAS S.A.</option>
                <option value={9000}>DATA TEST TIC</option>
                <option value={9001}>SERVICIO ESPECIAL</option>
              </select>
            </div>
            <div className="content__dateDH">
              <label className="label">Rango de fecha:</label>
              <DatePicker
                className="input-field datepicker"
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
              {/* <p>{dateRangeText}</p> */}
              {/* <p>{startDate}</p>
            <p>{endDateDate}</p> */}
            </div>
          </section>
        </div>
        <button
          className="submit-button botton_gp"
          // onClick={generarExcel}
          onClick={rptoCuotaAdmin}
          disabled={isLoading}
        >
          {isLoading ? "Generando..." : "Generar reporte"}
        </button>
      </section>
      {/* Aquí puedes agregar una animación de carga si `isLoading` es `true` */}
      {isLoading && <div class="loader"></div>}
    </div>
  );
};

export default Inicio;
