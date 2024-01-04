import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/css/ContabilidadInicio.css";
import "react-datepicker/dist/react-datepicker.css";

const Pruebas = () => {
  // Llamado a lista de los usuarios
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/login/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al llamar a la API: ", error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  // useState para contener el valor de busqueda
  const [searchValue, setSearchValue] = useState("");

  // useState para campo de Mes Año
  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange1 = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Reporte cuota de administración</h1>
      <hr />
      <section className="contabilidad__table">
        <section className="contabilidad_section">
          <div className="user input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Codigo</label>
          </div>
          <div className="input-container agg_colaborador">
            <label className="label">Tipo Informe:</label>
            <select className="opciones">
              <option value={1}>Agencias De Viajes</option>
              <option value={2}>Ciudades</option>
              <option value={3}>Propietarios</option>
              <option value={4}>Ciudades - Colibertador</option>
              <option value={5}>Agencias - Berlitur</option>
            </select>
          </div>
          <div className="input-container agg_colaborador">
            <label className="label">Concepto:</label>
            <select className="opciones">
              <option value={"080101"}>Cuota Admon</option>
              <option value={"080103"}>Cuota Admon Agencias</option>
            </select>
          </div>
        </section>
        <section className="contabilidad_section">
          <div className="user input-container">
            <input
              name="usuario"
              className="input-field"
              placeholder=""
              type="text"
            />
            <label className="input-label">Codigo</label>
          </div>
          <div className="input-container agg_colaborador">
            <label className="label">Tipo Informe:</label>
            <select className="opciones">
              <option value={1}>Agencias De Viajes</option>
              <option value={2}>Ciudades</option>
              <option value={3}>Propietarios</option>
              <option value={4}>Ciudades - Colibertador</option>
              <option value={5}>Agencias - Berlitur</option>
            </select>
          </div>
          <div className="input-container agg_colaborador">
            <label className="label">Concepto:</label>
            <select className="opciones">
              <option value={"080101"}>Cuota Admon</option>
              <option value={"080103"}>Cuota Admon Agencias</option>
            </select>
          </div>
        </section>
      </section>
      <button className="submit-button botton_gp">Generar reporte</button>
    </div>
  );
};

export default Pruebas;
