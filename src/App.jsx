import React, { useState } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./contenido";
import ContainerDos from "./models/contenido";

function App() {
  const [containerComponent, setContainerComponent] = useState(null);

  const [menuItems, setMenuItems] = useState([
    {
      label: "Menu Uno",
      isOpen: false,
      component: "./models/contenido",
      subItems: [
        { label: "Reporte Estampilla NSS", url: 'ContainerDos' },
        { label: "Reporte Submenu Uno Dos", url: "ContainerDos" },
      ],
    },
    {
      label: "Menu Dos",
      isOpen: false,
      component: './Contenidodos',
      subItems: [
        { label: "Submenu Dos Uno", url: './Contenidodos' },
        { label: "Submenu Dos Dos", url: '/Contenidodos' },
      ],
    },
    {
      label: "Menu Tres",
      isOpen: false,
      subItems: [
        { label: "Submenu Tres Uno", url: "/submenuTresUno" },
        { label: "Submenu Tres Dos", url: "/submenuTresDos" },
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
  const toggleSubMenu = (index, component) => {
    if (component){
      import(`./${component}`).then((module) => {
        setContainerComponent(containerComponent);
      });
    }
  };

  return (
    <div>
      <div className={`main-content ${isMenuOpen ? "menu-open" : ""}`}>
        <Banner toggleMenu={toggleMenu} />
        <Menu
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          toggleSubMenu={toggleSubMenu}
          setContainerComponent={setContainerComponent}
        />
        <Container component={containerComponent} />
      </div>
    </div>
  );
}

export default App;
