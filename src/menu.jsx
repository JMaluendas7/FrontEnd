import React, { useState } from "react";

import "./css/menu.css";

const Menu = ({ menuItems, setMenuItems }) => {
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

  const [menuStates, setMenuStates] = useState(menuItems.map(() => false));

  const toggleMenuMenu = (index) => {
    const updatedMenuStates = [...menuStates];
    updatedMenuStates[index] = !updatedMenuStates[index];
    setMenuStates(updatedMenuStates);
  };

  return (
    <section className="menu-container">
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menuItem">
            <nav className="menuItem-item" onClick={() => toggleSubMenu(index)}>
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
                      onClick={() => toggleSubMenu(index, item.component)}
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
