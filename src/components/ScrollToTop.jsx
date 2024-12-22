import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Obtiene la ruta actual

  useEffect(() => {
    window.scrollTo(0, 0); // Desplázate al inicio
  }, [pathname]); // Ejecutar cada vez que cambie la ruta

  return null; // No renderiza nada en la interfaz
};

export default ScrollToTop;
