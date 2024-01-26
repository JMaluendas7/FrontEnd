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

  const getData = async () => {
    setShowTable(false);
    setIsLoading(true);
    const formData = new FormData();
    if (startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("empresa", empresa);
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 34);
      formData.append("SubOpcion", tipoInforme);

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

  const generarExcel = async (via) => {
    try {
      const response = await axios.post(
        via
          ? "http://wsdx.berlinasdelfonce.com:9000/generar_excel/"
          : "http://wsdx.berlinasdelfonce.com:9000/generarRptoComercial/",
        via
          ? results
          : {
              results: results,
              // Opcion: tipoInforme,
              Opcion: 34,
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
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let fileName = "";
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      if (tipoInforme == 0) {
        fileName = `SeguridadVial_NumeroDespachosXDia_Consolidado_${timestamp}.xlsx`;
      } else if (tipoInforme == 1) {
        fileName = `SeguridadVial_NumeroDespachosXDia_Detallado_${timestamp}.xlsx`;
      } else if (tipoInforme == 2) {
        fileName = `SeguridadVial_CantidadVehiculosTrabajaronXDia_Consolidado_${timestamp}.xlsx`;
      } else if (tipoInforme == 3) {
        fileName = `SeguridadVial_CantidadVehiculosTrabajaronXDia_Detallado_${timestamp}.xlsx`;
      } else if (tipoInforme == 4) {
        fileName = `SeguridadVial_HorasEfectivasConductores_Consolidado_${timestamp}.xlsx`;
      } else if (tipoInforme == 5) {
        fileName = `SeguridadVial_HorasEfectivasXConductor_Detallado_${timestamp}.xlsx`;
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
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

  if (tipoInforme == 0) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "viajes", label: "VIAJES", type: "text" },
      { key: "HorasViaje", label: "HORAS VIAJE", type: "text" },
      { key: "KmViaje", label: "KM VIAJE", type: "text" },
    ];
  } else if (tipoInforme == 1) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "viaje", label: "VIAJE", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "matricula", label: "MATRICULA", type: "text" },
      { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
      { key: "fechaArribo", label: "FECHA ARRIBO", type: "text" },
      { key: "Horas", label: "HORAS", type: "text" },
      { key: "longitud", label: "LONGITUD", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "ruta", label: "RUTA", type: "text" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "nvehiculos", label: "N° VEHICULOS", type: "text" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "matricula", label: "MATRICULA", type: "text" },
    ];
  } else if (tipoInforme == 4) {
    columns = [
      { key: "Servicio", label: "SERVICIO", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "Nviajes", label: "N° VIAJES", type: "text" },
      { key: "HorasEfectivas", label: "HORAS EFECTIVAS", type: "text" },
      { key: "KMRecorridosViaje", label: "KM RECORRIDOS", type: "text" },
    ];
  } else if (tipoInforme == 5) {
    columns = [
      { key: "AAAP", label: "AÑO", type: "number" },
      { key: "MesP", label: "MES", type: "number" },
      { key: "diaP", label: "DIA", type: "text" },
      { key: "Servicio", label: "SERVICIO", type: "text" },
      { key: "viaje", label: "VIAJE", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "matricula", label: "MATRICULA", type: "text" },
      { key: "fechapartida", label: "FECHA PARTIDA", type: "text" },
      { key: "fechaArribo", label: "FECHA ARRIBO", type: "text" },
      { key: "HorasViaje", label: "HORAS VIAJE", type: "text" },
      { key: "longitudViajeKM", label: "KM VIAJE", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "ruta", label: "RUTA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "HorasEfectivas", label: "HORAS EFECTIVAS", type: "text" },
    ];
  }

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte de Seguridad Vial</h1>
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
              <option value="" disabled>
                Seleccionar
              </option>
              <option value={0}>
                Numero Viajes (Despachos) X Dia - Consolidado
              </option>
              <option value={1}>
                Numero Viajes (Despachos) X Dia - Detallado
              </option>
              <option value={2}>
                Cantidad de Vehiculos que Trabajaron X Dia - Consolidado
              </option>
              <option value={3}>
                Cantidad de Vehiculos que Trabajaron X Dia - Detallado
              </option>
              <option value={4}>
                Horas Efectivas Conductores - Consolidado
              </option>
              <option value={5}>Horas Efectivas X Conductor - Detallado</option>
            </select>
            <label className="input-label-options label">Tipo Informe</label>
          </div>
          <div className="input-container agg_colaborador">
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
              <option value={9001}>SERVICIO ESPECIAL</option>
            </select>
            <label className="input-label-options label">Empresa</label>
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
