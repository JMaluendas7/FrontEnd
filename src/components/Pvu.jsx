import React, { useState, useRef } from "react";
import axios from "axios";
// import "/src/css/fuec/Rpto_fuec.css";
import HTMLtoPDF from "./crearPdf";
import DynamicTable from "./PruebaTabla2";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import volver from "/src/img/volver.png";

const Fuec = ({ mostrarMensaje, username }) => {
  const [dni, setdni] = useState();
  const [showTable, setShowTable] = useState(false);
  const [showFormMo, setshowFormMo] = useState(false);
  const [showPdf, setShowDataPdf] = useState(false);
  const [showFormI, setShowFormI] = useState(true);
  const [datosViaje, setDatosViaje] = useState({
    viaje: 0,
    searchV: "",
  });

  const enviarSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (dni) {
      try {
        formData.append("dni", dni);
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/Pvu/",
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

  const PvuInactivate = async (dni) => {
    // event.preventDefault();
    const formData = new FormData();
    if (dni) {
      try {
        formData.append("dni", dni);
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/PvuInactivate/",
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
          mostrarMensaje(
            "Usuario con DNI " + dni + "fue desactivado",
            "success_notification"
          );
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
    // { key: "Estado", label: "CHECK", type: "text" },
    { key: "Documento", label: "DOCUMENTO", type: "text" },
    { key: "Apellido", label: "APELLIDO", type: "text" },
    { key: "Nombres", label: "NOMBRES", type: "text" },
    { key: "Email", label: "EMAIL", type: "text" },
    { key: "Estado", label: "ESTADO", type: "text" },
    { key: "Usuario", label: "USUARIO", type: "text" },
    { key: "Password", label: "PASSWORD", type: "text" },
  ];

  const itemsPerPage = 30;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
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
      <h1 className="titulo_login title_fuec">PVU</h1>
      <hr />
      {showFormI && (
        <form className="forms__box" method="post">
          <div className="form__init">
            <div className="input-container">
              <input
                name="direccion"
                className="input-field-large icon_input_dni"
                placeholder=""
                type="text"
                value={dni}
                onChange={(e) => setdni(e.target.value)}
              />
              <label className="input-label">
                N° Documento o Nombre de Cliente
              </label>
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
          <div className="table_fuecOD">
            <DynamicTable
              data={tableData}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
              onCheckboxClick={PvuInactivate}
            />
          </div>
        </div>
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
