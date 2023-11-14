import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "/src/css/Login.css";

function LoginForm({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [formType, setFormType] = useState("login"); // Puede ser "login", "forgotPassword", o "resetPassword"
  const [animationClass, setAnimationClass] = useState("slide-in");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formType === "login") {
        // Lógica para el inicio de sesión
        const response = await axios.post("http://127.0.0.1:8000/login/", {
          username,
          password,
        });

        if (response.status === 200) {
          const token = response.data.token;
          Cookies.set("authToken", token);
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("nombre", response.data.nombre);
          localStorage.setItem("apellido", response.data.apellido);
          localStorage.setItem("rol_id", response.data.rol_id);

          // Autenticación exitosa
          setIsAuthenticated(true); // Establecer como autenticado
        } else {
          // Manejar otros escenarios (por ejemplo, credenciales incorrectas)
        }
      } else if (formType === "forgotPassword") {
        // Lógica para recuperación de contraseña
        // ...

      } else if (formType === "resetPassword") {
        // Lógica para cambio de contraseña
        // ...
      }
    } catch (error) {
      // Manejar errores de conexión o del servidor
    }
  };

  // Funcion para reset de pass
  const recPass = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/reset_password/", {
        email,
        dni,
      });
  
      if (response.status === 200) {
        // Lógica para manejar la respuesta exitosa, por ejemplo, mostrar un mensaje al usuario
      } else {
        // Lógica para manejar otros escenarios (por ejemplo, correo electrónico no encontrado)
      }
    } catch (error) {
      // Manejar errores de conexión o del servidor
    }
  };

  // Funcion para el cambio de contrasena
  const changePass = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/reset_password/confirm/", {
        uidb64,  // Obtén el uidb64 del parámetro de la URL o de alguna manera
        token,   // Obtén el token del parámetro de la URL o de alguna manera
        new_password,
      });

      if (response.status === 200) {
        // Lógica para manejar la respuesta exitosa, por ejemplo, redirigir al usuario a la página de inicio de sesión
      } else {
        // Lógica para manejar otros escenarios (por ejemplo, token inválido)
      }
    } catch (error) {
      // Manejar errores de conexión o del servidor
    }
  };


  const renderForm = () => {
    if (formType === "login") {
      return (
        <>
          <h1 className="title__form">Iniciar sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-container login">
              <input
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
            <button className="olvide__pass" onClick={() => handleFormChange("forgotPassword")}>
                Olvidé mi contraseña
              </button>
          </form>
        </>
      );
    } else if (formType === "forgotPassword") {
      return (
        <>
          <form onSubmit={recPass}>
            <h1 className="title__form">Recuperacion de contraseña</h1>
            <p className="desc__form">Diligencie los campos para la validacion y restablecimiento de la contraseña</p>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              <label className="input-label2" htmlFor="inputField2">
                Correo Electronico
              </label>
            </div>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="number"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                />
              <label className="input-label2" htmlFor="inputField2">
                Documento de identificacion
              </label>
            </div>
            <button className="submit-button submit_icon" type="submit">
              <p className="text_button">Enviar solicitud</p>
              <figure className="icon_bus"></figure>
            </button>
          </form>
        </>
      );
    } else if (formType === "resetPassword") {
      return (
        <form onSubmit={handleSubmit}>
          {/* Agrega campos y etiquetas para el formulario de cambio de contraseña */}
        </form>
      );
    }
  };

  const handleFormChange = (newFormType) => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      setFormType(newFormType);
      setAnimationClass("slide-in");
    }, 500); // Ajusta este valor para que coincida con la duración de tu animación
  };


  return (
    <>
      <section className="panel__login">
        <section className="container__login--colums">
          <div className={`container__login ${animationClass}`}>
            {renderForm()}
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
