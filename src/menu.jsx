import React, { useState } from "react";
import "./css/menu.css";

const Menu = ({ menuItems, setMenuItems, setContainerComponent }) => {
  const [menuStates, setMenuStates] = useState(menuItems.map(() => false));

  const toggleSubMenu = (index, component) => {
    if (component) {
      setContainerComponent(component);
    }
  };

  // Funcion de alternar clase para flecha(arriba-abajo)
  const toggleMenuMenu = (index) => {
    const updatedMenuStates = [...menuStates];
    updatedMenuStates[index] = !updatedMenuStates[index];
    setMenuStates(updatedMenuStates);
  };

  const abrirSubMenu = (index) => {
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

  const abrirMenuFlecha = (index) => {
    abrirSubMenu(index);
    toggleMenuMenu(index);
  };

  return (
    <section className="menu-container">
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menuItem">
            <nav
              className="menuItem-item"
              onClick={() => abrirMenuFlecha(index)}
            >
              <div className="menuItem-div">
                <img
                  src="/src/img/carpeta.png"
                  className="menuItem-logo"
                  alt="Carpeta"
                />
                <div className="menuItem-label">{item.nom_modulo}</div>
                <div
                  className={`menuItem-open ${
                    menuStates[index] ? "menu-openmenu" : ""
                  }`}
                ></div>
              </div>
            </nav>
            {item.isOpen && (
              <ul className="subMenu">
                {item.subItems.map((subItem, subIndex) => (
                  <li className="subMenu-item" key={subIndex}>
                    <img className="subMenu-img" src="src/img/add_user.png"></img>
                    <a
                      className="subMenu-url"
                      onClick={() => toggleSubMenu(index, String(subItem.link))}
                    >
                      {subItem.nom_modulo}
                    </a>
                    <img
                      src="src/img/autobus.png"
                      className="menuItem-logo menuItem-sublogo"
                      alt="Autobús"
                    />
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
