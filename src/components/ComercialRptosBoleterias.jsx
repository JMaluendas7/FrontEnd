import React, { useState } from "react";
import axios from "axios";
import DynamicTable from "./PruebaTabla2";
import descargarArchivo from "./AdminDownloadXlsx";
import useDateRange from "./AdminDateRange";

const Inicio = ({ mostrarMensaje }) => {
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [empresa, setEmpresa] = useState("");
  const { startDate, endDate, renderDatePicker } = useDateRange();

  const getData = async () => {
    setIsLoading(true);
    setShowTable(false);
    const formData = new FormData();
    if (tipoInforme && empresa && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", tipoInforme);
      formData.append("empresa", empresa);
      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/RptoComercialEst/",
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
            setexcelGenerate(false);
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
              Opcion: tipoInforme,
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
      let fileName = "";
      if (tipoInforme == 0) {
        fileName = `Estadisticas_DetalladoDeViajesPorConductor`;
      } else if (tipoInforme == 1) {
        fileName = `Estadisticas_EstadisticasDeOperaciones`;
      } else if (tipoInforme == 2) {
        fileName = `Estadisticas_TiquetesMovilesDetallados`;
      } else if (tipoInforme == 3) {
        fileName = `Estadisticas_TiquetesMovilesDelDia`;
      } else if (tipoInforme == 4) {
        fileName = `Estadisticas_Cafam`;
      } else if (tipoInforme == 5) {
        fileName = `Estadisticas_FuerzaPublica`;
      } else if (tipoInforme == 6) {
        fileName = `Estadisticas_Planillados-PasajerosPorRutas`;
      } else if (tipoInforme == 7) {
        fileName = `Estadisticas_Planillados-PasajerosPorTrayectos`;
      } else if (tipoInforme == 8) {
        fileName = "Estadisticas_Planillados-PasajerosOrigen-Destino";
      } else if (tipoInforme == 9) {
        fileName = `Estadisticas_TiquetesPromedioXBoleteria`;
      } else if (tipoInforme == 10) {
        fileName = `Estadisticas_ConsolidadoXBoleteriaPromedio`;
      } else if (tipoInforme == 18) {
        fileName = `Estadisticas_PasajerosQueViajaron`;
      } else if (tipoInforme == 19) {
        fileName = `Estadisticas_TarjetaJoven`;
      } else if (tipoInforme == 22) {
        fileName = `Estadisticas_PasajerosColsubsidio`;
      }
      descargarArchivo({
        fileName: fileName,
        blob: response.data,
      });
      setexcelGenerate(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  const [excelGenerate, setexcelGenerate] = useState(false);
  let columns = [];

  if (
    (tipoInforme == 0 ||
      tipoInforme == 1 ||
      tipoInforme == 4 ||
      tipoInforme == 5 ||
      tipoInforme == 19 ||
      tipoInforme == 18) &&
    results.length > 0 &&
    !excelGenerate
  ) {
    (async () => {
      await generarExcel(true);
      await setShowTable(false);
      await setexcelGenerate(true);
    })();
  } else if (tipoInforme == 6) {
    columns = [
      { key: "Mes", label: "MES", type: "number" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "nviajes", label: "N° VIAJES", type: "number" },
      { key: "butacas", label: "BUTACAS", type: "number" },
      { key: "tiquetes", label: "TIQUETES", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  } else if (tipoInforme == 7) {
    columns = [
      { key: "Mes", label: "MES", type: "number" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "tiquetes", label: "TIQUETES", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  } else if (tipoInforme == 8) {
    columns = [
      { key: "Mes", label: "MES", type: "number" },
      { key: "nombre", label: "NOMBRE", type: "text" },
      { key: "tiquetes", label: "TIQUETES", type: "number" },
      { key: "valor", label: "VALOR", type: "number" },
      { key: "lorigen", label: "L ORIGEN", type: "text" },
      { key: "ldestino", label: "L DESTINO", type: "text" },
      { key: "TIQOD", label: "TIQOD", type: "number" },
      { key: "ValorOD", label: "VALOR OD", type: "number" },
      { key: "PORCO", label: "PORCO", type: "number" },
      { key: "PORCV", label: "PORCV", type: "number" },
    ];
  } else if (tipoInforme == 22) {
    columns = [
      { key: "id", label: "ID", type: "number" },
      { key: "Pasajenumero", label: "N° PASAJE", type: "text" },
      { key: "fechaoperacion", label: "FECHA OPERACION", type: "text" },
      { key: "importefinal", label: "IMPORTE FINAL", type: "number" },
      { key: "boleteria", label: "BOLETERIA", type: "text" },
      { key: "mediopago", label: "MEDIO DE PAGO", type: "number" },
      { key: "documento", label: "DOCUMENTO", type: "number" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "nombres", label: "NOMBRES", type: "text" },
      { key: "origen", label: "ORIGEN", type: "text" },
      { key: "TERMINALORIGEN", label: "TERMINAL ORIGEN", type: "number" },
      { key: "TORIGEN", label: "T ORIGEN", type: "text" },
      { key: "destino", label: "DESTINO", type: "text" },
      { key: "TERMINALDESTINO", label: "TERMINAL DESTINO", type: "number" },
      { key: "TDESTINO", label: "TDESTINO", type: "text" },
      { key: "viaje", label: "VIAJE", type: "number" },
    ];
  }

  const itemsPerPage = 20;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Estadisticas por Boleteria</h1>
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
              {/* <option value={0}>Detallado de Viajes por Conductor</option> */}
              <option value={1}>Estadisticas de Operaciones</option>
              {/* <option value={2}>Tiquetes Moviles Detallados</option> */}
              {/* <option value={3}>Tiquetes Moviles del Dia</option> */}
              <option value={4}>Estadisticas Cafam</option>
              <option value={5}>Estadisticas Fuerza Publica</option>
              <option value={6}>Planillados - Pasajeros por Rutas</option>
              <option value={7}>Planillados - Pasajeros por Trayectos</option>
              <option value={8}>Planillados - Pasajeros Origen-Destino</option>
              {/* <option value={9}>Tiquetes Promedio por Boleteria</option> */}
              {/* <option value={10}>Consolidado por Boleteria Promedio</option> */}
              <option value={18}>Pasajeros que Viajaron</option>
              <option value={19}>Estadistica Tarjeta Joven</option>
              <option value={22}>Pasajeros Colsubsidio</option>
            </select>
            <label className="input-label-options label">Tipo Informe</label>
          </div>
          <div className="input-container agg_colaborador">
            <select
              className="opciones"
              value={empresa}
              onChange={(e) => {
                setEmpresa(e.target.value);
                setShowTable(false);
              }}
            >
              <option value="" disabled>
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
          <div className="content__dateDH">{renderDatePicker()}</div>
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
