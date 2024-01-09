import React, { useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const Pruebas = () => {
  // Llamado a lista de los usuarios
  const [users, setUsers] = useState([]);

  const rptoCuotaAdmin = async () => {
    formData.append("pdf_file", pdfFile);
    formData.append("modifiedFields", modifiedFields);
    formData.append("bus", bus);
    formData.append("viaje", viaje);
    formData.append("username", username);

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
      // this.mostrarMensaje(response.data.message, "success_notification");
    } catch (error) {
      // this.mostrarMensaje(response.data.message, "success_notification");
    }
  };

  // useState para contener el valor de busqueda
  const [searchValue, setSearchValue] = useState("");

  // useState para campo de Mes Año
  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange1 = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Generador de reporte</h1>
      <hr />
      <section className="container__table turismo__table">
        <div>
          <label className="label">Selecciona año y mes:</label>
          <input
            type="month"
            className="input-field"
            value={selectedDate}
            onChange={handleDateChange1}
            min="YYYY-01"
            max="YYYY-12"
          />
        </div>
        <div className="input-container agg_colaborador">
          <select className="opciones">
            <option value={1}>Estadistica viajero frecuente Berlinas</option>
            <option value={1}>Estadisticas VF servicio especial</option>
            <option value={1}>Estadistica viajeros frecuente duo</option>
            <option value={1}>Viajeros Frecuentes</option>
            <option value={1}>Tiquete viajero frecuente berlinas</option>
            <option value={1}>
              Tiquete viajero frecuente servicio especial
            </option>
            <option value={"tiquete_viajero_frecuente_duo"}>
              Tiquete viajero frecuente duo
            </option>
            <option value={1}>Venta online</option>
            <option value={1}>
              Prospecto para ingresar al programa viajero frecuente
            </option>
          </select>
        </div>
        <button className="submit-button botton_gp">Generar reporte</button>
      </section>
    </div>
  );
};

export default Pruebas;
