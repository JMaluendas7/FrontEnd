import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import DynamicTable from "./PruebaTabla";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [DateF, setDateF] = useState("");
  const [tipoInforme, setTipoInforme] = useState();
  const [DateMY, setDateMY] = useState("");
  const [dni, setdni] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const rptoCombustible = async () => {
    setShowTable(false);
    setIsLoading(true);
    const formData = new FormData();
    if (DateMY && tipoInforme) {
      try {
        const [year, month] = DateMY.split("-");

        formData.append("month", month);
        formData.append("year", year);
        formData.append("Opcion", tipoInforme);
        if (dni) {
          formData.append("Documento", dni);
        }
        if (selectedDate) {
          const formattedDate =
            selectedDate.toISOString().split("T")[0] + "T00:00:00.00Z";
          try {
            formData.append("Fecha", formattedDate);
          } catch {
            mostrarMensaje();
          }
        }
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/RptoTaquillas/",
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
      const [year, month] = DateMY.split("-");
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoTaquillas/",
        {
          results: results,
          Month: month,
          Year: year,
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
      fileName = `5apps_PuntosDeVentaVentasTaquillerosBogota_${timestamp}.xlsx`;
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

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);

  const columns = [
    { key: "Nombres", label: "NOMBRE", type: "text" },
    {
      key: dni ? "Apellidos" : DateF ? "Apellidos" : "Apellido",
      label: "APELLIDO",
      type: "text",
    },
    { key: "Documento", label: "DOCUMENTO", type: "text" },
    { key: "Empresa", label: "EMPRESA", type: "text" },
    { key: "Año", label: "AÑO", type: "text" },
    { key: "Mes", label: "MES", type: "text" },
    { key: "Total_Ingresos", label: "INGRESOS", type: "text" },
  ];

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  // Manejo de campo date inicioFin
  const [dateRangeText, setDateRangeText] = useState("");
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
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

  useEffect(() => {
    mostrarMensaje(
      "De los opcionales puedes usar uno o ninguno",
      "warning_notification"
    );
  }, []);

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Pasajes Vendidos en Bogota</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            <div>
              <input
                type="month"
                className="input-field"
                value={DateMY}
                onChange={(e) => {
                  setDateMY(e.target.value);
                  setShowTable(false);
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
              value={tipoInforme}
              onChange={(e) => {
                setTipoInforme(e.target.value);
                setShowTable(false);
              }}
            >
              <option value="" disabled selected>
                Seleccionar
              </option>
              <option value={"25S"}>Terminal Salitre</option>
              <option value={"192S"}>Terminal del Norte</option>
            </select>
            <label className="input-label-options label">Lugar</label>
          </div>
          <div className="form__init">
            <div className="input-container">
              <input
                name="direccion"
                className="input-field-large icon_input_dni"
                placeholder=""
                type="number"
                value={dni}
                onChange={(e) => {
                  setdni(e.target.value);
                  setDateF(null);
                  setSelectedDate(null);
                  setShowTable(false);
                }}
              />
              <label className="input-label">
                Numero De Documento(Opcional)
              </label>
            </div>
          </div>
          <div className="content__dateDH">
            <div className="input-container">
              <DatePicker
                className="input-field-datepicker datepicker icon_calendar"
                selected={DateF}
                onChange={(date) => {
                  handleDateChange(date);
                  setdni("");
                  setShowTable(false);
                }}
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
                Fecha(Opcional)
              </label>
            </div>
          </div>
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
