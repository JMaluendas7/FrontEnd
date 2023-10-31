import React, { useState } from 'react';
import './css/menu.css'; // Importa el archivo de estilos CSS

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState([
    // ... tus datos de menú aquí
  ]);

  // Función para alternar la apertura/cierre del submenú
  const toggleSubMenu = (index) => {
    // ... lógica para alternar el estado isOpen
  };

  return (
    <nav className="menu">
      {menuItems.map((item, index) => (
        <div key={index} className="menuItem">
          <div
            onClick={() => toggleSubMenu(index)}
            className="menuItemLabel"
          >
            {item.label}
          </div>
          {item.isOpen && (
            <ul className="subMenu">
              {item.subItems.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <a href={subItem.url}>{subItem.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
