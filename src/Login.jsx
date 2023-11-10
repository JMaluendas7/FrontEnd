import React, { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

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
        console.log(localStorage.setItem('username', response.data.username))
        localStorage.setItem('nombre', response.data.nombre);
        localStorage.setItem('apellido', response.data.apellido);

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
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginForm;
