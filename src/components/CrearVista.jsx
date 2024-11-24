import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdministrarVistas.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API_CONFIG from "../config/api";

function CrearVista({ cargarVistas }) {
    const [contenidos, setContenidos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [nuevosContenidos, setNuevosContenidos] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
          .get(API_CONFIG.CONTENIDOS)
          .then((response) => {
            setContenidos(response.data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }, []);

    const agregarVista = async () => {
        if (!nombre.trim() || nuevosContenidos.length === 0) {
            console.error("El nombre y al menos un contenido son obligatorios.");
            return;
          }

        const vista = {
            nombre: nombre,
            contenidos_ids: nuevosContenidos,
        };

        try {
            const respuesta = await fetch(
            `${API_CONFIG.VISTAS}`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(vista),
            }
            );

            if (respuesta.ok) {
            console.log("Vista creada con éxito.");
            cargarVistas();
            navigate("/");
            } else {
            console.error("Error al crear la vista.");
            }
        } catch (error) {
            console.error("Error en la solicitud POST:", error);
        }
    };

    const agregarContenido = (idContenido) => {
        // Evitar duplicados
        if (nuevosContenidos.includes(idContenido)) {
            console.log("El contenido ya está en la lista.");
            return;
        }
    
        setNuevosContenidos(prev => [...prev, idContenido]);
    };


    if (loading) return <p>Cargando contenidos...</p>;
    if (error) return <p>Error al cargar contenidos: {error}</p>;

    return (
        <div>
            <div className="editarVista">
                <h4>Crear Vista</h4>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contenidos de la vista:</label>
                    <div className="contenidosVista">
                        {contenidos.map((contenido, index) => (
                            <div key={contenido.id_contenido} className="contenidosVista-element" >
                                <div><img src={`/assets/img/${contenido.imagen}`} alt={`${contenido.imagen}`}/></div>
                                <div className="contenidosVista-element-titulo">{contenido.titulo}</div>
                                <button
                                    className="eliminarContenido-Button"
                                    onClick={() => agregarContenido(contenido.id_contenido)}
                                >
                                    Añadir
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="botonesEdicion">
                    <button onClick={agregarVista}>Crear</button>
                </div>
            </div>
        </div>
    );
}
export default CrearVista;