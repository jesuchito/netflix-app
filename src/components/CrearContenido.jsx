import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdministrarVistas.css";
import API_CONFIG from "../config/api";

function CrearContenido() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const navigate = useNavigate();

  const agregarContenido = async () => {
    if (!titulo.trim() || !descripcion.trim() || !imagen.trim()) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    const contenido = {
      titulo,
      descripcion,
      imagen,
    };

    try {
      const respuesta = await fetch(`${API_CONFIG.CONTENIDOS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contenido),
      });

      if (respuesta.ok) {
        console.log("Contenido creado con éxito.");
        navigate("/"); // Regresar a la página principal después de crear el contenido
      } else {
        console.error("Error al crear el contenido.");
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error);
    }
  };

  return (
    <div>
      <div className="editarVista">
        <h4>Crear Contenido</h4>
        <div>
          <label>Título:</label>
          <input
            type="text"
            onChange={(e) => setTitulo(e.target.value)}
            value={titulo}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            onChange={(e) => setDescripcion(e.target.value)}
            value={descripcion}
          />
        </div>

        <div className="botonesEdicion">
          <button onClick={agregarContenido}>Crear</button>
        </div>
      </div>
    </div>
  );
}

export default CrearContenido;
