import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

function LoginForm({ setIsAuthenticated, mostrarMensaje, uidb64, token }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [dni, setDni] = useState("");
  const [animationClass, setAnimationClass] = useState("slide-in");
  const [formType, setFormType] = useState("login");
  useEffect(() => {
    if (uidb64 && token) {
      setFormType("resetPassword");
    } else {
      setFormType("login");
    }
  }, [uidb64, token]);

  const handleResetPassword = () => {
    setFormType("resetPassword");
  };

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
          mostrarMensaje(
            "Inicio de sesión Exitoso",
            "success_notification",
            "ok"
          );
          setIsAuthenticated(true); // Sesion Iniciada
        }
      }
    } catch (error) {
      mostrarMensaje(
        "Usuario o contraseña incorrectos.",
        "warning_notification",
        "warning"
      );
    }
  };

  // Funcion para reset de pass
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordResetRequest = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/reset_password/",
        {
          email,
          dni,
        }
      );

      mostrarMensaje(
        "Correo de recuperacion enviado",
        "success_notification",
        "ok"
      );
    } catch (error) {
      mostrarMensaje(
        "Correo de recuperacion no enviado",
        "warning_notification",
        "warning"
      );
    }
  };

  // Funcion para el cambio de contrasena
  const changePass = async (e) => {
    e.preventDefault();
    if (password == password2) {
      mostrarMensaje("Contraseñas coinciden", "succes_notification", "ok");
      console.log(password, password2);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/reset_password/change/",
          {
            uidb64,
            token,
            password,
            password2,
          }
        );

        if (response.status === 200) {
          navigate("/");
          mostrarMensaje(
            "Se ha cambiado la contraseña satisfactoriamente",
            "success_notification",
            "ok"
          );
        } else {
          navigate("/");
          mostrarMensaje(
            "No se ha cambiado la contraseña",
            "success_wuarning",
            "warning"
          );
        }
      } catch (error) {
        navigate("/");
        mostrarMensaje(
          "No se ha cambiado la contraseña",
          "success_wuarning",
          "warning"
        );
      }
    } else {
      mostrarMensaje(
        "Las contraseñas no coinciden",
        "warning_notification",
        "warning"
      );
    }
  };

  // Funcion para el cambio de manejo de formulario
  const handleFormChange = (newFormType) => {
    setAnimationClass("slide-out");
    setTimeout(() => {
      setFormType(newFormType);
      setAnimationClass("slide-in");
    }, 500);
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
              <label className="input-label2">Nombre de Usuario</label>
            </div>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="input-label2">Contraseña</label>
            </div>
            <button className="submit-button submit_icon" type="submit">
              <p className="text_button">Iniciar sesión</p>
              <figure className="icon_bus"></figure>
            </button>
          </form>
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("forgotPassword")}
          >
            Olvidé mi contraseña
          </button>
        </>
      );
    } else if (formType === "forgotPassword") {
      return (
        <>
          <form onSubmit={handlePasswordResetRequest}>
            <h1 className="title__form">Recuperacion de contraseña</h1>
            <p className="desc__form">
              Diligencie los campos para la validacion y restablecimiento de la
              contraseña
            </p>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="input-label2">Correo Electronico</label>
            </div>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="number"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
              <label className="input-label2">
                Documento de identificacion
              </label>
            </div>
            <button className="submit-button submit_icon" type="submit">
              <p className="text_button">Enviar solicitud</p>
              <figure className="icon_bus"></figure>
            </button>
          </form>
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("login")}
          >
            Tengo mi contraseña
          </button>
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("resetPassword")}
          >
            Cambiar contraseña
          </button>
        </>
      );
    } else if (formType === "resetPassword") {
      return (
        <>
          <form onSubmit={changePass}>
            <h1 className="title__form">Creacion de nueva contraseña</h1>
            <p className="desc__form">Diguite su nueva contraseña</p>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="input-label2">Nueva contraseña</label>
            </div>
            <div className="input-container login">
              <input
                className="input-field2 campos_reg"
                placeholder=""
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <label className="input-label2">Verificacion de contraseña</label>
            </div>
            <button className="submit-button submit_icon" type="submit">
              <p className="text_button">Enviar solicitud</p>
              <figure className="icon_bus"></figure>
            </button>
          </form>
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("login")}
          >
            Tengo mi contraseña
          </button>
        </>
      );
    }
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
