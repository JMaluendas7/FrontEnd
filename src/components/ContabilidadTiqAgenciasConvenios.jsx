import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";
import DynamicTable from "./PruebaTabla";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";

const Inicio = ({ mostrarMensaje }) => {
  const [empresa, setEmpresa] = useState("");
  const [Opcion, setOpcion] = useState();
  const [SubOpcion, setSubOpcion] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]); // Contiene los resultados del procedimiento almacenado

  const rptoTAC = async (Opcion, SubOpcion) => {
    setOpcion(Opcion);
    setSubOpcion(SubOpcion);
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    // Conversion de fecha y agregar hora
    if (Opcion && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", Opcion);
      formData.append("SubOpcion", SubOpcion);
      if (Opcion == 22) {
        if (SubOpcion == 0) {
          formData.append("empresa", 9001);
        } else if (SubOpcion == 1) {
          formData.append("empresa", empresa);
        }
      } else {
        formData.append("empresa", 277);
      }

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoContabilidad/",
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
      mostrarMensaje("Error al generar el documento", "error_notification");
    }
  };

  // Manejo de campo date inicioFin
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [dateRangeText, setDateRangeText] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  if (Opcion == 19) {
    if (SubOpcion == 3) {
      columns = [
        { key: "EMPRESA", label: "EMPRESA", type: "text" },
        { key: "fechaGeneración", label: "FECHA GENERACION", type: "text" },
        { key: "importetotal", label: "IMPORTE TOTAL", type: "text" },
        { key: "EstadoDescripcion", label: "ESTADO DESCRIPCION", type: "text" },
        { key: "ticketIDExterno", label: "TICKET ID EXT", type: "text" },
        { key: "pasajeNumero", label: "N° PASAJE", type: "text" },
        { key: "importeOperacion", label: "IMPORTE OPERACION", type: "text" },
        { key: "opcionPago", label: "OPCION PAGO", type: "text" },
        { key: "medioPago", label: "MEDIO DE PAGO", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "AgenciaCajaID", label: "AGENCIA ID", type: "text" },
        { key: "agencia", label: "AGENCIA", type: "text" },
        { key: "taquillero", label: "TAQUILLERO", type: "text" },
        { key: "Canal", label: "CANAL", type: "text" },
      ];
    } else if (SubOpcion == 2) {
      columns = [
        { key: "EMPRESA", label: "EMPRESA", type: "text" },
        { key: "fechaGeneracion", label: "FECHA GENERACION", type: "text" },
        { key: "importeTotal", label: "IMPORTE TOTAL", type: "text" },
        { key: "EstadoDescripcion", label: "ESTADO DESCRIPCION", type: "text" },
        { key: "ticketIDExterno", label: "TICKET ID EXT", type: "text" },
        { key: "pasajenumero", label: "N° PASAJE", type: "text" },
        { key: "importeoperacion", label: "IMPORTE OPERACION", type: "text" },
        { key: "opcionPago", label: "OPCION PAGO", type: "text" },
        { key: "medioPago", label: "MEDIO DE PAGO", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "AgenciaCajaID", label: "AGENCIA ID", type: "text" },
        { key: "Agencia", label: "AGENCIA", type: "text" },
        { key: "Taquillero", label: "TAQUILLERO", type: "text" },
      ];
    } else if (SubOpcion == 0) {
      columns = [
        { key: "EMPRESA", label: "EMPRESA", type: "text" },
        { key: "fechaGeneracion", label: "FECHA GENERACION", type: "text" },
        { key: "importetotal", label: "IMPORTE TOTAL", type: "text" },
        { key: "Estadodescripcion", label: "ESTADO DESCRIPCION", type: "text" },
        { key: "ticketIDExterno", label: "TICKET ID EXT", type: "text" },
        { key: "pasajenumero", label: "N° PASAJE", type: "text" },
        { key: "importeoperacion", label: "IMPORTE OPERACION", type: "text" },
        { key: "opcionPago", label: "OPCION PAGO", type: "text" },
        { key: "medioPago", label: "MEDIO DE PAGO", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "AgenciaCajaID", label: "AGENCIA ID", type: "text" },
        { key: "agencia", label: "AGENCIA", type: "text" },
        { key: "taquillero", label: "TAQUILLERO", type: "text" },
      ];
    }
  } else if (Opcion == 22) {
    if (SubOpcion == 0) {
      columns = [
        { key: "NEC", label: "NEC", type: "text" },
        { key: "FechaCompra", label: "FECHA COMPRA", type: "text" },
        { key: "AGENCIA", label: "AGENCIA", type: "text" },
        { key: "TAQUILLERO", label: "TAQUILLERO", type: "text" },
        { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
        { key: "Valor", label: "VALOR", type: "text" },
        { key: "TPoCanal", label: "TPO CANAL", type: "text" },
        { key: "MedioPago", label: "MEDIO PAGO", type: "text" },
        { key: "Convenio", label: "CONVENIO", type: "text" },
        { key: "ORIGEN", label: "ORIGEN", type: "text" },
        { key: "DESTINO", label: "DESTINO", type: "text" },
        { key: "LINEA", label: "LINEA", type: "text" },
        { key: "ORIGENR", label: "ORIGENR", type: "text" },
        { key: "DESTINOR", label: "DESTINOR", type: "text" },
        { key: "VIAJE", label: "VIAJE", type: "number" },
        { key: "FECHAPARTIDA", label: "FECHA PARTIDA", type: "text" },
        { key: "BUS", label: "BUS", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
        { key: "APELLIDO", label: "APELLIDO", type: "text" },
        { key: "NOMBRES", label: "NOMBRES", type: "text" },
        { key: "EMAIL", label: "EMAIL", type: "text" },
        { key: "TELEFONOS", label: "TELEFONOS", type: "number" },
      ];
    } else if (SubOpcion == 1) {
      columns = [
        { key: "NEC", label: "NEC", type: "text" },
        { key: "FechaCompra", label: "FECHA COMPRA", type: "text" },
        { key: "AGENCIA", label: "AGENCIA", type: "text" },
        { key: "TAQUILLERO", label: "TAQUILLERO", type: "text" },
        { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
        { key: "Valor", label: "VALOR", type: "text" },
        { key: "TPoCanal", label: "TPO CANAL", type: "text" },
        { key: "MedioPago", label: "MEDIO PAGO", type: "text" },
        { key: "Convenio", label: "CONVENIO", type: "text" },
        { key: "ORIGEN", label: "ORIGEN", type: "text" },
        { key: "DESTINO", label: "DESTINO", type: "text" },
        { key: "LINEA", label: "LINEA", type: "text" },
        { key: "ORIGENR", label: "ORIGENR", type: "text" },
        { key: "DESTINOR", label: "DESTINOR", type: "text" },
        { key: "VIAJE", label: "VIAJE", type: "number" },
        { key: "FECHAPARTIDA", label: "FECHA PARTIDA", type: "text" },
        { key: "BUS", label: "BUS", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
        { key: "APELLIDO", label: "APELLIDO", type: "text" },
        { key: "NOMBRES", label: "NOMBRES", type: "text" },
        { key: "EMAIL", label: "EMAIL", type: "text" },
        { key: "TELEFONOS", label: "TELEFONOS", type: "number" },
      ];
    }
  }

  const itemsPerPage = 50;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informes de Tiquetes y Agencias</h1>
      <hr />
      <section className="contabilidad_section forms__box">
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
              Fecha
            </label>{" "}
          </div>
        </div>
        <div className="buttons_rptos">
          <div className="options__box">
            <button
              className="submit-button"
              onClick={() => rptoTAC(22, 0)}
              disabled={isLoading}
            >
              {isLoading ? "Generando..." : "Tiquetes Bello Sol SE"}
            </button>
          </div>
          <div className="options__box">
            <div className="bottom_bolivariano">
              <div className="input-container agg_colaborador">
                <select
                  className="opciones"
                  value={empresa}
                  onChange={(e) => {
                    setEmpresa(e.target.value);
                    setShowTable(false);
                  }}
                >
                  <option value="" disabled selected>
                    Seleccionar
                  </option>
                  <option value={277}>BERLINAS DEL FONCE S.A.</option>
                  <option value={278}>BERLITUR S.A.S.</option>
                  <option value={9001}>SERVICIO ESPECIAL</option>
                </select>
                <label className="input-label-options label">Empresa</label>
              </div>
            </div>
            <button
              className="submit-button botton_gp"
              onClick={() => rptoTAC(22, 1)}
              disabled={isLoading}
            >
              {isLoading ? "Generando..." : "Convenio Bolivariano"}
            </button>
          </div>
          <div className="options__box">
            <button
              className="submit-button botton_gp"
              // onClick={generarExcel}
              onClick={() => rptoTAC(19, 0)}
              disabled={isLoading}
            >
              {isLoading ? "Generando..." : "Venta Online Berlitur"}
            </button>
          </div>
          <div className="options__box">
            <button
              className="submit-button botton_gp"
              onClick={() => {
                rptoTAC(19, 2);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Generando..." : "Transacciones Tarjetas CR y DB"}
            </button>
          </div>
          <div className="options__box">
            <button
              className="submit-button botton_gp"
              onClick={() => {
                rptoTAC(19, 3);
              }}
              disabled={isLoading}
            >
              {isLoading
                ? "Generando..."
                : "Estadisticas de Link de Pago y Venta Online MP"}
            </button>
          </div>
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
