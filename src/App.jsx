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
    visible: true,
    mensaje: null,
    color: null,
    imagen: null,
  });

  const [notificaciones, setNotificaciones] = useState([]);
  // Cierra la notificacion y la elimina
  const cerrarNotificacion = (id) => {
    setNotificaciones((prevNotificaciones) => {
      const updatedNotificaciones = prevNotificaciones.map((notificacion) =>
        notificacion.id === id
          ? { ...notificacion, visible: false }
          : notificacion
      );
      return updatedNotificaciones.filter(
        (notificacion) => notificacion.visible
      );
    });
  };

  // Función para mostrar la notificación por un tiempo específico
  const mostrarMensaje = (mensaje, color, imagen) => {
    const id = Date.now();
    const nuevaNotificacion = {
      id,
      mensaje,
      color,
      imagen,
      visible: true,
      timeoutId: setTimeout(() => cerrarNotificacion(id), 600000),
    };

    setNotificaciones((prevNotificaciones) => [
      ...prevNotificaciones,
      nuevaNotificacion,
    ]);
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
        <Notificacion
          notificaciones={notificaciones}
          cerrarNotificacion={cerrarNotificacion}
        />
      </div>
    </Router>
  );
}

export default App;
