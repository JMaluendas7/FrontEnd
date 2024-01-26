import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTable from "./PruebaTabla";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]); // Contiene los resultados del procedimiento almacenado
  const [empresa, setEmpresa] = useState("");
  const [Opcion, setOpcion] = useState(9);

  const rptoPOL = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    // Conversion de fecha y agregar hora
    if (empresa && startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      if (empresa == 300) {
      }
      formData.append("Opcion", Opcion);
      formData.append("SubOpcion", tipoInforme);
      formData.append("empresa", empresa);
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
            setShowTable(false);
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
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoPL/",
        {
          results: results,
          Opcion: Opcion,
          SubOpcion: tipoInforme,
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

      let fileName = "";
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      if (Opcion == 9) {
        if (tipoInforme == 0) {
          fileName = `5apps_InformeConsolidadoPlaneacionOcupacionXLineas_${timestamp}.xlsx`;
        } else if (tipoInforme == 1) {
          fileName = `5apps_InformeDetalladoPlaneacionOcupacionXLineas_${timestamp}.xlsx`;
        }
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
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
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

  if (Opcion == 9) {
    if (tipoInforme == 0) {
      columns = [
        { key: "year", label: "AÑO", type: "number" },
        { key: "mes", label: "MES", type: "number" },
        { key: "nbuses", label: "N° BUSES", type: "number" },
        { key: "viajes", label: "VIAJES", type: "viajes" },
        { key: "disponibles", label: "DISPONIBLES", type: "number" },
        { key: "pasajeros", label: "PASAJEROS", type: "number" },
        { key: "valorbruto", label: "V BRUTO", type: "number" },
        { key: "seguro", label: "SEGURO", type: "number" },
        { key: "valorneto", label: "V NETO", type: "number" },
        { key: "ocupacion", label: "OCUPACION", type: "number" },
        { key: "promPaxxviaje", label: "PROM PAX VIAJE", type: "number" },
        {
          key: "promValxviaje_Bruto",
          label: "PROM PAX VJE BRUTO",
          type: "number",
        },
        {
          key: "promValxviaje_Neto",
          label: "PROM PAX VJE NETO",
          type: "number",
        },
        { key: "promTarifa_bruto", label: "PROM TAR BRUTO", type: "number" },
        {
          key: "promViajesMensualxbus",
          label: "PROM VJE MENS X BUS",
          type: "number",
        },
        {
          key: "promProdxbus_bruto",
          label: "PROM PROD X BUS BRUTO",
          type: "number",
        },
        {
          key: "PromProdxbus_Neto",
          label: "PROM PROD X BUS NETO",
          type: "number",
        },
      ];
    } else if (tipoInforme == 1) {
      columns = [
        { key: "YEAR", label: "AÑO", type: "number" },
        { key: "mes", label: "MES", type: "number" },
        { key: "Origen", label: "ORIGEN", type: "text" },
        { key: "Destino", label: "DESTINO", type: "text" },
        { key: "Recorrido", label: "RECORRIDO", type: "text" },
        { key: "viajes", label: "VIAJES", type: "number" },
        { key: "disponibles", label: "DISPONIBLES", type: "number" },
        { key: "pasajeros", label: "PASAJEROS", type: "number" },
        { key: "valor", label: "VALOR", type: "number" },
        { key: "Seguro", label: "SEGURO", type: "number" },
      ];
    } else if (tipoInforme == 2 || tipoInforme == 3) {
      columns = [
        { key: "Servicio", label: "SERVICIO", type: "text" },
        { key: "YEAR", label: "AÑO", type: "number" },
        { key: "mes", label: "MES", type: "number" },
        { key: "viajes", label: "VIAJES", type: "text" },
        { key: "disponibles", label: "BUTACAS", type: "text" },
        { key: "pasajeros", label: "PASAJEROS", type: "number" },
        { key: "valor", label: "VALOR", type: "number" },
      ];
    } else if (tipoInforme == 4) {
      columns = [
        { key: "year", label: "AÑO", type: "number" },
        { key: "mes", label: "MES", type: "number" },
        { key: "origen", label: "MES", type: "text" },
        { key: "destino", label: "MES", type: "text" },
        { key: "recorrido", label: "MES", type: "text" },
        { key: "HORA", label: "MES", type: "text" },
        { key: "viajes", label: "VIAJES", type: "text" },
        { key: "disponibles", label: "BUTACAS", type: "text" },
        { key: "pasajeros", label: "PASAJEROS", type: "number" },
        { key: "valor", label: "VALOR", type: "number" },
        { key: "Seguro", label: "VALOR", type: "number" },
      ];
    }
  } else if (Opcion == 17) {
    columns = [
      { key: "SERVICIO", label: "AÑO", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "viajes", label: "VIAJES", type: "text" },
      { key: "butacas", label: "BUTACAS", type: "text" },
      { key: "cantidad", label: "CANTIDAD", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  }

  const itemsPerPage = 15;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
  const [tipoInformeOptions, setTipoInformeOptions] = useState();
  const handleTipoInforme = (e) => {
    const selectedTipoInforme2 = e.target.value;

    // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
    if (selectedTipoInforme2 == "300") {
      setTipoInformeOptions([
        { value: "0", label: "Consolidado Total" },
        { value: "1", label: "Consolidado Por Linea" },
        { value: "2", label: "Consolidado Por Ruta" },
        { value: "3", label: "Consolidado Mensual" },
        { value: "4", label: "Consolidado Por Horario" },
      ]);
    } else {
      setTipoInformeOptions([
        { value: "0", label: "Informe Consolidado" },
        { value: "1", label: "Informe Detallado" },
      ]);
    }
  };
  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe de Ocupacion por Lineas</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={empresa}
              onChange={(e) => {
                setEmpresa(e.target.value);
                handleTipoInforme(e);
                setShowTable(false);
              }}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={277}>BERLINAS DEL FONCE S.A.</option>
              <option value={278}>BERLITUR S.A.S.</option>
              <option value={310}>
                CARTAGENA INTERNATIONAL TRAVELS S.A.S. "CIT"
              </option>
              <option value={300}>COLIBERTADOR</option>
              <option value={320}>TOURLINE EXPRESS S.A.S.</option>
              <option value={9001}>SERVICIO ESPECIAL</option>
            </select>
            <label className="input-label-options label">Empresa</label>
          </div>
          {tipoInformeOptions && (
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
                {tipoInformeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label className="input-label-options label">
                Tipo de Informe
              </label>
            </div>
          )}
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
          onClick={rptoPOL}
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
