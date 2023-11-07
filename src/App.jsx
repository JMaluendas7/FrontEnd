import React, { useState, useEffect } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import ContainerDos from "./components/Contenido";

function App() {
  const [menuData, setMenuData] = useState([]);
  const apiUrl = "http://127.0.0.1:8000/menu/1";

  // Trae los elementos para el menu
  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No hubo respuesta");
        }
        return response.json();
      })
      .then((data) => {
        setMenuData(data);
      })
      .catch((error) => {
        console.error("Error al obtener respuesta", error);
      });
  }, []);

  const [containerComponent, setContainerComponent] = useState("Home");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div className={`main-content ${isMenuOpen ? "menu-open" : ""}`}>
        <Menu
          menuItems={menuData}
          setMenuItems={setMenuData}
          setContainerComponent={setContainerComponent}
        />
        <Container Component={containerComponent} />
        <Banner
          toggleMenu={toggleMenu}
          setContainerComponent={setContainerComponent}
        />
      </div>
    </div>
  );
}

export default App;
