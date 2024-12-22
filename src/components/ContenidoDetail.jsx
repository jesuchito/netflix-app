import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ContenidoDetail.css";
import Reproductor from "./Reproductor";
import API_CONFIG from "../config/api";
import { FaHeart, FaTrash } from "react-icons/fa";

function ContenidoDetail({ setUsuarioSeleccionado }) {
  const { state } = useLocation();
  const contenido = state?.contenido;
  const [error,setError] = useState(null);
  const [mostrarTemporadas, setMostrarTemporadas] = React.useState(false);
  const [temporadas, setTemporadas] = useState([]);
  const [cargandoTemporadas, setCargandoTemporadas] = useState(false);
  const [mostrarEpisodios, setMostrarEpisodios] = React.useState(false);
  const [episodios, setEpisodios] = useState([]);
  const [cargandoEpisodios, setCargandoEpisodios] = useState(false);
  const [usuarioSeleccionado] = useState(
    JSON.parse(localStorage.getItem("usuarioSeleccionado"))
  );
  const [isFavorito, setIsFavorito] = useState(false);
  const navigate = useNavigate();
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  useEffect(() => {
    if (usuarioSeleccionado && contenido) {
      setIsFavorito(
        usuarioSeleccionado.contenidosfavoritos.includes(contenido.id_contenido)
      );
    }
  }, [usuarioSeleccionado, contenido]);

  const handleFavorito = async () => {
    if (isFavorito) {
      await eliminarFavorito();
    } else {
      await addFavorito();
    }
  };

  const addFavorito = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.USUARIOS}/${usuarioSeleccionado.idusuario}/${contenido.id_contenido}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioSeleccionado),
        }
      );
      if (response.status === 200) {
        setIsFavorito(true);
        // Actualizar contenidosFavoritos en usuarioSeleccionado
        setUsuarioSeleccionado(usuarioSeleccionado);
        localStorage.setItem(
          "usuarioSeleccionado",
          JSON.stringify({
            ...usuarioSeleccionado,
            contenidosfavoritos: [
              ...usuarioSeleccionado.contenidosfavoritos,
              contenido.id_contenido,
            ],
          })
        );
      }
    } catch (error) {
      console.error("Error al añadir a favoritos:", error);
      setError("No se pudo añadir a favoritos");
    }
  };

  const eliminarFavorito = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.USUARIOS}/${usuarioSeleccionado.idusuario}/${contenido.id_contenido}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        setIsFavorito(false);
        // Actualizar contenidosFavoritos en usuarioSeleccionado
        setUsuarioSeleccionado(usuarioSeleccionado);
        localStorage.setItem(
          "usuarioSeleccionado",
          JSON.stringify({
            ...usuarioSeleccionado,
            contenidosfavoritos: usuarioSeleccionado.contenidosfavoritos.filter(
              (id) => id !== contenido.id_contenido
            ),
          })
        );
      }
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
      setError("No se pudo eliminar de favoritos");
    }
  };

  const handleShowTemporadas = async (id_contenido) => {
    if (mostrarTemporadas) {
      setMostrarTemporadas(false);
      return;
    } else {
      if (temporadas.length > 0) {
        setMostrarTemporadas(true);
        return;
      }
      setCargandoTemporadas(true);
      setError(null);

      cargarTemporadas(id_contenido);

    }
  };

  const cargarTemporadas = async (id_contenido) => {
    try {
      const respuesta = await axios.get(
        `${API_CONFIG.CONTENIDOS}/${id_contenido}/Temporadas`
      );
      setTemporadas(respuesta.data);
      setMostrarTemporadas(true);
    } catch (err) {
      setError("Error al cargar las temporadas");
    } finally {
      setCargandoTemporadas(false);
    }
  };

  const handleShowEpisodios = async (id_contenido, numero) => {
    if (mostrarEpisodios[numero])
      setMostrarEpisodios((prevState) => ({
        ...prevState,
        [numero]: false,
      }));
    else {
      if (episodios[numero]?.length > 0) {
        setMostrarEpisodios((prevState) => ({
          ...prevState,
          [numero]: true,
        }));
        return;
      }
      setCargandoEpisodios(true);
      setError(null);

      try {
        const respuesta = await axios.get(
          `${API_CONFIG.CONTENIDOS}/${id_contenido}/${numero}/ListaEpisodios`
        );
        setEpisodios((prevState) => ({
          ...prevState,
          [numero]: respuesta.data, // Agregar episodios solo para esta temporada
        }));
        setMostrarEpisodios((prevState) => ({
          ...prevState,
          [numero]: true,
        }));
      } catch (err) {
        setError("Error al cargar los episodios");
      } finally {
        setCargandoEpisodios(false);
      }
    }
  };

  const handleCrearTemporada = async (id_contenido) => {
    const numT = (temporadas.length + 1);
    const temporada = {
      Temporada: numT
    };

    try {
      const respuesta = await fetch(
        `${API_CONFIG.CONTENIDOS}/${id_contenido}/Temporadas`,
        {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(temporada),}
      );
      if (respuesta.ok) {
        console.log("Temporada creada con éxito.");
        cargarTemporadas(id_contenido);
      } else {
      console.error("Error al crear la temporada.");
      }
    } catch (err) {
      setError("Error al cargar las temporadas");
    } finally {
      setCargandoTemporadas(false);
    }
  };

  const handleCrearEpisodio = async (temporada) => {
    navigate(`/contenido/${contenido.id}/crearEpisodio`, {
      state: { contenido: contenido, nTemporada: temporada.numero },
    });
  };

  const handleEliminarContenido = async () => {
    try {
      const respuesta = await fetch(`${API_CONFIG.CONTENIDOS}/${contenido.id_contenido}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        const errorMensaje = await respuesta.text();
        throw new Error(`Error del servidor: ${errorMensaje}`);
      }
      console.log("Contenido eliminado con éxito:", contenido.id_contenido);
      setMostrarEliminar(false);
      navigate("/", { state: { reload: true } });
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleEditarContenido = async () => {
    navigate(`/contenido/${contenido.id}/editar`, {
      state: { contenido: contenido },
    });
  };

  // Unconditionally define the state
  const [showReproductor, setShowReproductor] = React.useState(false);

  if (!contenido) {
    // Render an error message if contenido is null
    return <p>Error: No se encontró el contenido</p>;
  }

  //const isSerie = contenido.tipo.toLowerCase() === "serie";

  const handleReproducir = () => {
    setShowReproductor(true);
  };

  const handleCerrarReproductor = () => {
    setShowReproductor(false);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="contenido-container">
      <div className="contenido">
        <div className="contenido-detail-image">
          <img src={`/assets/img/${contenido.imagen}`} alt={contenido.titulo} />
        </div>
        <div className="contenido-info">
          <div className="contenido-data">
            <h1>{contenido.titulo}</h1>
            {usuarioSeleccionado ? (
              <div className="Like">
                <div>
                <FaHeart
                  size={45}
                  color={isFavorito ? "white" : "gray"} // Cambia el color según el estado
                  onClick={handleFavorito} // Llama a la función correspondiente
                  style={{ cursor: "pointer" }} // Cambia el cursor para indicar que es clickeable
                />
                </div>
                {usuarioSeleccionado.rol === "administrador" ? (
                  <div>
                    <FaTrash
                      size={45}
                      color={"gray"}
                      onClick={() => setMostrarEliminar(true)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ) : null}
                {usuarioSeleccionado.rol === "administrador" ? (
                  <div>
                    <button className="boton-oscuro" onClick={() => handleEditarContenido()}>Editar</button>
                  </div>
                ) : null}
              </div>
            ) : (
              <p>inicia sesion para poder añadir a favoritos</p>
            )}
          </div>
          <h2>
            {contenido.tipo.charAt(0).toUpperCase() + contenido.tipo.slice(1)}
          </h2>
          <p>
            <strong>Sinopsis:</strong> {contenido.sinopsis}
          </p>
          <p>
            <strong>Director:</strong> {contenido.director}
          </p>
          <p>
            <strong>Elenco:</strong> {contenido.elenco}
          </p>
          <p>
            <strong>Duración:</strong> {contenido.duracion} min
          </p>
          <p>
            <strong>Género:</strong>{" "}
            {contenido.genero.charAt(0).toUpperCase() +
              contenido.genero.slice(1)}
          </p>
        </div>
        <div className="contenido-actions">
          {contenido.tipo.toLowerCase() === "serie" ? (
            <button
              className="contenido-button temporadas"
              onClick={() => handleShowTemporadas(contenido.id_contenido)}
            >
              {mostrarTemporadas ? "Ocultar Temporadas" : "Ver Temporadas"}
            </button>
          ) : (
            <button
              className="contenido-button play"
              onClick={handleReproducir}
            >
              Reproducir Contenido
            </button>
          )}
        </div>

        <div>
          {mostrarTemporadas ? (
            <div>
              {cargandoTemporadas && <p>Cargando temporadas...</p>}
              {mostrarTemporadas && (
                <div>
                  {temporadas && temporadas.length > 0 ? (
                    temporadas.map((temporada) => (
                      <div key={temporada.idtemporada}>
                        <div className="contenido-temporadas">
                          <h3>Temporada {temporada.numero}</h3>
                          <button
                            className="contenido-button episodios"
                            onClick={() =>
                              handleShowEpisodios(
                                contenido.id_contenido,
                                temporada.numero
                              )
                            }
                          >
                            {mostrarEpisodios[temporada.numero]
                              ? "Ocultar Episodios"
                              : "Ver Episodios"}
                          </button>
                        </div>
                        {mostrarEpisodios[temporada.numero] ? (
                          <div>
                            {cargandoEpisodios && <p>Cargando episodios...</p>}
                            {mostrarEpisodios[temporada.numero] && (
                              <div className="contenido-episodios">
                                {episodios[temporada.numero] &&
                                episodios[temporada.numero].length > 0 ? (
                                  episodios[temporada.numero].map(
                                    (episodio) => (
                                      <div
                                        key={episodio.id_episodio}
                                        className="contenido-episodios-box"
                                        onClick={handleReproducir}
                                      >
                                        <div className="contenido-episodio-image">
                                          <img
                                            src={`/assets/img/${contenido.imagen}`}
                                            alt={`${contenido.imagen}`}
                                          />
                                        </div>
                                        <div className="contenido-episodios-box-info">
                                          <div className="info-ep-titulo">
                                            <p>{episodio.titulo}</p>
                                          </div>
                                          <div className="info-ep">
                                            <p>{episodio.numero}</p>
                                            <p>{episodio.duracion} min</p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <span className="contenido-vacio">
                                    Aún no hay episodios
                                  </span>
                                )}
                              </div>
                            )}
                            {usuarioSeleccionado &&
                            usuarioSeleccionado.rol === "administrador" && (
                              <button className="contenido-button crear" onClick={() => handleCrearEpisodio(temporada)}>
                                Añadir Episodio
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <span className="contenido-vacio">
                      Aún no hay temporadas
                    </span>
                  )}
                </div>
              )}
              {usuarioSeleccionado &&
              usuarioSeleccionado.rol === "administrador" && (
              <button className="contenido-button crear" onClick={() => handleCrearTemporada(contenido.id_contenido)}>
                Añadir temporada
              </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {showReproductor && (
        <div className="overlay">
          <Reproductor
            contenido={contenido}
            onClose={handleCerrarReproductor}
          />
        </div>
      )}

      {mostrarEliminar && (
        <div className="overlay">
          <div className="dialogo-eliminar">
            <h2>{contenido.titulo} se borrará para siempre</h2>
            <h2>¿Eliminar?</h2>
            <div>
              <button className="boton-oscuro" onClick={() => handleEliminarContenido()}>Si</button>
              <button className="boton-oscuro" onClick={() => setMostrarEliminar(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContenidoDetail;
