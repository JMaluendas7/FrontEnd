import React from "react";
import Cookies from "js-cookie";
import "./css/banner.css";
import "./css/menu.css";
import { useNavigate } from "react-router-dom";

const Banner = ({
  toggleMenu,
  setContainerComponent,
  username,
  nombre,
  apellido,
}) => {
  const navigate = useNavigate();

  const toggleSubMenu = (component) => {
    if (component) {
      setContainerComponent(component);
    }
  };

  const handleLogout = () => {
    // Borra la cookie que contiene el token JWT
    Cookies.remove("authToken");

    // Limpia las variables de estado relacionadas con la autenticación
    setContainerComponent(false); // O establece el componente por defecto
    // Puedes añadir más acciones según sea necesario

    // Redirige al usuario a la página de inicio de sesión
    navigate("");
    window.location.reload();
  };

  return (
    <header className="banner">
      <nav className="menu-hamburgesa" onClick={toggleMenu}></nav>
      <nav className="nav">
        <a
          className="logo"
          target="_blanck"
          href="https://www.berlinasdelfonce.com/"
        >
          <figure className="logo-img"></figure>
        </a>
        <div className="title" onClick={() => toggleSubMenu("Home")}>
          <h2 className="title-app">5Apps</h2>
        </div>
        <section className="logout">
          <figure className="logout-figure">
            <div className="logout-div">
              <h3 className="logout-user">{nombre + " " + apellido}</h3>
              <div className="logout-Button"></div>
            </div>
            <section className="container-logout">
              <ul className="container-items">
                <li className="item">
                  <a className="item-url" href="#">
                    Configuraciones
                  </a>
                </li>
                <div className="line"></div>
                <li className="item">
                  <a className="item-url" href="#">
                    Preferencias
                  </a>
                </li>
                <div className="line"></div>
                <li className="item">
                  <a className="item-url" href="" onClick={handleLogout}>
                    Cerrar Sesion
                  </a>
                </li>
              </ul>
            </section>
          </figure>
        </section>
      </nav>
    </header>
  );
};

export default Banner;
