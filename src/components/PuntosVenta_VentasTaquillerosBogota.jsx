import useDateMY from "./AdminMY";
import es from "date-fns/locale/es";
import InputDni from "./AdminInputDni";
import getDataFunc from "./AdminGetData";
import DatePicker from "react-datepicker";
import DynamicTable from "./PruebaTabla2";
import ButtonGenerar from "./AdminButtonGenerar";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const [showTable, setShowTable] = useState(false);
  const { month, year, renderDateMY } = useDateMY({ setShowTable });
  const [tipoInforme, setTipoInforme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [DateF, setDateF] = useState("");
  const [dni, setdni] = useState("");

  const getData = async () => {
    const formData = new FormData();
    if (month && year && tipoInforme) {
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
        } catch {}
      }
      getDataFunc(
        "RPT_EstadisticaXTaquilla",
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

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Month", month);
    data.append("Year", year);
    data.append("empresa", 277);
    generarExcelFunc(
      "XlsxRPT_EstadisticaXTaquilla",
      data,
      "InformeVentasTaquillerosBogota",
      mostrarMensaje,
      setIsLoading
    );
  };

  // Handle of table dynamic
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
    { key: "Fecha Apertura", label: "FECHA APERTURA", type: "text" },
    { key: "Fecha Cierre", label: "FECHA CIERRE", type: "text" },
    { key: "Total_Ingresos", label: "INGRESOS", type: "text" },
  ];
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  // Manejo de campo date inicioFin
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateF(date);
  };

  useEffect(() => {
    mostrarMensaje(
      "De los opcionales puedes usar uno o ninguno",
      "warning_notification"
    );
  }, []);

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informe Ventas Taquilleros Bogota</h1>
      <hr />
      <section className="colum_table forms__box">
        <section className="row_section">
          <div className="input-container agg_colaborador">
            {renderDateMY()}
          </div>
          <SelectOptions
            value={tipoInforme}
            onChange={(e) => {
              setTipoInforme(e.target.value);
              setShowTable(false);
            }}
            options={[
              { value: "25S", label: "Terminal Salitre" },
              { value: "192S", label: "Terminal del Norte" },
            ]}
            label="Lugar"
          />
          <div className="form__init">
            <InputDni
              dni={dni}
              onChange={(e) => {
                setdni(e.target.value);
                setDateF(null);
                setSelectedDate(null);
                setShowTable(false);
              }}
              label="Numero De Documento(Opcional)"
            />
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
        <ButtonGenerar isLoading={isLoading} getData={getData} />
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={20}
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
