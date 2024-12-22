import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import API_CONFIG from "../config/api";
import "../styles/CrearEpisodio.css";
import React from "react";

function EditarContenido() {
    const location = useLocation();
    const { contenido } = location.state || {};
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState("");
    const [genero, setGenero] = useState("");
    const [sinopsis, setSinopsis] = useState("");
    const [duracion, setDuracion] = useState("");
    const [director, setDirector] = useState("");
    const [elenco, setElenco] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (contenido) {
          setTitulo(contenido.titulo);
          setTipo(contenido.tipo);
          setGenero(contenido.genero);
          setSinopsis(contenido.sinopsis);
          setDuracion(contenido.duracion);
          setDirector(contenido.director);
          setElenco(contenido.elenco);
        }
      }, [contenido]);

    const tiposDisponibles = ["serie", "pelicula", "corto", "documental"];
    const generosDisponibles = [
      "horror",
      "aventura",
      "comedia",
      "thriller",
      "drama",
      "romance",
      "fantasia",
      "ciencia ficcion",
    ];
    
    const handleEditarContenido = async () => {
        if (
            !titulo.trim() ||
            !tipo ||
            !genero ||
            !sinopsis.trim() ||
            !duracion ||
            !director.trim() ||
            !elenco.trim()
          ) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (sinopsis.length > 80) {
            console.error("La sinopsis no puede tener más de 80 caracteres.");
            return;
        }

        const update = {
            titulo,
            tipo,
            sinopsis,
            duracion: parseInt(duracion, 10), // Convertir duración a número
            genero,
            director,
            elenco,
            imagen: contenido.imagen, 
          };

        try {
            const respuesta = await fetch(`${API_CONFIG.CONTENIDOS}/${contenido.id_contenido}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(update),
            });
      
            if (respuesta.ok) {
              console.log("Contenido actualizado con éxito.");
              navigate("/", { state: { reload: true } });
            } else {
              const errorData = await respuesta.json();
              console.error("Error al actualizar el contenido:", errorData);
            }
          } catch (error) {
            console.error("Error en la solicitud PUT:", error);
          }
    }

    return (
        <div className="crearEpisodio">
            <h4>Actualizar Contenido</h4>
            <div>
                <label>Título:</label>
                <input
                    type="text"
                    onChange={(e) => setTitulo(e.target.value)}
                    value={titulo}
                />
            </div>
            <div className="selector">
            <label>Tipo:</label>
            <select onChange={(e) => setTipo(e.target.value)} value={tipo}>
                <option value="">Selecciona un tipo</option>
                {tiposDisponibles.map((tipo) => (
                <option key={tipo} value={tipo}>
                    {tipo}
                </option>
                ))}
            </select>
            </div>
            <div className="selector">
            <label>Género:</label>
            <select onChange={(e) => setGenero(e.target.value)} value={genero}>
                <option value="">Selecciona un género</option>
                {generosDisponibles.map((genero) => (
                <option key={genero} value={genero}>
                    {genero}
                </option>
                ))}
            </select>
            </div>
            <div className="sinopsis">
            <label>Sinopsis:</label>
            <textarea
                onChange={(e) => setSinopsis(e.target.value)}
                value={sinopsis}
                maxLength={80}
            />
            </div>
            <div>
            <label>Duración (en minutos):</label>
            <input
                type="number"
                onChange={(e) => setDuracion(e.target.value)}
                value={duracion}
                min="1"
            />
            </div>
            <div>
            <label>Director:</label>
            <input
                type="text"
                onChange={(e) => setDirector(e.target.value)}
                value={director}
            />
            </div>
            <div>
            <label>Elenco:</label>
            <input
                type="text"
                onChange={(e) => setElenco(e.target.value)}
                value={elenco}
            />
            </div>
            <div className="botonesEdicion">
                <button onClick={() => handleEditarContenido()}>Actualizar</button>
            </div>
        </div>
    );

}

export default EditarContenido;