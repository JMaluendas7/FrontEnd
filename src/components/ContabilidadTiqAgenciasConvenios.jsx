import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTable from "./PruebaTabla";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]); // Contiene los resultados del procedimiento almacenado

  const rptoInfoXFechasPM = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    // Conversion de fecha y agregar hora
    if (empresa && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 1);
      formData.append("SubOpcion", 2);
      formData.append("empresa", empresa);
      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoOperaciones/",
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

  // useEffect para ejecutar calcularPorcentajes cuando results se actualice
  useEffect(() => {
    const calcularPorcentajesYAgregar = () => {
      const nuevosResultados = JSON.parse(JSON.stringify(results));

      nuevosResultados.forEach((fila) => {
        const porcentajeCalculado = ((100 * fila.cont) / fila.BUTACAS).toFixed(
          2
        );
        fila.porcentajeCalculado = porcentajeCalculado;
      });

      // Verificar si los nuevos resultados son diferentes de los actuales antes de actualizar el estado
      if (!sonIguales(results, nuevosResultados)) {
        setResults(nuevosResultados);
      }
    };
    calcularPorcentajesYAgregar();
  }, [results]);

  // Función para verificar si dos arrays son iguales
  const sonIguales = (array1, array2) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
  };

  const generarExcel = async () => {
    const Opcion = 1;
    const SubOpcion = 2;
    console.log(results);
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoOViajes/",
        {
          results: results,
          Opcion: Opcion,
          SubOpcion: SubOpcion,
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

      if (Opcion == 1) {
        if (SubOpcion == 2)
          fileName = `5apps_InformeXFechasPM_${timestamp}.xlsx`;
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

  if (empresa != 277) {
    columns = [
      { key: "EMPRESA", label: "EMPRESA", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "LINEA", label: "LINEA", type: "text" },
      { key: "NVIAJES", label: "NVIAJE", type: "text" },
      { key: "BUTACAS", label: "SILLAS", type: "number" },
      { key: "cont", label: "PASAJEROS", type: "number" },
      { key: "VALOR", label: "VALOR", type: "number" },
    ];
  } else {
    columns = [
      { key: "EMPRESA", label: "EMPRESA", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "fechabusqueda", label: "FECHA BUSQUEDA", type: "text" },
      { key: "LINEA", label: "LINEA", type: "text" },
      { key: "NVIAJES", label: "NVIAJE", type: "text" },
      { key: "BUTACAS", label: "SILLAS", type: "number" },
      { key: "cont", label: "PASAJEROS", type: "number" },
      { key: "porcentajeCalculado", label: "% OCUPACION", type: "text" },
      { key: "VALOR", label: "VALOR", type: "number" },
    ];
  }

  const itemsPerPage = 15;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informes de Tiquetes y Agencias</h1>
      <hr />
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
          {/* <p>{dateRangeText}</p> */}
          {/* <p>{startDate}</p>
            <p>{endDateDate}</p> */}
        </div>

        <div className="buttons_rptos">
          <button
            className="submit-button botton_gp"
            // onClick={generarExcel}
            onClick={rptoInfoXFechasPM}
            disabled={isLoading}
          >
            {isLoading ? "Generando..." : "Tiquetes Bello Sol SE"}
          </button>
          <div className="bottom_bolivariano">
            <div className="input-container agg_colaborador">
              <label className="label">Empresa:</label>
              <select
                className="opciones"
                value={empresa}
                onChange={(e) => {
                  setEmpresa(e.target.value);
                  setShowTable(false);
                }}
                required
              >
                <option value="" disabled selected>
                  Seleccionar
                </option>
                <option value={277}>BERLINAS DEL FONCE S.A.</option>
                <option value={278}>BERLITUR S.A.S.</option>
                <option value={9001}>SERVICIO ESPECIAL</option>
              </select>
            </div>
            <button
              className="submit-button botton_gp"
              // onClick={generarExcel}
              onClick={rptoInfoXFechasPM}
              disabled={isLoading}
            >
              {isLoading ? "Generando..." : "Convenio Bolivariano"}
            </button>
          </div>
          <button
            className="submit-button botton_gp"
            // onClick={generarExcel}
            onClick={rptoInfoXFechasPM}
            disabled={isLoading}
          >
            {isLoading ? "Generando..." : "Venta Online Berlitur"}
          </button>
          <button
            className="submit-button botton_gp"
            // onClick={generarExcel}
            onClick={rptoInfoXFechasPM}
            disabled={isLoading}
          >
            {isLoading ? "Generando..." : "Transacciones Tarjetas CR y DB"}
          </button>
          <button
            className="submit-button botton_gp"
            // onClick={generarExcel}
            onClick={rptoInfoXFechasPM}
            disabled={isLoading}
          >
            {isLoading
              ? "Generando..."
              : "Estadisticas de Link de Pago y Venta Online MP"}
          </button>
        </div>
      </section>
      {/* Handle animacion (Loading) */}
      {isLoading && <div class="loader"></div>}
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
            className="submit-button botton_gp"
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
