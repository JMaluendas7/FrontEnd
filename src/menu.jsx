import React, { useState } from "react";
import "./css/menu.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([
    {
      label: "Menu Uno",
      isOpen: true,
      subItems: [
        { label: "Reporte Estampilla NSS", url: "/submenuUnoUno" },
        { label: "Reporte Submenu Uno Dos", url: "/submenuUnoDos" },
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

  const toggleSubMenu = (index) => {
    setMenuItems((prevMenuItems) => {
      return prevMenuItems.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, isOpen: !item.isOpen };
        } else {
          return item;
        }
      });
    });
  };

  return (
    <section className="menu-container">
      <figure className="menu-hamburgesa"></figure>
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menuItem">
            <nav className="menuItem-item" onClick={() => toggleSubMenu(index)}>
              <img src="/src/img/carpeta.png" className="menuItem-logo"></img>
              <div className="menuItem-label">{item.label}</div>
              <div className="menuItem-open"></div>
            </nav>
            {item.isOpen && (
              <ul className="subMenu">
                {item.subItems.map((subItem, subIndex) => (
                  <li className="subMenu-item" key={subIndex}>
                    <a className="subMenu-url" href={subItem.url}>
                      {subItem.label}
                    </a>
                    <img
                      src="/src/img/autobus.png"
                      className="menuItem-logo menuItem-sublogo"
                    ></img>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </section>
  );
};

export default Menu;
