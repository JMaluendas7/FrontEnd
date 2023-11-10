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
    <div className="container__login">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="input-container login">
            <input
              className="input-field campos_reg"
              placeholder=""
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="input-label" htmlFor="contrasena">
              Nombre de Usuario
            </label>
          </div>
          <div className="input-container login">
            <input
              id="contrasena"
              name="contrasena"
              className="input-field campos_reg"
              placeholder=""
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="input-label" htmlFor="contrasena">
              Contraseña
            </label>
          </div>
        </div>

        <button className="submit-button" type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
