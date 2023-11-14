import React, { useState, useEffect } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import LoginForm from "./Login";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [menuData, setMenuData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  // Trae los elementos para el menu solo si el usuario está autenticado
  useEffect(() => {
    const token = Cookies.get("authToken"); // O localStorage.getItem("authToken");
    if (token) {
      console.log("Rol_id:", rol_id);
      console.log("Username:", username);
      console.log("Nombre:", nombre);
      console.log("Apellido:", apellido);
      setIsAuthenticated(true);
    }
    getMenu();
  }, []);

  const username = localStorage.getItem("username");
  const nombre = localStorage.getItem("nombre");
  const apellido = localStorage.getItem("apellido");
  const rol_id = localStorage.getItem("rol_id");

  axios.interceptors.request.use((config) => {
    const token = Cookies.get("authToken"); // O localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // Trae los elementos para el menu
  const getMenu = () => {
    fetch(`http://127.0.0.1:8000/menu/${rol_id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No hubo respuesta");
        }
        return response.json();
      })
      .then((data) => {
        setMenuData(data);
      })
      .catch((error) => {
        console.error("Error al obtener respuesta", error);
      });
  };

  const [containerComponent, setContainerComponent] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div>
        {isAuthenticated ? ( // Verifica si el usuario está autenticado
          <div className={`main-content ${isMenuOpen ? "menu-open" : ""}`}>
            <Menu
              menuItems={menuData}
              setMenuItems={setMenuData}
              setContainerComponent={setContainerComponent}
            />
            <Container Component={containerComponent} />
            <Banner
              toggleMenu={toggleMenu}
              setContainerComponent={setContainerComponent}
              setIsAuthenticated={setIsAuthenticated}
              username={username}
              nombre={nombre}
              apellido={apellido}
            />
          </div>
        ) : (
          <div>
            {/* Aquí puedes renderizar un componente de inicio de sesión */}
            <LoginForm setIsAuthenticated={setIsAuthenticated} />
            {/* Implementa tu componente de inicio de sesión aquí */}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
