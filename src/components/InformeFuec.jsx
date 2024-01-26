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
  const [results, setResults] = useState([]); // Contiene los resultados del procedimiento almacenado

  const rptoOperacionesViajes = async () => {
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
          "http://wsdx.berlinasdelfonce.com:9000/rptoHistoricoFuec/",
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
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoFuec/",
        {
          results: results,
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

      // Obtener el nombre del archivo del header 'Content-Disposition' de la respuesta
      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss
      const fileName = `5apps_InformeFuec_${timestamp}.xlsx`;

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

  const columns = [
    { key: "Numero_Fuec", label: "N° FUEC", type: "text" },
    { key: "Nit_Cliente", label: "NIT CLIENTE", type: "text" },
    { key: "Nombre_Cliente", label: "NOMBRE CLIENTE", type: "text" },
    { key: "Domento_Repre", label: "DOCUMENTO", type: "number" },
    { key: "Representante", label: "REPRESENTANTE", type: "text" },
    { key: "Recorrido", label: "RECORRIDO", type: "text" },
    { key: "Bus", label: "BUS", type: "text" },
    { key: "Placa", label: "PLACA", type: "text" },
    { key: "Nombre_Conductor1", label: "NOMBRE C1", type: "text" },
    { key: "Nombre_Conductor2", label: "NOMBRE C2", type: "text" },
  ];

  const itemsPerPage = 30;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe FUEC</h1>
      <hr />
      <section className="contabilidad__table forms__box">
        <section className="contabilidad_section">
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={"860015624-1"}>BERLINAS DEL FONCE S.A.</option>
              {/* <option value={278}>BERLITUR S.A.S.</option> */}
              <option value={"800017584-6"}>COMPAÑIA LIBERTADOR S.A.</option>
              <option value={"800204916-1"}>
                CARTAGENA INTERNATIONAL TRAVELS S.A.S. "CIT"
              </option>
              {/* <option value={2771}>TRANSCARGA BERLINAS S.A.</option>
              <option value={9001}>SERVICIO ESPECIAL</option> */}
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
            // onClick={generarExcel}
            onClick={rptoOperacionesViajes}
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
