import React, { useState, useEffect } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import ContainerDos from "./components/Contenido";

function App() {



  const [menuData, setMenuData] = useState([]);
  const apiUrl = "http://127.0.0.1:8000/menu/1";

  useEffect(() => {
    // Realiza una solicitud GET a la API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Almacena los datos en el estado
        setMenuData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
        <Banner
          toggleMenu={toggleMenu}
          setContainerComponent={setContainerComponent}
        />
        <Menu
          menuItems={menuData}
          setMenuItems={setMenuData}
          setContainerComponent={setContainerComponent}
        />
        <Container Component={containerComponent} />
      </div>
    </div>
  );
}

export default App;
