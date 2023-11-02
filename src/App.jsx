import React, { useState } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import ContainerDos from "./components/Contenido";

function App() {
  const [containerComponent, setContainerComponent] = useState("Home");

  const [menuItems, setMenuItems] = useState([
    {
      label: "Menu Uno",
      isOpen: false,
      subItems: [
        { label: "Reporte Estampilla NSS", url: "Contenido" },
        { label: "Reporte Submenu Uno Dos", url: "Contenidodos" },
      ],
    },
    {
      label: "Menu Dos",
      isOpen: false,
      subItems: [
        { label: "Submenu Dos Uno", url: "Container" },
        { label: "Submenu Dos Dos", url: "contenidodos" },
      ],
    },
    {
      label: "Menu Tres",
      isOpen: false,
      subItems: [
        { label: "Submenu Tres Uno", url: "2" },
        { label: "Submenu Tres Dos", url: "./models/contenido" },
      ],
    },
    {
      label: "Menu Cuatro",
      isOpen: false,
      subItems: [
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
      ],
    },
    {
      label: "Menu Cinco",
      isOpen: false,
      subItems: [
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
      ],
    },
    {
      label: "Menu Seis",
      isOpen: false,
      subItems: [
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
      ],
    },
    {
      label: "Menu Siete",
      isOpen: false,
      subItems: [
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
      ],
    },
  ]);

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
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          setContainerComponent={setContainerComponent}
        />
        <Container Component={containerComponent} />
      </div>
    </div>
  );
}

export default App;
