import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Vista from "./components/Vista";
import ContenidoDetail from "./components/ContenidoDetail";
import ContenidoList from "./components/ContenidoList"; // muestra la lista de todos los contenidos en la base de datos
import Usuarios from "./components/Usuarios"; // pagina de login pa usuario
import "./styles/App.css";
import API_CONFIG from "./config/api";
import AdministrarVistas from "./components/AdministrarVistas";
import CrearVista from "./components/CrearVista";
import CrearContenido from "./components/CrearContenido";
import CrearEpisodio from "./components/CrearEpisodio";
import ScrollToTop from "./components/ScrollToTop";
import EditarContenido from "./components/EditarContenido";

function App() {
  document.title = "NETFLIX";
  const location = useLocation();
  const [vistas, setVistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Resetear el localStorage al iniciar la aplicación
  useEffect(() => {
    localStorage.removeItem("usuarioSeleccionado"); // Eliminar el usuario almacenado en localStorage al cargar la aplicación
    setUsuarioSeleccionado(null); // Resetear el estado
    eliminarfavoritos();
  }, []);

  const eliminarfavoritos = async () => {
    const borrarFavs = {
      contenidos_ids: [],
    };
    try {
      const respuesta = await fetch(`${API_CONFIG.VISTAS}/Favoritos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrarFavs),
      });

      if (!respuesta.ok) {
        const errorMensaje = await respuesta.text();
        throw new Error(`Error del servidor: ${errorMensaje}`);
      }
      console.log("Lista de favoritos eliminada con éxito.");
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error);
    }
  };

  const cargarVistas = async () => {
    axios
      .get(API_CONFIG.VISTAS)
      .then((response) => {
        setVistas(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarVistas();
    if (location.state?.reload) {
      cargarVistas();
    }
  }, [usuarioSeleccionado, location.state]);

  if (loading) return <p>Loading views...</p>;
  if (error) return <p>Error loading views: {error}</p>;

  return (
      <div className="background">
        <header className="header">
          <div className="logo">
            <NavigationHome />
          </div>
          <div className="header-buttons">
            <NavigationContenidos/>
            <NavigationUsuarios 
              usuario={!!usuarioSeleccionado} 
              usuarioSeleccionado={usuarioSeleccionado} 
            />
            
          </div>
        </header>
        <div className="welcome-text">
          <h2>
            Explora los mejores contenidos creados para ti
          </h2>
        </div>
        <div>
          <main className="content">
            {usuarioSeleccionado &&
              usuarioSeleccionado.rol === "administrador" && (
                <div>
                  <div className="welcome-text">
                    <h2>Bienvenido Administrador</h2>
                  </div>
                </div>
              )}
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {usuarioSeleccionado && usuarioSeleccionado.rol === 'administrador' && (
                      <div>
                        <NavigationCrearVista />
                      </div>
                    )}
                    {vistas.map((vista) => (
                      <Vista key={vista.id_vista} vista={vista} />
                    ))}
                  </>
                }
              />
              <Route
                path="/contenido/:id"
                element={
                  <ContenidoDetail
                    setUsuarioSeleccionado={setUsuarioSeleccionado}
                  />
                }
              />{" "}
              {/* PAGINA DE DETALLE DE CONTENIDO */}
              <Route path="/contenido" element={<ContenidoList />} />{" "}
              {/* PAGINA DE LISTA DE CONTENIDOS */}
              <Route
                path="/login"
                element={
                  <Usuarios setUsuarioSeleccionado={setUsuarioSeleccionado} />
                }
              />{" "}
              {/* PAGINA DE LOGIN */}
              <Route
                path="/administrarVistas/:id"
                element={<AdministrarVistas cargarVistas={cargarVistas} />}
              />{" "}
              {/* PAGINA DE EDITAR VISTA */}
              <Route
                path="/crearVista"
                element={<CrearVista cargarVistas={cargarVistas} />}
              />{" "}
              {/* PAGINA DE CREAR VISTA */}
              <Route path="/crearContenido" element={<CrearContenido />} />{" "}
              {/* PAGINA DE CREAR CONTENIDO */}
              <Route path="/contenido/:id/editar" element={<EditarContenido />} />{" "}
              {/* PAGINA DE EDITAR CONTENIDO */} 
              <Route path="/contenido/:id/crearEpisodio" element={<CrearEpisodio />} />{" "}
              {/* PAGINA DE CREAR EPISODIO */}              
            </Routes>
          </main>
        </div>
      </div>
  );
}

// funcionalidades para navegacion por botones

function NavigationContenidos() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="contenidos-button"
        onClick={() => navigate("/contenido")}
      >
        Contenidos
      </button>
    </>
  );
}

function NavigationUsuarios({usuario, usuarioSeleccionado}) {
  const navigate = useNavigate();

  return (
    <>
      <div>
      {usuario ? (
        <button
          className="login-button"
          onClick={() => navigate("/login")} // Navigate to login page
        >
          Hola {usuarioSeleccionado?.nombre}
        </button>
      ) : (      
        <button
          className="login-button"
          onClick={() => navigate("/login")} // Navigate to login page
        >
          Usuarios
        </button>
      )}
      </div>
    </>
  );
}

function NavigationHome() {
  const navigate = useNavigate();

  return (
    <>
      <img
        src={`/assets/img/Netflix.png`}
        alt="Netflix logo"
        onClick={() => navigate("/", { replace: true })}
      ></img>
    </>
  );
}

function NavigationCrearVista() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="botonNuevaVista"
        onClick={() => navigate("/crearVista")}
      >
        Crear Vista
      </button>
      <button
        className="botonNuevoContenido"
        onClick={() => navigate("/crearContenido")}
      >
        Crear Contenido
      </button>
    </>
  );
}

export default App;
