import React, { useState } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import DynamicTable from "./PruebaTabla";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [tipoInforme, setTipoInforme] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [Opcion, setOpcion] = useState(2);
  const [empresa, setEmpresa] = useState("");

  const rptoCombustible = async () => {
    setShowTable(false);
    setIsLoading(true);
    const formData = new FormData();
    if (selectedDate) {
      const selectedDate2 =
        selectedDate.toISOString().split("T")[0] + "T00:00:00.00Z";

      formData.append("selectedDate", selectedDate2);
      formData.append("Terminal", tipoInforme);
      formData.append("Opcion", empresa);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptosMigracion/",
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
        "http://wsdx.berlinasdelfonce.com:9000/generarRptosMigracion/",
        {
          results: results,
          Opcion: Opcion,
          empresa: 277,
          startDate: selectedDate,
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
        fileName = `5apps_MigracionReporteBogota_${timestamp}.xlsx`;
      } else if (tipoInforme == 2) {
        fileName = `5apps_MigracionReporteAtlantico_${timestamp}.xlsx`;
      } else if (tipoInforme == 3) {
        fileName = `5apps_MigracionReporteBolivar_${timestamp}.xlsx`;
      } else if (tipoInforme == 4) {
        fileName = `5apps_MigracionReporteCesar_${timestamp}.xlsx`;
      } else if (tipoInforme == 5) {
        fileName = `5apps_MigracionReporteNorteDeSantander_${timestamp}.xlsx`;
      } else if (tipoInforme == 6) {
        fileName = `5apps_MigracionReporteSantander_${timestamp}.xlsx`;
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
  const [DateF, setDateF] = useState("");
  const [dateRangeText, setDateRangeText] = useState("");
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateF(date);

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

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "tipodoc", label: "TIPO DOC", type: "text" },
    { key: "documento", label: "DOCUMENTO", type: "text" },
    { key: "Apellido", label: "APELLIDO", type: "text" },
    { key: "Apellido2", label: "APELLIDO2", type: "text" },
    { key: "nombres", label: "NOMBRES", type: "text" },
    { key: "Nacionalidad", label: "NACIONALIDAD", type: "text" },
    { key: "fechanacimiento", label: "FECHA NACIMIENTO", type: "text" },
    { key: "sexo", label: "SEXO", type: "text" },
    { key: "telefonos", label: "TELEFONO", type: "text" },
    { key: "direccion", label: "DIRECCION", type: "text" },
    { key: "fechaPARTIDA", label: "FECHA PARTIDA", type: "text" },
    { key: "HORA_VIAJE", label: "HORA VIAJE", type: "text" },
    { key: "ModoTransporte", label: "MODO TRANSPORTE", type: "text" },
    { key: "TipoTransporte", label: "TIPO TRNASPORTE", type: "text" },
    { key: "NIT", label: "NIT", type: "text" },
    { key: "PAISORIGEN", label: "PAIS ORIGEN", type: "text" },
    { key: "DEPARTAMENTO_ORIGEN", label: "DEPARTAMENTO ORIGEN", type: "text" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  const [tipoInforme2Options, setTipoInforme2Options] = useState();
  const handleTipoInformeChange2 = (e) => {
    const selectedTipoInforme2 = e.target.value;
    setTipoInforme(selectedTipoInforme2);

    // Actualizar las opciones de tipoInforme2 según la selección de tipoInforme
    if (selectedTipoInforme2 == "2") {
      setTipoInforme2Options([
        { value: "1", label: "Bogota" },
        { value: "2", label: "Atlantico" },
        { value: "3", label: "Bolivar" },
        { value: "4", label: "Cesar" },
        { value: "5", label: "Norte de Santander" },
        { value: "6", label: "Santander" },
      ]);
    } else if (selectedTipoInforme2 === "4") {
      setTipoInforme2Options([
        { value: "2", label: "Atlantico" },
        { value: "3", label: "Bolivar" },
        { value: "4", label: "Cesar" },
      ]);
    } else {
      setTipoInforme2Options([]); // Puedes cambiar esto según tus necesidades
    }
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Migración</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="contabilidad_section">
          <div className="content__dateDH">
            <div className="input-container">
              <DatePicker
                className="input-field-datepicker datepicker icon_calendar"
                selected={DateF}
                onChange={handleDateChange}
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
                Fecha
              </label>
            </div>
          </div>
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={empresa}
              onChange={(e) => {
                setEmpresa(e.target.value);
                handleTipoInformeChange2(e);
              }}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={2}>BERLINAS DEL FONCE S.A.</option>
              <option value={4}>COMPAÑIA LIBERTADOR S.A.</option>
            </select>
            <label className="input-label-options label">Empresa</label>
          </div>
          {tipoInforme2Options && (
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
                {tipoInforme2Options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label className="input-label-options label">Ciudad</label>
            </div>
          )}
        </section>
        <button
          className="submit-button"
          onClick={rptoCombustible}
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
