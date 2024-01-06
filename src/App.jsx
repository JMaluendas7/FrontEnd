import React, { useState, useEffect } from "react";
import Banner from "./banner";
import Menu from "./menu";
import Container from "./Container";
import LoginForm from "./Login";
import Notificacion from "./Notificacion";
import axios from "axios";
import Cookies from "js-cookie";
import "./App.css";
import "../src/css/banner.css";
import "../src/css/menu.css";
import "../src/css/contenido.css";
import "../src/css/Notificacion.css";
import "../src/css/scroll.css";
// import "../src/css/ContabilidadInicio.css";
import "../src/css/responsive.css";
import "../src/css/administracion/AddColaboradores.css";
import "./components/Contenido";
import "./components/administracion/AddColaboradores";

function App() {
  const [uidb64, setUidb64] = useState("");
  const [token, setToken] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const uidb64Param = searchParams.get("uidb64");
    const tokenParam = searchParams.get("token");

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

  const handleLogout = () => {
    Cookies.remove("authToken"); // Borra la cookie que contiene el token JWT
    setContainerComponent(false); // Limpia las variables de estado de autenticación
    window.location.reload(); // Recarga la pagina ya sin acceso
    const username = "";
    const nombre = "";
    const apellido = "";
    const rol_id = "";
  };

  // const [sessionTimeout, setSessionTimeout] = useState(null);

  // const resetSessionTimeout = () => {
  //   if (sessionTimeout) {
  //     clearTimeout(sessionTimeout);
  //   }

  //   const timeout = setTimeout(() => {
  //     if (isAuthenticated) {
  //       handleLogout();
  //       console.log('Sesión cerrada por inactividad');
  //     }
  //     console.log("listo");
  //   }, 3000); // 5 minutos de inactividad (en milisegundos)

  //   setSessionTimeout(timeout);
  // };

  // useEffect(() => {
  //   const events = ['mousedown', 'keydown', 'touchstart']; // Eventos que indican actividad

  //   const resetTimeout = () => {
  //     resetSessionTimeout();
  //   };

  //   events.forEach((event) => {
  //     window.addEventListener(event, resetTimeout);
  //   });

  //   resetSessionTimeout(); // Iniciar el temporizador al cargar el componente

  //   return () => {
  //     events.forEach((event) => {
  //       window.removeEventListener(event, resetTimeout);
  //     });
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleUnload = (event) => {
  //     handleLogout();
  //     event.preventDefault();
  //     return (event.returnValue = "¿Estás seguro de abandonar la página?");
  //   };

  //   window.addEventListener("beforeunload", handleUnload);

  //   return () => window.removeEventListener("beforeunload", handleUnload);
  // }, []);

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

  const [containerComponent, setContainerComponent] = useState("Rpto_fuec");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Funcion para abrir los ites del menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;
      const screenWidthThreshold = 750; // Umbral de ancho de pantalla

      if (windowWidth < screenWidthThreshold) {
        // if(windowWidth < 760) {
        //   setIsMenuOpen(true)
        // }
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div>
      {isAuthenticated ? (
        <div className={`main-content ${isMenuOpen ? "menu-open" : ""}`}>
          {/* Componentes cuando el usuario está autenticado */}
          <Menu
            menuItems={menuData}
            setMenuItems={setMenuData}
            setContainerComponent={setContainerComponent}
          />
          <Container
            Component={containerComponent}
            mostrarMensaje={mostrarMensaje}
            username={username}
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
            uidb64={uidb64}
            token={token}
          />
        </div>
      )}
      {/* Componente de notificaciones */}
      <Notificacion
        notificaciones={notificaciones}
        cerrarNotificacion={cerrarNotificacion}
      />
    </div>
  );
}

export default App;
