import React, { useState } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import DynamicTable from "./PruebaTabla";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const rptoConsolidadoPM = async () => {
    setShowTable(false);
    setIsLoading(true);
    const formData = new FormData();
    if (tipoInforme && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/RptosMacarena/",
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
        "http://wsdx.berlinasdelfonce.com:9000/generarRptosMacarena/",
        {
          results: results,
          Opcion: tipoInforme,
          startDate: startDate,
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

      // Obtener el nombre del archivo del header 'Content-Disposition' de la respuesta
      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);

      let fileName = "";
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      if (tipoInforme == 1) {
        fileName = `5apps_InformeRelacionDeTiquetesMacarena_${timestamp}.xlsx`;
      } else if (tipoInforme == 2) {
        fileName = `5apps_InformeRelacionDeTiquetesVencioMacarena_${timestamp}.xlsx`;
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

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 1) {
    columns = [
      { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
      { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
      { key: "boldev", label: "BOLDEV", type: "text" },
      { key: "IMPORTEOPERACION", label: "IMPORTE OPERACION", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "ID", label: "ID", type: "text" },
      { key: "FECHAPARTIDA", label: "F PARTIDA", type: "text" },
      { key: "BUS", label: "BUS", type: "text" },
      { key: "MATRICULA", label: "MATRICULA", type: "text" },
      { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
      { key: "NOMBRES", label: "NOMBRE", type: "text" },
      { key: "APELLIDO", label: "APELLIDO", type: "text" },
      { key: "estado", label: "ESTADO", type: "text" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
      { key: "Fecha_vencimiento", label: "FECHA VENCIMIENTO", type: "text" },
      { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
      { key: "boldev", label: "BOLDEV", type: "text" },
      { key: "IMPORTEOPERACION", label: "IMPORTE OPERACION", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "ID", label: "ID", type: "text" },
      { key: "FECHAPARTIDA", label: "F PARTIDA", type: "text" },
      { key: "BUS", label: "BUS", type: "text" },
      { key: "MATRICULA", label: "MATRICULA", type: "text" },
      { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
      { key: "NOMBRES", label: "NOMBRE", type: "text" },
      { key: "APELLIDO", label: "APELLIDO", type: "text" },
      { key: "estado", label: "ESTADO", type: "text" },
      { key: "Dif_DiasVencimiento", label: "DIAS VENCIMIENTO", type: "text" },
    ];
  }

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte Convenio Macarena</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={tipoInforme}
              onChange={(e) => {
                setTipoInforme(e.target.value);
                setShowTable(false);
              }}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={1}>Relacion de Tiquetes</option>
              <option value={2}>Relacion de Tiquetes Vencidos</option>
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
