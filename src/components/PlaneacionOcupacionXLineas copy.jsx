import React, { useState } from "react";
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

  const rptoPOL = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    // Conversion de fecha y agregar hora
    if (tipoInforme && empresa && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 9);
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
        // {
        //   results: results,
        //   Opcion: 9,
        //   SubOpcion: tipoInforme,
        //   empresa: empresa,
        //   startDate: startDate,
        // },
        // {
        //   responseType: "blob",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Accept: "application/json",
        //   },
        //   withCredentials: true,
        // }
      );
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un enlace (link) para iniciar la descarga
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "colaboradores.xlsx"); // Nombre del archivo
      document.body.appendChild(link);

      // Hacer clic en el enlace para iniciar la descarga
      link.click();

      // Limpiar el objeto URL y el enlace después de la descarga
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // // Obtener el nombre del archivo del header 'Content-Disposition' de la respuesta
      // const contentDisposition = response.headers["content-disposition"];
      // const fileNameMatch =
      //   contentDisposition && contentDisposition.match(/filename="(.+)"/);

      // let fileName = "";
      // const now = new Date();
      // const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-"); // Formato: YYYY-MM-DDTHH-mm-ss

      // if (Opcion == 1) {
      //   if (SubOpcion == 2)
      //     fileName = `5apps_InformeXFechasPM_${timestamp}.xlsx`;
      // }

      // if (fileNameMatch && fileNameMatch.length > 1) {
      //   fileName = fileNameMatch[1]; // Usar el nombre del archivo recibido del backend
      // }

      // const url = window.URL.createObjectURL(new Blob([response.data]));

      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", fileName); // Establecer el nombre del archivo
      // document.body.appendChild(link);

      // link.click();

      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Manejo de campo date inicioFin
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
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

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

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
      { key: "promValxviaje_Neto", label: "PROM PAX VJE NETO", type: "number" },
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
  }

  const itemsPerPage = 15;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe de Ocupacion por Lineas</h1>
      <hr />
      <section className="colum_table">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            <label className="label">Tipo Informe:</label>
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
              <option value={0}>Informe Consolidado</option>
              <option value={1}>Informe Detallado</option>
            </select>
          </div>
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
              <option value={310}>
                CARTAGENA INTERNATIONAL TRAVELS S.A.S. "CIT"
              </option>
              <option value={320}>TOURLINE EXPRESS S.A.S.</option>
              <option value={9001}>SERVICIO ESPECIAL</option>
            </select>
          </div>
        </section>
        <section className="contabilidad_section">
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
          </div>
        </section>
        <button
          className="submit-button"
          // onClick={generarExcel}
          onClick={rptoPOL}
          disabled={isLoading}
        >
          {isLoading ? "Generando..." : "Generar reporte"}
        </button>
      </section>
      {/* Handle animacion (Loading) */}
      {isLoading && <div className="loader"></div>}
      {showTable && (
        <div className="tablaFuecOD">
          <hr className="hr" />
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
            />
          </div>
          <button
            className="submit-button"
            // onClick={generarExcel}
            onClick={generarExcel}
            disabled={isLoading}
          >
            {isLoading ? "Descargando..." : "Descargar Reporte"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Inicio;
