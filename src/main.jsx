import { createRoot, hydrateRoot } from "react-dom/client";
import { Pagina } from "./Pagina.jsx";
import "./base.css";
import "./proyecto.css";

// La carpeta de la dirección dice qué página es: /salon-ivana/ es ese proyecto, / es la portada.
const carpeta = window.location.pathname.split("/").filter(Boolean)[0];
const raiz = document.getElementById("raiz");

// Las páginas llegan ya armadas en HTML (ver prerender.mjs): React solo las retoma. La 404 llega vacía y se arma acá.
if (raiz.hasChildNodes()) hydrateRoot(raiz, <Pagina carpeta={carpeta} />);
else createRoot(raiz).render(<Pagina carpeta={carpeta} />);
