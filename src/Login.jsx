import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UploadImage from "./components/rf2_for";
import "./css/Login.css";
import LogoBerlinas from "../src/img/Berlinas Principal.png";
import LogoTransC from "../src/img/logo_transcarga.png";
import LogoBerli from "../src/img/logo_berlitur.png";
import LogoTl from "../src/img/logo_tourline.png";
import LogoColi from "../src/img/Colibertador.png";
import LogoCit from "../src/img/CIT.png";
import LogobT from "../src/img/berlinas-tur.png";

function LoginForm({ setIsAuthenticated, mostrarMensaje, uidb64, token }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [dni, setDni] = useState("");
  const [animationClass, setAnimationClass] = useState("slide-in");
  const [formType, setFormType] = useState("login");

  useEffect(() => {
    if (uidb64 && token) {
      setFormType("changePass");
    } else {
      setFormType("login");
    }
  }, [uidb64, token]);

  const [isLoggedInByFace, setIsLoggedInByFace] = useState(false);

  const LoginFaceId = async (documento_num) => {
    try {
      // const response = await axios.post("http://127.0.0.1:9000/loginface/", {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/loginface/",
        {
          documento_num,
        }
      );
      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("authToken", token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("nombre", response.data.nombre);
        localStorage.setItem("apellido", response.data.apellido);
        localStorage.setItem("rol_id", response.data.rol_id);
        mostrarMensaje(response.data.message, "success_notification");
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(documento_num);
      mostrarMensaje(
        "Error al iniciar sesión por reconocimiento facial",
        "error_notification"
      );
      console.error("Error en la solicitud de reconocimiento facial: ", error);
    }
  };

  const [userId, setUserId] = useState(null);
  const handleRecognition = (isRecognized, user_id) => {
    setIsLoggedInByFace(isRecognized);
    if (isRecognized) {
      console.log(user_id);
      setUserId(user_id);
      LoginFaceId(user_id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formType === "login") {
      // Inicio de sesión
      try {
        // const response = await axios.post("http://127.0.0.1:9000/login/", {
        const response = await axios.post(
          "http://wsdx.berlinasdelfonce.com:9000/login/",
          {
            username,
            password,
          }
        );

        if (response.status === 200) {
          const token = response.data.token;
          Cookies.set("authToken", token);
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("nombre", response.data.nombre);
          localStorage.setItem("apellido", response.data.apellido);
          localStorage.setItem("rol_id", response.data.rol_id);
          mostrarMensaje(response.data.message, "success_notification");
          setIsAuthenticated(true); // Sesion Iniciada
        }
      } catch {
        mostrarMensaje(
          "Usuario o contraseña no corresponde",
          "warning_notification"
        );
      }
    } else {
      if (formType === "forgotPassword") {
        try {
          const response = await axios.post(
            // "http://127.0.0.1:9000/reset_password/",
            "http://wsdx.berlinasdelfonce.com:9000/reset_password/",
            {
              email,
              dni,
            }
          );

          if (response.status === 200) {
            mostrarMensaje(
              "Correo de recuperacion enviado",
              "success_notification"
            );
          }
        } catch {
          mostrarMensaje("Los datos no coinciden", "warning_notification");
          mostrarMensaje(
            "Correo de recuperacion no enviado",
            "error_notification"
          );
        }
      } else {
        if (formType === "changePass") {
          if (password == password2) {
            try {
              const response = await axios.post(
                // "http://127.0.0.1:9000/reset_password/change/",
                "http://wsdx.berlinasdelfonce.com:9000/reset_password/change/",
                {
                  uidb64,
                  token,
                  password,
                  password2,
                }
              );
              if (response.status === 200) {
                mostrarMensaje(
                  "La contraseña ha sido cambiada",
                  "success_notification"
                );
                setFormType("login");
              }
            } catch {
              mostrarMensaje(
                "No se ha podido cambiar la contraseña",
                "error_notification"
              );
            }
          } else {
            mostrarMensaje(
              "Las contraseñas no coinciden",
              "warning_notification"
            );
          }
        }
      }
    }
  };

  // Funcion para el cambio de manejo de formulario y animacion
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
        <div className="container_login--father">
          <h1 className="title__form">Iniciar sesión</h1>
          <form className="form_login" onSubmit={handleSubmit}>
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
            <button
              className="submit-button submit_icon login_bottom"
              type="submit"
            >
              <p className="text_button">Iniciar sesión</p>
              <figure className="icon_bus"></figure>
            </button>
          </form>
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("facePassword")}
          >
            FaceId
          </button>
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("forgotPassword")}
          >
            Olvidé mi contraseña
          </button>
        </div>
      );
    } else if (formType === "forgotPassword") {
      return (
        <div className="container_login--father">
          <h1 className="title__form">Recuperacion de contraseña</h1>
          <p className="desc__form">
            Diligencie los campos para la validacion y restablecimiento de la
            contraseña
          </p>
          <form className="form_login" onSubmit={handleSubmit}>
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
            <button
              className="submit-button submit_icon login_bottom"
              type="submit"
            >
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
            onClick={() => handleFormChange("facePassword")}
          >
            FaceId
          </button>
        </div>
      );
    } else if (formType === "facePassword") {
      return (
        <div className="container_login--father">
          <h1 className="title__form">Reconocimiento Facial</h1>
          <UploadImage
            mostrarMensaje={mostrarMensaje}
            onRecognition={handleRecognition}
          />
          <button
            className="olvide__pass"
            onClick={() => handleFormChange("login")}
          >
            Volver al inicio de sesión
          </button>
        </div>
      );
    } else if (formType === "changePass") {
      return (
        <div className="container_login--father">
          <form className="form_login" onSubmit={handleSubmit}>
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
        </div>
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
              <img src={LogoBerlinas} className="logo_empresas"></img>
              <img src={LogoTransC} className="logo_empresas"></img>
              <img src={LogoBerli} className="logo_empresas"></img>
              <img src={LogoTl} className="logo_empresas"></img>
              <img src={LogoColi} className="logo_empresas logo_coli"></img>
              <img src={LogoCit} className="logo_empresas"></img>
              <img src={LogobT} className="logo_empresas"></img>
            </figure>
          </section>
        </section>
      </section>
    </>
  );
}

export default LoginForm;
