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
import "./styles/App.css";

function App() {
  document.title = "NETFLIX";
  const [vistas, setVistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8082/vista")
      .then((response) => {
        setVistas(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading views...</p>;
  if (error) return <p>Error loading views: {error}</p>;

  return (
    <Router>
      <div className="background">
        <header className="header">
          <h1>NETFLIX</h1>
          <div className="header-buttons">
            <NavigationButtons />
          </div>
        </header>
        <div className="welcome-text">
          <h2>Explora los mejores contenidos creados para ti!</h2>
        </div>
        <div>
          <main className="content">
            <Routes>
              <Route
                path="/"
                element={vistas.map((vista) => (
                  <Vista key={vista.id_vista} vista={vista} />
                ))}
              />
              <Route path="/contenido/:id" element={<ContenidoDetail />} />
              <Route path="/contenido" element={<ContenidoList />} />
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
      <button className="login-button">Login</button>
    </>
  );
}

export default App;
