import React from "react";
import Cookies from "js-cookie";

const Banner = ({
  setContainerComponent,
  username,
  nombre,
  apellido,
  isMenuOpen,
  menuRef,
  setIsMenuOpen,
}) => {
  const toggleSubMenu = (component) => {
    if (component) {
      setContainerComponent(component);
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken"); // Borra la cookie que contiene el token JWT
    setContainerComponent(false); // Limpia las variables de estado de autenticación
    window.location.reload(); // Recarga la pagina ya sin acceso
    const username = "";
    const nombre = "";
    const apellido = "";
    const rol_id = "";
  };

  return (
    <header className="banner">
      <div
        className="menu-hamburgesa"
        ref={menuRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      ></div>
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
          <div className="logout-content">
            <figure className="logout-figure">
              <div className="logout-div">
                <h3 className="logout-user">{nombre + " " + apellido}</h3>
                <div className="logout-Button"></div>
              </div>
            </figure>
            <section className="container-logout">
              <ul className="container-items">
                <li className="item">
                  <a className="item-url">Configuraciones</a>
                </li>
                <div className="line"></div>
                <li className="item">
                  <a className="item-url">Preferencias</a>
                </li>
                <div className="line"></div>
                <li className="item" onClick={handleLogout}>
                  <a className="item-url">Cerrar sesión</a>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </nav>
    </header>
  );
};

export default Banner;
