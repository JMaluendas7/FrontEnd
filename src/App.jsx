import React, { useState } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./contenido";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div>
      <div className={`main-content ${isMenuOpen ? 'menu-open' : ''}`}>
        <Banner toggleMenu={toggleMenu} />
        <Menu />
        <Container />
      </div>
    </div>
  );
};


export default App;
