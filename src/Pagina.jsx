import { StrictMode } from "react";
import datos from "../proyectos.json";
import { Portada } from "./Portada.jsx";
import { PaginaProyecto } from "./Proyecto.jsx";

/** La página que va en cada carpeta: /salon-ivana/ es ese proyecto, / (o cualquier otra) es la portada. */
export function Pagina({ carpeta }) {
  const proyecto = datos.proyectos.find((p) => p.carpeta === carpeta);
  return (
    <StrictMode>
      {proyecto ? <PaginaProyecto proyecto={proyecto} nombre={datos.nombre} /> : <Portada datos={datos} />}
    </StrictMode>
  );
}
