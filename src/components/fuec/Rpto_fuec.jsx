import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import "/src/css/fuec/Rpto_fuec.css";
import HTMLtoPDF from "./crearPdf";
import DynamicTable from "../administracion/PruebaTabla";

const Fuec = () => {
  const [showTable, setShowTable] = useState(false);
  const [showFormMo, setshowFormMo] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showFormI, setShowFormI] = useState(true);
  const [datosForm1, setDatosForm1] = useState({
    fecha: "",
    searchV: 933,
  });
  const [datosViaje, setDatosViaje] = useState({
    viaje: 621975,
    searchV: 933,
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
        "http://127.0.0.1:8000/callViajes/",
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
        setShowTable(true);
        setTableData(response.data.results);
      }
    } catch (error) {
      mostrarMensaje("No se ha", "error_notification");
    }
  };
  const enviarSubmitRpt = async (event) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/callRptoViaje/",
        datosViaje,
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
        setShowData(false);
        setShowData(true);
        setDatosForm3(response.data.results);
        // console.log(response.data.results.data);
        console.log(datosForm3);
        console.log(datosForm3.data);
        console.log(datosForm3.data.Viaje);
      }
    } catch (error) {
      console.log("error: " + error);
    }
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

  const arrColaboradores = { value: "dfs", label: "sdf" };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte FUEC</h1>
      <hr />
      {showFormI && (
        <form method="post">
          <div className="form__init">
            <div className="">
              <div>
                <Select
                  value={datosForm1.searchV}
                  onChange={(addvalue) =>
                    handleInputChangeForm1("searchV", addvalue.target.value)
                  }
                  options={arrColaboradores}
                  isSearchable
                  name="id_user"
                  className="select"
                  placeholder="Numero de Bus"
                />
              </div>
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
          <hr className="hr" />
          <section className="form__row">
            <p>Vehiculo</p>
            <div className="form__colum">
              <div className="input-container">
                <input
                  name="usuario"
                  className="input-field"
                  value={datosForm3.bus}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("bus", addvalue.target.value)
                  }
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Bus</label>
              </div>
              <div className="input-container">
                <input
                  name="usuario"
                  value={datosForm3.nTargetaOperacion}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "nTargetaOperacion",
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
                  value={datosForm3.placa}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("placa", addvalue.target.value)
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
                  value={datosForm3.modelo}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("modelo", addvalue.target.value)
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
                  value={datosForm3.marca}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("marca", addvalue.target.value)
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
                  value={datosForm3.clase}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("clase", addvalue.target.value)
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
                  value={datosForm3.empresa}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("empresa", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Empresa registrada</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.nitEmpresa}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("nitEmpresa", addvalue.target.value)
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
                  value={datosForm3.origen}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("origen", addvalue.target.value)
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
                  value={datosForm3.destino}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("destino", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Destino</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.ciudad}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("ciudad", addvalue.target.value)
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
                  value={datosForm3.telefono}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("telefono", addvalue.target.value)
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
                  value={datosForm3.telefono1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("telefono1", addvalue.target.value)
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
                  value={datosForm3.email}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("email", addvalue.target.value)
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
                  value={datosForm3.direccion}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("direccion", addvalue.target.value)
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
                  value={datosForm3.docConductor1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "docConductor1",
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
                  value={datosForm3.nombreCond}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("nombreCond", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Nombres</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.apellidoCond}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "apellidoCond",
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
                  value={datosForm3.pase1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("pase1", addvalue.target.value)
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
                  value={datosForm3.fecVencimiento1}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "fecVencimiento1",
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
                  value={datosForm3.docConductor2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "docConductor2",
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
                  value={datosForm3.nombreCond2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("nombreCond2", addvalue.target.value)
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
                  value={datosForm3.apellidoCond2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "apellidoCond2",
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
                  value={datosForm3.pase2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("pase2", addvalue.target.value)
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
                  value={datosForm3.fecVencimiento2}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "fecVencimiento2",
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
                  value={datosForm3.nitCliente}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("nitCliente", addvalue.target.value)
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
                  value={datosForm3.nombreCli}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("nombreCli", addvalue.target.value)
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
                  value={datosForm3.direccionCli}
                  onChange={(addvalue) =>
                    handleInputChangeForm3(
                      "nodireccionClimbreCli",
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
                  value={datosForm3.ciudadCli}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("ciudadCli", addvalue.target.value)
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
                  value={datosForm3.telefonoCli}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("telefonoCli", addvalue.target.value)
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
                  value={datosForm3.ccRep}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("ccRep", addvalue.target.value)
                  }
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Cedula</label>
              </div>
              <div className="input-container">
                <input
                  value={datosForm3.nombreRep}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("nombreRep", addvalue.target.value)
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
                  value={datosForm3.apellidoRep}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("apellidoRep", addvalue.target.value)
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
                  value={datosForm3.telefono}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("telefono", addvalue.target.value)
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
                  value={datosForm3.fuec}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("fuec", addvalue.target.value)
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
                  value={datosForm3.objeto}
                  onChange={(addvalue) =>
                    handleInputChangeForm3("objeto", addvalue.target.value)
                  }
                  name="usuario"
                  className="input-field"
                  placeholder=""
                  type="text"
                />
                <label className="input-label">Fuec</label>
              </div>
            </div>
            <button className="submit-button" type="submit">
              Enviar
            </button>
          </section>
          <section className="RptoFuec">
            <HTMLtoPDF datosForm3={datosForm3} />
          </section>
        </>
      )}
    </div>
  );
};

export default Fuec;
