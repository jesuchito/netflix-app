import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Vista from "./components/Vista";
import ContenidoDetail from "./components/ContenidoDetail";
import ContenidoList from "./components/ContenidoList"; // muestra la lista de todos los contenidos en la base de datos
import Usuarios from "./components/Usuarios"; // pagina de login pa usuario
import "./styles/App.css";
import API_CONFIG from "./config/api";
import AdministrarVistas from "./components/AdministrarVistas";

function App() {
  document.title = "NETFLIX";
  const [vistas, setVistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(
    JSON.parse(localStorage.getItem("usuarioSeleccionado"))
  );
  
    // Resetear el localStorage al iniciar la aplicación
  useEffect(() => {
      // Eliminar el usuario almacenado en localStorage al cargar la aplicación
      localStorage.removeItem("usuarioSeleccionado");
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
    try {
        const respuesta = await fetch(`${API_CONFIG.VISTAS}`);
        const data = await respuesta.json();
        setVistas(data);
    } catch (error) {
        console.error("Error al cargar las vistas:", error);
    }
  };

  useEffect(() => {
    cargarVistas();
  }, []);

  useEffect(() => {
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
  }, [usuarioSeleccionado]);

  if (loading) return <p>Loading views...</p>;
  if (error) return <p>Error loading views: {error}</p>;

  return (
    <Router>
      <div className="background">
        <header className="header">
          <div className="logo">
            <NavigationHome />
          </div>
          <div className="header-buttons">
            <NavigationButtons />
          </div>
        </header>
        <div className="welcome-text">
          {usuarioSeleccionado ? (
            <h2>Explora los mejores contenidos creados para ti: {usuarioSeleccionado.nombre}</h2>
          ):(
            <h2>Explora los mejores contenidos creados para ti: no hay usuario</h2>
          )}
        </div>
        <div>
          <main className="content">
            {usuarioSeleccionado && usuarioSeleccionado.rol === 'administrador' && (
              <div className="welcome-text">
                <h2>Bienvenido Administrador</h2>
              </div>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                  {vistas.map((vista) => (
                    <Vista key={vista.id_vista} vista={vista} />
                  ))}
                  </>
                }     
              />
              <Route path="/contenido/:id" element={<ContenidoDetail setUsuarioSeleccionado={setUsuarioSeleccionado} />} />{" "}
              {/* PAGINA DE DETALLE DE CONTENIDO */}
              <Route path="/contenido" element={<ContenidoList />} />{" "}
              {/* PAGINA DE LISTA DE CONTENIDOS */}
              <Route path="/login" element={<Usuarios setUsuarioSeleccionado={setUsuarioSeleccionado} />} />{" "}
              {/* PAGINA DE LOGIN */}
              <Route path="/administrarVistas/:id" element={<AdministrarVistas cargarVistas={cargarVistas} />} />{" "}
              {/* PAGINA DE EDITAR VISTA */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

// aqui vamos a añadir las funcionalidades para navegacion por botones
function NavigationButtons() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="contenidos-button"
        onClick={() => navigate("/contenido")}
      >
        Contenidos
      </button>
      <button
        className="login-button"
        onClick={() => navigate("/login")} // Navigate to login page
      >
        Usuarios
      </button>
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

export default App;
