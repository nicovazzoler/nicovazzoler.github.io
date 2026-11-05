import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import datos from "../proyectos.json";
import { Portada } from "./Portada.jsx";
import { PaginaProyecto } from "./Proyecto.jsx";
import "./base.css";
import "./proyecto.css";

// La carpeta de la dirección dice qué página es: /salon-ivana/ es ese proyecto, / es la portada.
const carpeta = window.location.pathname.split("/").filter(Boolean)[0];
const proyecto = datos.proyectos.find((p) => p.carpeta === carpeta);

createRoot(document.getElementById("raiz")).render(
  <StrictMode>
    {proyecto ? <PaginaProyecto proyecto={proyecto} nombre={datos.nombre} /> : <Portada datos={datos} />}
  </StrictMode>,
);
