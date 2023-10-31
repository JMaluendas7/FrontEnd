import React from "react";
import "./css/banner.css";

const Banner = () => {
  return (
    <header className="banner">
      <nav className="nav">
        <section className="logo">
          <figure className="logo-img"></figure>
        </section>
        <div className="title">
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
