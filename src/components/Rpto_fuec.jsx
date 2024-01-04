import React, { useState } from "react";
import axios from "axios";
import "/src/css/fuec/Rpto_fuec.css";
import HTMLtoPDF from "./crearPdf";
import DynamicTable from "./PruebaTabla";

import volver from "/src/img/volver.png";

const Fuec = ({ mostrarMensaje, username }) => {
  const [showTable, setShowTable] = useState(false);
  const [showFormMo, setshowFormMo] = useState(false);
  const [showPdf, setShowDataPdf] = useState(false);
  const [showFormI, setShowFormI] = useState(true);
  const [datosForm1, setDatosForm1] = useState({
    fecha: "",
    searchV: "",
  });
  const [datosViaje, setDatosViaje] = useState({
    viaje: 0,
    searchV: "",
  });
  const [datosTable, setDatosTable] = useState([]);
  const [datosForm2, setDatosForm2] = useState({
    viaje: "620291",
    motivo: "04/12/2023 12:15:00 p. m.",
    empresa: "",
  });
  const [datosForm3, setDatosForm3] = useState([]);

  const handleInputChangeForm1 = (fieldName, value) => {
    setDatosForm1({
      ...datosForm1,
      [fieldName]: value,
    });
  };
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

  // useState para contener el valor de busqueda
  const [searchValue, setSearchValue] = useState("");

  // Funcion para actualizar el useState de busqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const enviarSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/callViajes/",
        datosForm1,
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
      mostrarMensaje("No se han encontrado viajes", "error_notification");
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
          // mostrarMensaje(
          //   "Ahora puedes editar cada uno de los campos en este mismo documento",
          //   "warning_notification"
          // );
          // mostrarMensaje(
          //   "Solo debes hacer click sobre el campo que deseas editar del documento",
          //   "success_notification"
          // );
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

  return (
    <div className="Efect">
      <h1 className="titulo_login title_fuec">Reporte FUEC</h1>
      <hr />
      {showFormI && (
        <form method="post">
          <div className="form__init">
            <div className="input-container">
              <input
                name="direccion"
                className="input-field"
                placeholder=""
                type="text"
                value={datosForm1.searchV}
                onChange={(addvalue) =>
                  handleInputChangeForm1("searchV", addvalue.target.value)
                }
              />
              <label className="input-label">Nr de bus</label>
            </div>
            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                className="input-field"
                value={datosForm1.fecha}
                onChange={(addvalue) =>
                  handleInputChangeForm1("fecha", addvalue.target.value)
                }
              />
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
        <div className="tablaFuecOD">
          <div className="table_60p">
            <DynamicTable
              data={tableData}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
              enviarSubmitRpt={enviarSubmitRpt}
            />
          </div>
          <hr className="hr" />
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
          <section className="RptoFuec">
            <HTMLtoPDF
              datosForm3={datosForm3}
              mostrarMensaje={mostrarMensaje}
              fechaSalida={fechaSalida}
              username={username}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default Fuec;
