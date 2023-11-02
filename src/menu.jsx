import React, { useState } from "react";

import "./css/menu.css";

const Menu = ({ menuItems, setMenuItems, setContainerComponent }) => {
  const [menuStates, setMenuStates] = useState(menuItems.map(() => false));

  const toggleMenuMenu = (index) => {
    const updatedMenuStates = [...menuStates];
    updatedMenuStates[index] = !updatedMenuStates[index];
    setMenuStates(updatedMenuStates);
  };
  
  const toggleSubMenu = (index, component) => {
    setMenuItems((prevMenuItems) => {
      return prevMenuItems.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, isOpen: !item.isOpen };
        } else {
          return item;
        }
      });
    });

    if (component) {
      // Pasa el componente al Container cuando se hace clic en un subítem
      setContainerComponent(component);
    }
  };



  return (
    <section className="menu-container">
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menuItem">
            <nav className="menuItem-item" onClick={() => toggleSubMenu(index, item.url)}>
              <div
                className="menuItem-div"
                onClick={() => toggleMenuMenu(index)}
              >
                <img src="/src/img/carpeta.png" className="menuItem-logo"></img>
                <div className="menuItem-label">{item.label}</div>
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
                    <a
                      className="subMenu-url"
                      onClick={() => toggleSubMenu(index, item.url)}
                    >
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
