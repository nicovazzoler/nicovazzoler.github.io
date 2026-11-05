import { useEffect } from "react";
import { emblemaDe } from "./emblemas.jsx";
import { Robot } from "./iconos.jsx";
import { RobotPiezas } from "./RobotPiezas.jsx";
import { CENTRO, temaDe, variables } from "./tema.js";

/** Un proyecto con su captura al lado y sus colores: lleva a su vitrina. */
function Tarjeta({ proyecto }) {
  const tema = temaDe(proyecto);
  const { Icono, Marca } = emblemaDe(tema);
  const dato = [proyecto.anio, proyecto.estado].filter(Boolean).join(" · ");
  return (
    <a href={`/${proyecto.carpeta}/`} className="tarjeta-vitrina tema aparece" style={variables(tema)}>
      <div className="imagen-vitrina">
        {proyecto.captura
          ? <img src={`/capturas/${proyecto.carpeta}/${proyecto.captura.archivo}`} alt={proyecto.captura.texto} loading="lazy" />
          : <div className="sin-captura"><Marca className="marca" /><span>{proyecto.titulo}</span></div>}
      </div>
      <div className="texto-vitrina">
        <div className="fila-arriba">
          <span className="emblema"><Icono /></span>
          {dato && <span className="estado">{dato}</span>}
        </div>
        <div className="fila-abajo">
          <h3 className="nombre">{proyecto.titulo}</h3>
          <p className="tenue">{proyecto.bajada}</p>
          {proyecto.stack.length > 0 && (
            <ul className="chips" aria-label="Tecnologías">
              {proyecto.stack.map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
          )}
          <span className="ver">Ver el proyecto →</span>
        </div>
      </div>
    </a>
  );
}

export function Portada({ datos }) {
  useEffect(() => { document.title = `Proyectos · ${datos.nombre}`; }, []);
  return (
    <div className="inicio puntos tema" style={variables(CENTRO)}>
      <div className="contenedor">
        <header className="cabecera-centro">
          <span className="logo"><Robot className="acento" /><span>{datos.nombre}</span></span>
        </header>

        <section className="heroe">
          <div className="heroe-texto">
            <span className="rotulo">01 / Vitrina</span>
            <h1>Proyectos,<br /><span className="acento">explicados.</span></h1>
            <p>
              Herramientas armadas para problemas reales. Cada una con capturas, qué resuelve, con qué está hecha y
              su código.
            </p>
            <div className="botones">
              <a href="#proyectos" className="boton-principal">Ver proyectos</a>
            </div>
          </div>
          <div className="heroe-dibujo"><RobotPiezas proyectos={datos.proyectos} /></div>
        </section>

        <section id="proyectos" className="bloque">
          <div className="titulo-bloque">
            <div>
              <span className="rotulo">02 / Proyectos</span>
              <h2>Lo que armé</h2>
            </div>
          </div>
          <div className="lista-vitrinas">
            {datos.proyectos.map((p) => <Tarjeta key={p.carpeta} proyecto={{ ...p, captura: p.capturas[0] }} />)}
          </div>
        </section>

        <footer className="pie-portfolio">
          <b>{datos.nombre}</b>
          {datos.enlaces.length > 0 && (
            <nav aria-label="Enlaces">
              {datos.enlaces.map((e) => <a key={e.url} href={e.url} target="_blank" rel="me noopener">{e.texto}</a>)}
            </nav>
          )}
        </footer>
      </div>
    </div>
  );
}
