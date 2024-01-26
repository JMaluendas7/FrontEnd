import React, { useState } from "react";
import axios from "axios";
import DynamicTable from "./PruebaTabla2";
import "react-datepicker/dist/react-datepicker.css";

const Fuec = ({ mostrarMensaje }) => {
  const [dni, setdni] = useState();
  const [showTable, setShowTable] = useState(false);

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

  const [tableData, setTableData] = useState([]);

  const columns = [
    { key: "Documento", label: "DOCUMENTO", type: "number" },
    { key: "Apellido", label: "APELLIDO", type: "text" },
    { key: "Nombres", label: "NOMBRES", type: "text" },
    { key: "Email", label: "EMAIL", type: "text" },
    { key: "Estado", label: "ESTADO", type: "text" },
    { key: "Usuario", label: "USUARIO", type: "number" },
    { key: "Password", label: "PASSWORD", type: "text" },
  ];

  const itemsPerPage = 30;

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login title_fuec">PVU</h1>
      <hr />
      <form className="forms__box" method="post">
        <div className="form__init">
          <div className="input-container">
            <input
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
    </div>
  );
};

export default Fuec;
