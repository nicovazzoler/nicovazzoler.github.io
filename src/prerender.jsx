import { renderToString } from "react-dom/server";
import datos from "../proyectos.json";
import { Pagina } from "./Pagina.jsx";

/** Cada página del sitio con su HTML ya armado, su título y su descripción. Lo usa prerender.mjs al compilar. */
export function paginas() {
  const portada = {
    carpeta: "",
    titulo: `Proyectos · ${datos.nombre}`,
    descripcion: "Herramientas armadas para problemas reales: capturas, qué resuelven, con qué están hechas y su código.",
    html: renderToString(<Pagina carpeta={undefined} />),
  };
  return [portada, ...datos.proyectos.map((p) => ({
    carpeta: p.carpeta,
    titulo: `${p.titulo} · ${datos.nombre}`,
    descripcion: p.bajada,
    html: renderToString(<Pagina carpeta={p.carpeta} />),
  }))];
}
