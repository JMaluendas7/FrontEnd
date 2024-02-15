import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla2";
import useDateRange from "./AdminDateRange";
import ButtonGenerar from "./AdminButtonGenerar";
import generarExcelFunc from "./AdminGenerarXlsx";
import React, { useState, useEffect } from "react";
import SelectEmpresa from "./AdminSelectedEmpresas";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (empresa && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", 1);
      formData.append("SubOpcion", 2);
      formData.append("empresa", empresa);
      getDataFunc(
        "RP_Consultas05",
        formData,
        setIsLoading,
        setShowTable,
        setResults,
        mostrarMensaje
      );
    } else {
      mostrarMensaje(
        "Debe seleccionar todos los campos",
        "warning_notification"
      );
    }
  };
  useEffect(() => {
    const calcularPorcentajesYAgregar = () => {
      const nuevosResultados = results.map((fila) => ({
        ...fila,
        porcentajeCalculado: ((100 * fila.cont) / fila.BUTACAS).toFixed(2),
      }));

      if (!sonIguales(results, nuevosResultados)) {
        setResults(nuevosResultados);
      }
    };

    calcularPorcentajesYAgregar();
  }, [results]);
  const sonIguales = (array1, array2) =>
    JSON.stringify(array1) === JSON.stringify(array2);

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", 1);
    data.append("SubOpcion", 2);
    data.append("empresa", empresa);
    data.append("startDate", formattedStartDate);
    generarExcelFunc(
      "XlsxRP_Consultas05",
      data,
      "InformeXFechasPasajerosMovilizados",
      mostrarMensaje,
      setIsLoading
    );
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
      { key: "porcentajeCalculado", label: "% OCUPACION", type: "number" },
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
      { key: "porcentajeCalculado", label: "% OCUPACION", type: "number" },
      { key: "VALOR", label: "VALOR", type: "number" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">
        Informe Por Fechas De Pasajeros Movilizados
      </h1>
      <hr />
      <section className="contabilidad_section forms__box">
        <SelectEmpresa
          empresa={empresa}
          onChange={(e) => {
            setEmpresa(e.target.value);
            setShowTable(false);
          }}
          allowedCodes={[277, 278, 310, 9001, 320]}
        />
        {renderDatePicker()}
        <ButtonGenerar isLoading={isLoading} getData={getData} />
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={15}
              updatedData={updateTableData}
            />
          </div>
        </div>
      )}
      {ContainerButtonsLeft({ isLoading, showTable, generarExcel })}
    </div>
  );
};

export default Inicio;
