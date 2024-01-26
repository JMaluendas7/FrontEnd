import React, { useState } from "react";
import axios from "axios";
import DynamicTable from "./PruebaTabla2";
import descargarArchivo from "./AdminDownloadXlsx";
import useDateRange from "./AdminDateRange";

const Inicio = ({ mostrarMensaje }) => {
  const { startDate, endDate, renderDatePicker } = useDateRange();
  const [codigo, setCodigo] = useState("");
  const [tipoInforme, setTipoInforme] = useState("");
  const [concepto, setConcepto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [results, setResults] = useState([]);
  const rptoCuotaAdmin = async () => {
    setIsLoading(true);
    const formData = new FormData();

    if (tipoInforme && empresa && concepto && startDate && endDate) {
      const formattedStartDate =
        startDate.toISOString().split("T")[0] + "T00:00:00.00Z";
      const formattedEndDate =
        endDate.toISOString().split("T")[0] + "T23:59:59.00Z";

      // Agregar las fechas al formData
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);

      // Obtiene los valores de los campos
      formData.append("codigo", codigo);
      formData.append("tipoInforme", tipoInforme);
      formData.append("concepto", concepto);
      formData.append("empresa", empresa);

      try {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/rptoCuotaAdmin/",
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
        "http://wsdx.berlinasdelfonce.com:9000/generarRptoAdmin/",
        { results: results, tipoInforme: tipoInforme },
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
      if (tipoInforme == 1) {
        fileName = `5apps_ReporteAgenciaDeViajes`;
      } else if (tipoInforme == 2) {
        fileName = `5apps_ReporteCiudades`;
      } else if (tipoInforme == 3) {
        fileName = `5apps_ReportePropietarios`;
      } else if (tipoInforme == 4) {
        fileName = `5apps_ReporteCiudadesColibertador`;
      } else if (tipoInforme == 5) {
        fileName = `5apps_ReporteAgenciasBerlitur`;
      }
      descargarArchivo({ fileName: fileName, blob: response.data });
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (tipoInforme == 2) {
    columns = [
      { key: "year", label: "AÑO", type: "text" },
      { key: "mes", label: "MES", type: "number" },
      { key: "ciudad", label: "CIUDAD", type: "text" },
      { key: "Base", label: "BASE", type: "number" },
      { key: "CuotaAdmon", label: "CUOTA ADMON", type: "number" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "Detalle", label: "DETALLE", type: "text" },
      { key: "Identifica", label: "IDENTIFICACION", type: "text" },
      { key: "NombreTercero", label: "NOMBRE DEL TERCERO", type: "text" },
      { key: "base", label: "BASE", type: "number" },
      { key: "VrEgresos", label: "CUOTA ADMON", type: "number" },
    ];
  } else if (tipoInforme == 4) {
    columns = [
      { key: "Concepto", label: "CONCEPTO", type: "text" },
      { key: "CptoDet", label: "DETALLE", type: "text" },
      { key: "Ciudadorigen", label: "CIUDAD ID", type: "text" },
      { key: "Loc_Nombreloc", label: "CIUDAD", type: "text" },
      { key: "ValorBase", label: "BASE", type: "number" },
      { key: "Admon", label: "CUOTA ADMON", type: "number" },
    ];
  } else if (tipoInforme == 5) {
    columns = [
      { key: "pla_agenciavendio", label: "COD. AGENCIA", type: "text" },
      { key: "age_nomagencia", label: "NOMBRE AGENCIA", type: "text" },
      { key: "valor", label: "BASE", type: "number" },
      { key: "Tvalor", label: "CUOTA ADMON", type: "number" },
    ];
  }

  const itemsPerPage = 15;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte cuota de administración</h1>
      <hr />
      <section className="contabilidad__table forms__box">
        <div className="contabilidad_fr">
          <section className="contabilidad_section">
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
                <option disabled value={1}>
                  Agencias De Viajes
                </option>
                <option value={2}>Ciudades</option>
                <option value={3}>Propietarios</option>
                <option value={4}>Ciudades - Colibertador</option>
                <option value={5}>Agencias - Berlitur</option>
              </select>
              <label className="input-label-options label">Tipo Informe</label>
            </div>
            <div className="input-container agg_colaborador">
              <select
                className="opciones"
                value={concepto}
                onChange={(e) => {
                  setConcepto(e.target.value);
                  setShowTable(false);
                }}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value={"080101"}>Cuota Admon</option>
                <option value={"080103"}>Cuota Admon Agencias</option>
              </select>
              <label className="input-label-options label">Concepto</label>
            </div>
          </section>
          <section className="contabilidad_section">
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
                <option value={9000}>DATA TEST TIC</option>
                <option value={9001}>SERVICIO ESPECIAL</option>
              </select>
              <label className="input-label-options label">Empresa</label>
            </div>
            <div className="content__dateDH">{renderDatePicker()}</div>
          </section>
        </div>
        <button
          className="submit-button botton_gp"
          onClick={rptoCuotaAdmin}
          disabled={isLoading}
        >
          {isLoading ? "Generando..." : "Generar reporte"}
        </button>
      </section>
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
