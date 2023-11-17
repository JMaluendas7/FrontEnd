import React, { useState, useEffect } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import LoginForm from "./Login";
import Notificacion from "./Notificacion";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [menuData, setMenuData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

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
  const getMenu = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/menu/${rol_id}/`);
      setMenuData(response.data);
      if (response.data.length == false) {
        setIsAuthenticated(false);
        mostrarMensaje("No tienes permisos de acceso", "error", "error");
        Cookies.remove("authToken");
      }
    } catch (error) {
      mostrarMensaje(
        "No se pueden visualizar los items del menu",
        "error",
        "error"
      );
    }
  };

  if (isAuthenticated == true && menuData.length == false) {
    getMenu();
  }

  // Trae los elementos para el menu solo si el usuario está autenticado
  useEffect(() => {
    const token = Cookies.get("authToken"); // O localStorage.getItem("authToken");
    if (token) {
      console.log("Username:", username);
      setIsAuthenticated(true);
    }
  }, []);

  const [containerComponent, setContainerComponent] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [mensaje, setMensaje] = useState({
    visible: false,
    mensaje: "Pestaña de Notificacion",
    color: "#1CC88A",
    imagen: "ok",
  });

  // Función para mostrar la notificación por un tiempo específico
  const mostrarMensaje = (mensaje, color, imagen) => {
    setMensaje({
      visible: true,
      mensaje,
      color,
      imagen,
    });
    setTimeout(() => {
      setMensaje({
        visible: false,
        mensaje: "",
        imagen: "",
      });
    }, 6000);
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
            <Container
              Component={containerComponent}
              mostrarMensaje={mostrarMensaje}
            />
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
            <LoginForm
              setIsAuthenticated={setIsAuthenticated}
              mostrarMensaje={mostrarMensaje}
            />
          </div>
        )}
        {mensaje.visible && (
          <Notificacion
            mensaje={mensaje.mensaje}
            color={mensaje.color}
            imagen={mensaje.imagen}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
