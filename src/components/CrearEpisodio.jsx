import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import API_CONFIG from "../config/api";
import "../styles/CrearEpisodio.css";

function CrearEpisodio() {
    const location = useLocation();
    const { contenido, nTemporada } = location.state || {};
    const [titulo, setTitulo] = useState("");
    const [numero, setNumero] = useState("");
    const [duracion, setDuracion] = useState("");
    const navigate = useNavigate();
    
    const handleCrearEpisodio = async () => {
        if ( !titulo.trim() || !duracion.trim() || !numero.trim()) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        const episodio = {
            titulo,
            duracion: parseInt(duracion, 10), // Convertir duración a número
            numero:  parseInt(numero, 10)
        };

        try {
            const respuesta = await fetch(`${API_CONFIG.CONTENIDOS}/${contenido.id_contenido}/${nTemporada}/ListaEpisodios`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(episodio),
            });
      
            if (respuesta.ok) {
              console.log("Episodio creado con éxito.");
              navigate("/"); // Regresar a la página principal después de crear el contenido
            } else {
              const errorData = await respuesta.json();
              console.error("Error al crear el episodio:", errorData);
            }
          } catch (error) {
            console.error("Error en la solicitud POST:", error);
          }
    }

    return (
        <div className="crearEpisodio">
            <h4>Crear Episodio</h4>
            <div>
                <label>Serie: {contenido.titulo}</label>
            </div>
            <div>
                <label>Temporada: {nTemporada}</label>
            </div>
            <div>
                <label>Número:</label>
                <input
                    type="number"
                    onChange={(e) => setNumero(e.target.value)}
                    value={numero}
                    min="1"
                />
            </div>
            <div>
                <label>Título:</label>
                <input
                    type="text"
                    onChange={(e) => setTitulo(e.target.value)}
                    value={titulo}
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
            <div className="botonesEdicion">
                <button onClick={() => handleCrearEpisodio()}>Crear</button>
            </div>
        </div>
    );

}

export default CrearEpisodio;