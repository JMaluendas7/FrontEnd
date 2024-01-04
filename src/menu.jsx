import React, { useState } from "react";

const Menu = ({ menuItems, setMenuItems, setContainerComponent }) => {
  const [menuStates, setMenuStates] = useState(menuItems.map(() => false));
  const [activeSubItemIndices, setActiveSubItemIndices] = useState(
    menuItems.map(() => null)
  );

  const toggleSubMenu = (menuItemIndex, subItemIndex, component) => {
    if (component) {
      setContainerComponent(component);
      setActiveSubItemIndices((prevIndices) => {
        const newIndices = [...prevIndices];

        // Desactivar cualquier subítem activo en otros menús
        menuItems.forEach((_, index) => {
          if (index !== menuItemIndex) {
            newIndices[index] = null;
          }
        });

        // Activar el nuevo subítem
        newIndices[menuItemIndex] = subItemIndex;
        return newIndices;
      });
    }
  };

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
                <div className={`menuItem__icon ${item.url_img}`} />
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
                  <li
                    className={`subMenu-item ${
                      activeSubItemIndices[index] === subIndex ? "active" : ""
                    }`}
                    key={subIndex}
                    onClick={() =>
                      toggleSubMenu(index, subIndex, String(subItem.link))
                    }
                  >
                    <div className={`menuItem__icon ${subItem.url_img}`} />
                    <a className="subMenu-url">{subItem.nom_modulo}</a>
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
