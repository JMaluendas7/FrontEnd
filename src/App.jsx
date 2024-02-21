import React, { useState, useEffect, useRef } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import LoginForm from "./Login";
import Notificacion from "./Notificacion";
import axios from "axios";
import Cookies from "js-cookie";
import "../src/css/banner.css";
import "../src/css/menu.css";
import "../src/css/contenido.css";
import "../src/css/Notificacion.css";
import "../src/css/AddColaboradores.css";
import "/src/css/fuec/Rpto_fuec.css";
import "../src/css/scroll.css";
import "./App.css";
import "../src/css/AdminTable.css";
import "../src/css/responsive.css";
// Mantener el orden en las importaciones del css para mantener la especificidad y evitar sobrepisar codigo

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [menuData, setMenuData] = useState([]);
  const [uidb64, setUidb64] = useState("");
  const [token, setToken] = useState("");
  const menuHRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const uidb64Param = searchParams.get("uidb64");
    const tokenParam = searchParams.get("token");

    // Manejo de nueva contraseña
    if (uidb64Param && tokenParam) {
      setUidb64(uidb64Param);
      setToken(tokenParam);
      // Redirigir a la URL sin parámetros
      window.history.replaceState(null, null, "/");
    }

    // Fetch menu data if authenticated and menuData is empty
    if (!isAuthenticated) {
      const token = Cookies.get("authToken");
      if (token) {
        const username = localStorage.getItem("username");
        setIsAuthenticated(true);
      }
    }

    // Fetch menu if authenticated and menuData is empty
    if (isAuthenticated && menuData.length === 0) {
      getMenu();
    }
  }, [isAuthenticated, menuData.length]);

  // Almacenamiento de Cookies en variables
  const username = localStorage.getItem("username");
  const nombre = localStorage.getItem("nombre");
  const apellido = localStorage.getItem("apellido");
  const rol_id = localStorage.getItem("rol_id");

  // Trae los elementos para el menu
  const getMenu = async () => {
    try {
      const response = await axios.get(
        `http://wsdx.berlinasdelfonce.com:9000/menu/${rol_id}/`
      );
      setMenuData(response.data);
      if (response.data.length == false) {
        setIsAuthenticated(false);
        mostrarMensaje("No tienes permisos de acceso", "error_notification");
        Cookies.remove("authToken");
      }
    } catch (error) {
      mostrarMensaje(
        "No se pueden visualizar los items del menu",
        "error_notification"
      );
    }
  };

  const [containerComponent, setContainerComponent] = useState();
  useEffect(() => {
    if (rol_id == 3) {
      setContainerComponent("Reportes_RptoFuec");
    } else {
      setContainerComponent("Home");
    }
  }, [rol_id]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Funcion para abrir los ites del menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
  const mostrarMensaje = (mensaje, color) => {
    const id = Date.now();
    const nuevaNotificacion = {
      id,
      mensaje,
      color,
      visible: true,
      timeoutId: setTimeout(() => cerrarNotificacion(id), 6000),
    };

    setNotificaciones((prevNotificaciones) => [
      ...prevNotificaciones,
      nuevaNotificacion,
    ]);
  };

  const handleClickOutsideMenu = (event) => {
    if (
      (menuRef.current && !menuRef.current.contains(event.target)) ||
      (menuHRef.current && !menuHRef.current.contains(event.target))
    ) {
      toggleMenu();
    }
  };

  // Handle of Resize window
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth < 1110 && !isMenuOpen) {
        document.addEventListener("mouseup", handleClickOutsideMenu);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mouseup", handleClickOutsideMenu);
    };
  }, [isMenuOpen]);

  return (
    <div>
      {isAuthenticated ? (
        <div className={`main-content ${isMenuOpen ? "menu-open" : ""}`}>
          <Menu
            menuItems={menuData}
            setMenuItems={setMenuData}
            setContainerComponent={setContainerComponent}
            menuRef={menuRef}
            toggleMenu={toggleMenu}
          />
          <Container
            Component={containerComponent}
            mostrarMensaje={mostrarMensaje}
            username={username}
          />
          <Banner
            isMenuOpen={isMenuOpen}
            setContainerComponent={setContainerComponent}
            setIsAuthenticated={setIsAuthenticated}
            username={username}
            nombre={nombre}
            apellido={apellido}
            menuRef={menuRef}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
      ) : (
        <div>
          <LoginForm
            setIsAuthenticated={setIsAuthenticated}
            mostrarMensaje={mostrarMensaje}
            uidb64={uidb64}
            token={token}
          />
        </div>
      )}
      <Notificacion
        notificaciones={notificaciones}
        cerrarNotificacion={cerrarNotificacion}
      />
    </div>
  );
}

export default App;
