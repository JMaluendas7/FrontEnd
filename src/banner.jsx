import React from "react";
import "./css/banner.css";
import "./css/menu.css";

const Banner = ({ toggleMenu, setContainerComponent }) => {
  const toggleSubMenu = (component) => {
    if (component) {
      setContainerComponent(component);
    }
  };

  return (
    <header className="banner">
      <nav className="menu-hamburgesa" onClick={toggleMenu}></nav>
      <nav className="nav">
        <section className="logo">
          <figure className="logo-img"></figure>
        </section>
        <div className="title" onClick={() => toggleSubMenu("Home")}>
          <h2 className="title-app">5Apps</h2>
        </div>
        <section className="logout">
          <figure className="logout-figure">
            <h3 className="logout-user">User Name</h3>
            <div className="logout-Button"></div>
          </figure>
        </section>
      </nav>
    </header>
  );
};

export default Banner;
