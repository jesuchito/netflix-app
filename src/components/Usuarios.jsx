import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioBox from "./UsuarioBox";
import AgregarUsuario from "./AgregarUsuario";
import AdministrarUsuarios from "./AdministrarUsuarios";
import "../styles/Usuarios.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import API_CONFIG from "../config/api";

function Usuarios({ setUsuarioSeleccionado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarAdministrarUsuarios, setMostrarAdministrarUsuarios] =
    useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes dinámicos
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar usuarios desde la API
    fetch(API_CONFIG.USUARIOS)
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error fetching usuarios:", error));
  }, []);

  const handleMostrarMensaje = (texto) => {
    setMensaje(texto); // Actualiza el texto del mensaje
    setMostrarMensaje(true); // Muestra el mensaje
    setFadeOut(false); // Reinicia la animación

    // Inicia el fade-out después de 2 segundos
    setTimeout(() => {
      setFadeOut(true);
    }, 2000);
  };

  useEffect(() => {
    if (fadeOut) {
      // Ocultar el mensaje después de que termine el fade-out
      const timer = setTimeout(() => {
        setMostrarMensaje(false);
      }, 2000); // Tiempo de espera adicional para completar la animación
      return () => clearTimeout(timer); // Limpiar el timer
    }
  }, [fadeOut]);

  const agregarNuevoUsuario = (usuario) => {
    setUsuarios((prevUsuarios) => [...prevUsuarios, usuario]); // Agregar el nuevo usuario a la lista
    setMostrarFormulario(false); // Cerrar el formulario
    handleMostrarMensaje(`Usuario ${usuario.nombre} creado con éxito.`); // Mostrar mensaje de éxito
  };

  const manejarSeleccionUsuario = async (usuario) => {
    handleMostrarMensaje(`Usuario seleccionado: ${usuario.nombre}`); // Mostrar mensaje de selección
    try {
      const respuesta = await fetch(
        `${API_CONFIG.USUARIOS}/${usuario.idusuario}/Login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        }
      );

      if (respuesta.ok) {
        setUsuarioSeleccionado(usuario)
        localStorage.setItem("usuarioSeleccionado", JSON.stringify(usuario));
        console.log("Sesión de usuario iniciada con éxito.");
      } else {
        console.error("Error al iniciar sesión del usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud Post:", error);
    }
    navigate("/", { replace: true })
  };

  return (
    <div className="contenedor">
      <div className="usuarios">
        <h2 className="titulo">¿Quién eres? Elige tu usuario</h2>
        <div className="perfiles">
          {usuarios.length > 0 && usuarios.map((usuario) => (
            <div
              key={usuario.idUsuario}
              onClick={() => manejarSeleccionUsuario(usuario)}
            >
              <UsuarioBox usuario={usuario} />
            </div>
          ))}
          <div
            className="botonAgregar"
            onClick={() => setMostrarFormulario(true)}
          >
            <i className="bi bi-plus-square-fill"></i>
            <p>Agregar Usuario</p>
          </div>
        </div>
        <button
          className="botonAdministrar"
          onClick={() => setMostrarAdministrarUsuarios(true)}
        >
          Administrar Usuarios
        </button>
        {mostrarAdministrarUsuarios && (
          <div className="overlay">
            <AdministrarUsuarios
              setMostrarAdministrarUsuarios={setMostrarAdministrarUsuarios}
              mostrarMensaje={handleMostrarMensaje} // Pasa la función para mostrar mensajes
              actualizarUsuarios={setUsuarios} // Pasa el setter para actualizar la lista
              usuarios={usuarios} // Pasa la lista actual de usuarios              
            />
          </div>
        )}
      </div>

      {mostrarMensaje && (
        <div className={`overlayMensaje ${fadeOut ? "fadeOut" : ""}`}>
          <p>{mensaje}</p>
        </div>
      )}

      {mostrarFormulario && (
        <div className="overlay">
          <AgregarUsuario
            setMostrarFormulario={setMostrarFormulario}
            actualizarUsuarios={agregarNuevoUsuario}
          />
        </div>
      )}
    </div>
  );
}

export default Usuarios;
