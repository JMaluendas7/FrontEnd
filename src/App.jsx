import React, { useState } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./contenido";
import ContainerDos from "./contenidodos";

function App() {
  const [containerComponent, setContainerComponent] = useState("Container");

  const [menuItems, setMenuItems] = useState([
    {
      label: "Menu Uno",
      isOpen: false,
      component: "Container",
      subItems: [
        { label: "Reporte Estampilla NSS", url: "./contenido" },
        { label: "Reporte Submenu Uno Dos", url: "./contenidodos" },
      ],
    },
    {
      label: "Menu Dos",
      isOpen: false,
      subItems: [
        { label: "Submenu Dos Uno", url: "/submenuDosUno" },
        { label: "Submenu Dos Dos", url: "/submenuDosDos" },
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
    import(`./${component}`).then((module) => {
      setContainerComponent(component);
    });
  };
  return (
    <div>
      <div className={`main-content ${isMenuOpen ? "menu-open" : ""}`}>
        <Banner toggleMenu={toggleMenu} />
        <Menu
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          toggleSubMenu={toggleSubMenu}
        />
        <Container component={containerComponent} />
      </div>
    </div>
  );
}

export default App;
