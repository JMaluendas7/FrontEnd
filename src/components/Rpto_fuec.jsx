import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import "/src/css/fuec/Rpto_fuec.css";
import HTMLtoPDF from "./crearPdf";
import DynamicTable from "./PruebaTabla";

import editar from "/src/img/editar_rpt.png";
import volver from "/src/img/volver.png";

const Fuec = () => {
  const [showTable, setShowTable] = useState(false);
  const [showFormMo, setshowFormMo] = useState(false);
  const [showData, setShowData] = useState(false);
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
        setTableData(response.data.results);
        setShowTable(true);
        // setshowFormMo(true);
      }
    } catch (error) {
      mostrarMensaje("No se ha", "error_notification");
    }
  };

  const enviarSubmitRpt = async (viaje) => {
    // Actualizar el estado con el nuevo valor de viaje
    setDatosViaje((prevDatosViaje) => ({
      ...prevDatosViaje,
      viaje: viaje,
    }));

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
        setDatosForm3(response.data.data);
        setShowTable(false);
        setShowFormI(false);
        // setShowData(true); //
        // setShowData(false);
        setShowDataPdf(true);
      }
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const enviarSubmitRpt2 = async () => {
    setShowData(false);
    setShowDataPdf(false);
    setShowDataPdf(true);
  };

  const volverAFormIni = () => {
    setShowDataPdf(false);
    setShowFormI(true);
  };

  const volverAFormEdi = () => {
    setShowDataPdf(false);
    setShowData(true);
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
      {showData && (
        <>
          <section className="form__row">
            <p>Vehiculo</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  name="usuario"
                  className="input-field"
                  value={datosForm3.Bus}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Bus", addvalue.target.value)
                  }
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Bus</label>
              </div>
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.Num_Tarjeta_Operacion}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Num_Tarjeta_Operacion",
                      addvalue.target.value
                    )
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nº Tarjeta Operacion</label>
              </div>
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.Placa}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Placa", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Placa</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Modelo}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Modelo", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Modelo</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Descripcion_Marca}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Descripcion_Marca",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Marca</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Descripcion_Clase}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Descripcion_Clase",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Clase</label>
              </div>
            </div>
          </section>
          <hr className="hr" />
          <section className="form__row">
            <p>Empresa</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.Empresa_Registrado}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Empresa_Registrado",
                      addvalue.target.value
                    )
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Empresa registrada</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Nit_Emp}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Nit_Emp", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nit empresa</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Origen}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Origen", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Origen</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.Destino}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Destino", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Destino</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Ciudad_Empresa}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Ciudad_Empresa",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Ciudad</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.tel_emp}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("tel_emp", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Telefono</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.tel_emp1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("tel_emp1", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Telefono 1</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.ema_emp}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("ema_emp", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">E-Mail</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.dir_Emp}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("dir_Emp", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Direccion</label>
              </div>
            </div>
          </section>
          <hr className="hr" />
          <section className="form__row">
            <p>Conductores</p>
            <p>Primer conductor</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Cedula_Conductor1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Cedula_Conductor1",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Documento conductor</label>
              </div>
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.Nombre_Conductor1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Nombre_Conductor1",
                      addvalue.target.value
                    )
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nombres</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Apellido_Conductor1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Apellido_Conductor1",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Apellidos</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Pase1_Conductor1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Pase1_Conductor1",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Pase</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.fechavencimiento1_Conductor1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "fechavencimiento1_Conductor1",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Fecha de vencimiento</label>
              </div>
            </div>
            <p>Segundo conductor</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Cedula_Conductor2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Cedula_Conductor2",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Documento conductor</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Nombre_Conductor2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Nombre_Conductor2",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nombres</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Apellido_Conductor2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Apellido_Conductor2",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Apellidos</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Pase1_Conductor2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Pase1_Conductor2",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Pase</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.fechavencimiento1_Conductor2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "fechavencimiento1_Conductor2",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Fecha de vencimiento</label>
              </div>
            </div>
          </section>
          <hr className="hr" />
          <section className="form__row">
            <p>Cliente</p>
            <p>Cliente</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.NIT_Cliente}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("NIT_Cliente", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nit cliente</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Nombre_Cliente}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Nombre_Cliente",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nombre cliente</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Direccion_Cliente}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Direccion_Cliente",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Direccion</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Ciudad_Cliente}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Ciudad_Cliente",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Ciudad</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Telefono_Cliente}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Telefono_Cliente",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Telefono</label>
              </div>
            </div>
            <p>Representante</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.Rep_cedula}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Rep_cedula", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Cedula</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Rep_Nombres}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("Rep_Nombres", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nombres</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Rep_Apellidos}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Rep_Apellidos",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Apellidos</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.direccionRep}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "direccionRep",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Direccion</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.direccionRep}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "direccionRep",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Ciudad</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.Rep_Telefono}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Rep_Telefono",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Telefono</label>
              </div>
            </div>
          </section>
          <hr className="hr" />
          <section className="form__row">
            <p>Fuec</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  value={datosForm3.Consecutivo_FUEC}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Consecutivo_FUEC",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Fuec</label>
              </div>
            </div>
            <div className="form__colum">
              <div className="input-container">
                <textarea
                  value={datosForm3.Objeto_Contrato}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "Objeto_Contrato",
                      addvalue.target.value
                    )
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Fuec</label>
              </div>
            </div>
            <button
              onClick={() => enviarSubmitRpt2()}
              className="submit-button"
              type="submit"
            >
              Enviar
            </button>
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
            <button
              onClick={() => volverAFormEdi()}
              className="submit-button volver"
              type="submit"
            >
              <img className="volver_img" src={editar}></img>
              Editar
            </button>
          </div>
          <section className="RptoFuec">
            <HTMLtoPDF datosForm3={datosForm3} />
          </section>
        </>
      )}
    </div>
  );
};

export default Fuec;
