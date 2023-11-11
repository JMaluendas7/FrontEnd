import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "/src/css/Login.css";
function LoginForm({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("authToken", token);
        console.log(localStorage.setItem("username", response.data.username));
        localStorage.setItem("nombre", response.data.nombre);
        localStorage.setItem("apellido", response.data.apellido);

        // Autenticación exitosa
        setIsAuthenticated(true); // Establecer como autenticado
      } else {
        // Manejar otros escenarios (por ejemplo, credenciales incorrectas)
      }
    } catch (error) {
      // Manejar errores de conexión o del servidor
    }
  };

  return (
    <>
      <section className="panel__login">
        <section className="container__login--colums">
          <div className="container__login">
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-container login">
                <input
                  id="inputField2"
                  className="input-field2 campos_reg"
                  placeholder=""
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className="input-label2" htmlFor="inputField2">
                  Nombre de Usuario
                </label>
              </div>
              <div className="input-container login">
                <input
                  id="inputField2"
                  className="input-field2 campos_reg"
                  placeholder=""
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="input-label2" htmlFor="inputField2">
                  Contraseña
                </label>
              </div>
              <button className="submit-button submit_icon" type="submit">
                <p className="text_button">Iniciar sesión</p>
                <figure className="icon_bus"></figure>
              </button>
            </form>
          </div>
          <div className="container__content"></div>
          <section className="container__logos">
            <figure className="logos__figure">
              <img
                src="/src/img/Berlinas Principal.png"
                className="logo_empresas"
              ></img>
              <img
                src="/src/img/logo_transcarga.png"
                className="logo_empresas"
              ></img>
              <img
                src="/src/img/logo_berlitur.png"
                className="logo_empresas"
              ></img>
              <img
                src="/src/img/logo_tourline.png"
                className="logo_empresas"
              ></img>
              <img
                src="/src/img/Colibertador.png"
                className="logo_empresas logo_coli"
              ></img>
              <img src="/src/img/Cit.png" className="logo_empresas"></img>
              <img
                src="/src/img/berlinas-tur.png"
                className="logo_empresas"
              ></img>
            </figure>
          </section>
        </section>
      </section>
    </>
  );
}

export default LoginForm;
