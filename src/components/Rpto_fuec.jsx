import React, { useState, useRef } from "react";
import axios from "axios";
// import "/src/css/fuec/Rpto_fuec.css";
import HTMLtoPDF from "./crearPdf";
import DynamicTable from "./PruebaTabla";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import volver from "/src/img/volver.png";

const Fuec = ({ mostrarMensaje, username }) => {
  const [bus, setbus] = useState();
  const [showTable, setShowTable] = useState(false);
  const [showFormMo, setshowFormMo] = useState(false);
  const [showPdf, setShowDataPdf] = useState(false);
  const [showFormI, setShowFormI] = useState(true);

  const [datosViaje, setDatosViaje] = useState({
    viaje: 0,
    searchV: "",
  });
  const [datosForm2, setDatosForm2] = useState({
    viaje: "620291",
    motivo: "04/12/2023 12:15:00 p. m.",
    empresa: "",
  });
  const [datosForm3, setDatosForm3] = useState([]);

  const handleInputChangeForm2 = (fieldName, value) => {
    setDatosForm2({
      ...datosForm2,
      [fieldName]: value,
    });
  };
  const handleInputChangeForm3 = (fieldName, value) => {
    setDatosForm3({
      ...datosForm3,
      [fieldName]: value,
    });
  };

  const enviarSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (bus) {
      try {
        formData.append("bus", bus);
        formData.append("fecha", Date);
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/callViajes/",
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
          const responseData = response.data;
          if (
            responseData &&
            responseData.results &&
            Array.isArray(responseData.results)
          ) {
            const results = responseData.results;
            if (results.length > 0) {
              setTableData(results);
              setShowTable(true);
              // setshowFormMo(true);
            } else {
              mostrarMensaje("No hay viajes", "warning_notification");
              setShowTable(false);
            }
          } else {
            mostrarMensaje("Respuesta inválida", "error_notification");
          }
        }
      } catch (error) {
        mostrarMensaje(
          "Reporta la falla al DTI, por favor.",
          "warning_notification"
        );
      }
    } else {
      mostrarMensaje("Debes dar el numero de bus", "warning_notification");
    }
  };

  const [fechaSalida, setFechaSalida] = useState("");
  const enviarSubmitRpt = async (viaje, fecha) => {
    // Actualizar el estado con el nuevo valor de viaje
    setDatosViaje((prevDatosViaje) => ({
      ...prevDatosViaje,
      viaje: viaje,
    }));
    setFechaSalida(fecha);

    // Usar el valor actualizado directamente en la llamada axios
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/callRptoViaje/",
        {
          viaje: viaje,
          searchV: datosViaje.searchV,
        },
        {
          responseType: "json",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (response.data.data == null) {
          mostrarMensaje(
            "Datos de viaje no encontrados",
            "warning_notification"
          );
        } else {
          setDatosForm3(response.data.data);
          setShowTable(false);
          setShowFormI(false);
          setShowDataPdf(true);
        }
      }
    } catch (error) {
      console.log("error: " + error);
    }
  };

  const enviarSubmitRpt2 = async () => {
    setShowDataPdf(false);
    setShowDataPdf(true);
  };

  const volverAFormIni = () => {
    setShowDataPdf(false);
    setShowFormI(true);
  };

  const [tableData, setTableData] = useState([]);

  const columns = [
    { key: "viaje", label: "Viaje", type: "text" },
    { key: "fecha", label: "Fecha Partida", type: "text" },
    { key: "origen", label: "Origen", type: "text" },
    { key: "destino", label: "Destino", type: "text" },
  ];

  const itemsPerPage = 10;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  // Manejo de campo date inicioFin
  const [Date, setDate] = useState("");
  const [dateRangeText, setDateRangeText] = useState("");
  const [show, setShow] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    setDate(date);

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

  const HTMLtoPDFRef = useRef(null);

  // Función para llamar la funcion de HTMLtoPDF
  const callhandlePrintPDF = () => {
    if (HTMLtoPDFRef.current) {
      HTMLtoPDFRef.current.handlePrintPDF();
    } else {
      console.error("Ref del hijo no definida");
    }
  };
  const callhandleDownloadPDF = () => {
    if (HTMLtoPDFRef.current) {
      HTMLtoPDFRef.current.handleDownloadPDF();
    } else {
      console.error("Ref del hijo no definida");
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="Efect">
      {showPdf && (
        <div className="buttons__VE">
          <button
            onClick={() => volverAFormIni()}
            className="submit-button volver"
            type="submit"
          >
            <img className="volver_img" src={volver}></img>
            Volver
          </button>
        </div>
      )}
      <h1 className="titulo_login title_fuec">Reporte FUEC</h1>
      <hr />
      {showFormI && (
        <form className="forms__box" method="post">
          <div className="form__init">
            <div className="input-container">
              <input
                className="input-field icon_input_bus"
                placeholder=""
                type="text"
                value={bus}
                onChange={(e) => setbus(e.target.value)}
              />
              <label className="input-label">N° de Bus</label>
            </div>
            <div className="content__dateDH">
              <div className="input-container">
                <DatePicker
                  className="input-field-datepicker datepicker icon_calendar"
                  selected={Date}
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
            <button
              className="submit-button"
              type="submit"
              onClick={enviarSubmit}
            >
              Buscar
            </button>
          </div>
        </form>
      )}
      {showTable && (
        <div className="results__box">
          <div className="table_60p">
            <DynamicTable
              data={tableData}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
              enviarSubmitRpt={enviarSubmitRpt}
            />
          </div>
        </div>
      )}
      {showFormMo && (
        <>
          <button
            onClick={() => enviarSubmitRpt2()}
            className="submit-button volver"
            type="submit"
          >
            Volver
          </button>
          <section className="form__init">
            <div className="input-container">
              <input
                name="usuario"
                className="input-field"
                placeholder=""
                value={datosForm2.viaje}
                onChange={(addvalue) =>
                  handleInputChangeForm2("viaje", addvalue.target.value)
                }
                type="text"
              />
              <label className="input-label">Viaje</label>
            </div>
            <div className="input-container">
              <input
                name="usuario"
                className="input-field"
                placeholder=""
                value={datosForm2.motivo}
                onChange={(addvalue) =>
                  handleInputChangeForm2("motivo", addvalue)
                }
                type="text"
              />
              <label className="input-label">Motivo</label>
            </div>
            <div className="input-container">
              <input
                name="usuario"
                className="input-field"
                placeholder=""
                value={datosForm2.empresa}
                onChange={(addvalue) =>
                  handleInputChangeForm2("empresa", addvalue.target.value)
                }
                type="text"
              />
              <label className="input-label">Empresa</label>
            </div>
          </section>
        </>
      )}
      {showPdf && (
        <>
          <section className="RptoFuec forms__box box__sheet">
            <HTMLtoPDF
              datosForm3={datosForm3}
              mostrarMensaje={mostrarMensaje}
              fechaSalida={fechaSalida}
              username={username}
              ref={HTMLtoPDFRef}
            />
          </section>
          {/* Botón para iniciar la conversión y descarga del pdf */}
          <div className="buttons_left">
            <div
              className="container__buttons_left"
              onClick={callhandleDownloadPDF}
            >
              <div className="descargar-pdf">
                <div className="buttons_left-label">Descargar PDF</div>
              </div>
            </div>
            <div
              className="container__buttons_left"
              onClick={callhandlePrintPDF}
            >
              <div className="imprimir">
                <div className="buttons_left-label">Imprimir PDF</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Fuec;
