import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTable from "./PruebaTabla";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [tipoInforme, setTipoInforme] = useState();
  const [tipoInforme2, setTipoInforme2] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]); // Contiene los resultados del procedimiento almacenado
  const [DateMY, setDateMY] = useState("");
  const [empresa, setEmpresa] = useState("");

  const rptoPOL = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    // Conversion de fecha y agregar hora
    if (tipoInforme && tipoInforme2) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);
      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/RptosDominicales/",
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
        fileName = `Dominicales_DetalladoDeViajesXConductor_${timestamp}.xlsx`;
      } else if (tipoInforme == 1) {
        fileName = `Dominicales_Consolidado-Empleado-Dominical-Bus_${timestamp}.xlsx`;
      } else if (tipoInforme == 2) {
        fileName = `Dominicales_TotalConductorXBus_${timestamp}.xlsx`;
      } else if (tipoInforme == 3) {
        fileName = `Dominicales_TotalXConductor_${timestamp}.xlsx`;
      } else if (tipoInforme == 4) {
        fileName = `Dominicales_TotalXBus_${timestamp}.xlsx`;
      } else if (tipoInforme == 5) {
        fileName = `Dominicales_DetalladoXBus_${timestamp}.xlsx`;
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
  // useEffect(() => {
  //   if (results.length > 0) {
  //     generarExcel();
  //   }
  // }, [results]);

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
    console.log(start);
    console.log(end);

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
      { key: "fecha", label: "FECHA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "VIAJES", type: "text" },
      { key: "bus", label: "DISPONIBLES", type: "number" },
    ];
  } else if (tipoInforme == 1) {
    columns = [
      { key: "fecha", label: "FECHA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "VIAJES", type: "text" },
      { key: "bus", label: "DISPONIBLES", type: "number" },
    ];
  } else if (tipoInforme == 2) {
    columns = [
      { key: "fecha", label: "FECHA", type: "number" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "VIAJES", type: "text" },
      { key: "bus", label: "DISPONIBLES", type: "number" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "bus", label: "BUS", type: "text" },
      { key: "Total_dominicales", label: "TOTAL DOMINICALES", type: "text" },
    ];
  }

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  const [tipoInforme2Options, setTipoInforme2Options] = useState();
  const handleTipoInformeChange2 = (e) => {
    const selectedTipoInforme2 = e.target.value;
    setTipoInforme(selectedTipoInforme2);

    // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
    if (selectedTipoInforme2 === "0") {
      setTipoInforme2Options([
        { value: "0", label: "Listado por Novedad" },
        { value: "1", label: "Empresa" },
        { value: "2", label: "Novedades" },
      ]);
    } else if (selectedTipoInforme2 === "1") {
      setTipoInforme2Options([
        { value: "0", label: "Listado Dominicales" },
        { value: "1", label: "Dominicales" },
      ]);
    } else if (selectedTipoInforme2 === "2") {
      setTipoInforme2Options([
        { value: "0", label: "Listado Archivo" },
        { value: "1", label: "Mensual" },
      ]);
    } else if (selectedTipoInforme2 === "3") {
      setTipoInforme2Options([
        { value: "0", label: "Listado Reporte" },
        { value: "1", label: "Por Mes" },
      ]);
    } else {
      setTipoInforme2Options([]); // Puedes cambiar esto según tus necesidades
    }
  };

  const handleTipoInformeChange3 = () => {
    if (tipoInforme == 0 && tipoInforme2 == 0) {
      return (
        <>
          <section className="row_section">
            <div className="input-container agg_colaborador">
              <select
                className="opciones"
                value={tipoInforme}
                onChange={(e) => {
                  handleTipoInformeChange2(e);
                }}
              >
                <option value="" disabled selected>
                  Seleccionar
                </option>
                <option value={0}>Ingreso</option>
                <option value={1}>Permiso</option>
                <option value={2}>Licencia</option>
                <option value={3}>Suspension</option>
                <option value={4}>Renuncia</option>
                <option value={5}>Dominicales</option>
                <option value={6}>Turno Adicional</option>
                <option value={7}>Incapacidad</option>
                <option value={8}>Traslado</option>
                <option value={9}>Otro</option>
                <option value={10}>Vacaciones</option>
              </select>
              <label className="input-label-options label">Novedad</label>
            </div>
            <div className="input-container agg_colaborador">
              <div>
                <input
                  type="month"
                  className="input-field"
                  value={DateMY}
                  onChange={(e) => {
                    setDateMY(e.target.value);
                    console.log(DateMY);
                  }}
                  min="YYYY-01"
                  max="YYYY-12"
                />
                <label className="input-label-options label">Mes y Año</label>
              </div>
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
                <option value={9000}>DATA TEST TIC</option>
                <option value={9001}>SERVICIO ESPECIAL</option>
              </select>
              <label className="input-label-options label">Empresa</label>
            </div>
          </section>
        </>
      );
    }
    if (
      ((tipoInforme == 0 || tipoInforme == 1 || tipoInforme == 2) &&
        tipoInforme2 == 1) ||
      (tipoInforme == 3 && tipoInforme2 == 0)
    ) {
      return (
        <>
          <section className="row_section">
            <div className="input-container agg_colaborador">
              <div>
                <input
                  type="month"
                  className="input-field"
                  value={DateMY}
                  onChange={(e) => {
                    setDateMY(e.target.value);
                    console.log(DateMY);
                  }}
                  min="YYYY-01"
                  max="YYYY-12"
                />
                <label className="input-label-options label">Mes y Año</label>
              </div>
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
                <option value={9000}>DATA TEST TIC</option>
                <option value={9001}>SERVICIO ESPECIAL</option>
              </select>
              <label className="input-label-options label">Empresa</label>
            </div>
          </section>
        </>
      );
    }
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Generador de Informes</h1>
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
                handleTipoInformeChange2(e);
              }}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={0}>Tipo Novedad</option>
              <option value={1}>Dominicales</option>
              <option value={2}>Archivo</option>
              <option value={3}>Reporte</option>
            </select>
            <label className="input-label-options label">
              Categoria Informe
            </label>
          </div>
        </section>
        <section className="contabilidad_section">
          {tipoInforme2Options && (
            <div className="input-container agg_colaborador">
              <select
                className="opciones"
                value={tipoInforme2}
                onChange={(e) => {
                  setTipoInforme2(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  Seleccionar
                </option>
                {tipoInforme2Options.map((option) => (
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
          {tipoInforme2 && (
            <>
              <div className="input-container agg_colaborador">
                {handleTipoInformeChange3()}
              </div>
              <button
                className="submit-button"
                onClick={rptoPOL}
                disabled={isLoading}
              >
                {isLoading ? "Generando..." : "Generar reporte"}
              </button>
            </>
          )}
        </section>
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
