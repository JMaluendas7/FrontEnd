import React from "react";
import "./css/banner.css";
import "./css/menu.css";

const Banner = ({ toggleMenu, setContainerComponent, username }) => {
  const toggleSubMenu = (component) => {
    if (component) {
      setContainerComponent(component);
    }
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
              <h3 className="logout-user">{username}</h3>
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
                  <a className="item-url" href="#">
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
