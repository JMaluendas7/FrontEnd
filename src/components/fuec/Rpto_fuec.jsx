import React, { useState, useEffect } from "react";
import Select from "react-select";
import "/src/css/fuec/Rpto_fuec.css";
import DynamicTable from "../administracion/PruebaTabla";

const Fuec = () => {
  const [showTable, setShowTable] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showFormI, setShowFormI] = useState(true);
  const [datosForm1, setDatosForm1] = useState({
    fecha: "",
    searchV: null,
  })
  const [datosForm2, setDatosForm2] = useState({
    campo1: "",
  })
  const [datosForm3, setDatosForm3] = useState({
    campo1: "",
  })

  const handleInputChangeForm1 = (fieldName, value) => {
    setDatosForm1({
      ...datosForm1,
      [fieldName]: value,
    });
  };

  const handleInputChangeForm2 = (event) => {
    const {name, value} = event.target;
    setDatosForm2({...datosForm2, [name]: value})
  }
  const handleInputChangeForm3 = (event) => {
    const {name, value} = event.target;
    setDatosForm3({...datosForm3, [name]: value})
  }
  // useState para contener el valor de busqueda
  const [searchValue, setSearchValue] = useState("");

  // Funcion para actualizar el useState de busqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Manejo de valor para el Select
  const [seleccion, setSeleccion] = useState(null);

  const cambio = (seleccion) => {
    setSeleccion(seleccion);
  };

  // Notificacion de Registo *Se debe Mejorar*
  const [mensaje, setMensaje] = useState({
    visible: true,
  });
  const mostrarMensaje = (mensaje, color, imagen) => {
    setMensaje({
      visible: true,
    });
  };
  const enviarSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/addUsers/",
        formData
      );

      if (response.status === 200) {
        setShowTable(true);
        mostrarMensaje("Ha sido registrado el usuario", "success_notification");
      }
    } catch (error) {
      mostrarMensaje(
        "No se ha podido registrar el usuario",
        "error_notification"
      );
    }
  };

  const [tableData, setTableData] = useState([
    {
      viaje: "622050",
      fpartida: "04/12/2023 8:10:00 a. m.",
      origen: "BARRANQUILLA",
      destino: "SANTA MARTA",
    },
    {
      viaje: "620291",
      fpartida: "04/12/2023 12:15:00 p. m.",
      origen: "SANTA MARTA",
      destino: "CARTAGENA",
    },
    {
      viaje: "605214",
      fpartida: "04/12/2023 7:20:00 p. m.",
      origen: "CARTAGENA",
      destino: "BARRANQUILLA",
    },
  ]);

  const columns = [
    { key: "viaje", label: "Viaje", type: "text" },
    { key: "fpartida", label: "Fecha Partida", type: "text" },
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
      <form method="post" onSubmit={enviarSubmit}>
        <div className="form__init">
          <div className="">
            <div>
              <Select
                value={datosForm1.searchV}
                onChange={(selected) => handleInputChangeForm1("searchV", selected)}
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
            <input type="date" className="input-field" value={datosForm1.fecha} onChange={(selected) => handleInputChangeForm1("fecha", selected)}></input>
          </div>
          <button className="submit-button" type="submit">
            Buscar
          </button>
        </div>
      </form>
      )}
      {showTable && (
        <>
          <div className="table_60p">
            <DynamicTable
              data={tableData}
              columns={columns}
              itemsPerPage={itemsPerPage}
              updatedData={updateTableData}
            />
          </div>
          <hr className="hr" />
        </>
      )}
      {showData && (
      <>
      <section className="form__init">
        <div className="input-container">
          <input
            name="usuario"
            className="input-field"
            placeholder=""
            type="text"
          />
          <label className="input-label">Viaje</label>
        </div>
        <div className="input-container">
          <input
            name="usuario"
            className="input-field"
            placeholder=""
            type="text"
          />
          <label className="input-label">Motivo</label>
        </div>
        <div className="input-container">
          <input
            name="usuario"
            className="input-field"
            placeholder=""
            type="text"
          />
          <label className="input-label">Empresa</label>
        </div>
        <button className="submit-button" type="submit">
          Enviar
        </button>
      </section>
      <hr className="hr" />
      <section className="form__row">
        <p>Vehiculo</p>
        <div className="form__colum">
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Bus</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nº Tarjeta Operacion</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
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
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Modelo</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Marca</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Clase</label>
          </div>
        </div>
        <button className="submit-button" type="submit">
          Enviar
        </button>
      </section>
      <hr className="hr" />
      <section className="form__row">
        <p>Empresa</p>
        <div className="form__colum">
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Empresa registrada</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nit empresa</label>
          </div>
          <div className="input-container">
            <input
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
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Destino</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Ciudad</label>
          </div>
          <div className="input-container">
            <input
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
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Telefono 1</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">E-Mail</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Direccion</label>
          </div>
        </div>
        <button className="submit-button" type="submit">
          Enviar
        </button>
      </section>
      <hr className="hr" />
      <section className="form__row">
        <p>Conductores</p>
        <p>Primer conductor</p>
        <div className="form__colum">
          <div className="input-container">
            <input
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
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nombres</label>
          </div>
          <div className="input-container">
            <input
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
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Pase</label>
          </div>
          <div className="input-container">
            <input
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
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nombres</label>
          </div>
          <div className="input-container">
            <input
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
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Pase</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Fecha de vencimiento</label>
          </div>
        </div>
        <button className="submit-button" type="submit">
          Enviar
        </button>
      </section>
      <hr className="hr" />
      <section className="form__row">
        <p>Cliente</p>
        <p>Cliente</p>
        <div className="form__colum">
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nit cliente</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nombre cliente</label>
          </div>
          <div className="input-container">
            <input
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
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Ciudad</label>
          </div>
          <div className="input-container">
            <input
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
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Cedula</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Nombres</label>
          </div>
          <div className="input-container">
            <input
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
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Direccion</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Ciudad</label>
          </div>
          <div className="input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Telefono</label>
          </div>
        </div>
        <button className="submit-button" type="submit">
          Enviar
        </button>
      </section>
      <hr className="hr" />
      <section className="form__row">
        <p>Fuec</p>
        <div className="form__colum">
          <div className="input-container">
            <input
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
      </>
      )}
    </div>
  );
};

export default Fuec;
