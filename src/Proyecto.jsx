import { useEffect, useState } from "react";
import { emblemaDe } from "./emblemas.jsx";
import { variables } from "./tema.js";

const REPO_GITHUB = /^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/?$/;

function Grupo({ titulo, items }) {
  if (!items?.length) return null;
  return (
    <div className="ficha-grupo">
      <h3>{titulo}</h3>
      <ul>{items.map((s) => <li key={s}>{s}</li>)}</ul>
    </div>
  );
}

function IconoVolver() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5 L8 12 L15 19" />
    </svg>
  );
}

function IconoCodigo() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 7 L3 12 L8 17" />
      <path d="M16 7 L21 12 L16 17" />
      <path d="M13.5 4.5 L10.5 19.5" />
    </svg>
  );
}

/** Las capturas: una grande y las demás abajo para elegir, con las flechas del teclado también. */
function Escaparate({ carpeta, capturas, titulo, Marca }) {
  const [elegida, setElegida] = useState(0);
  if (!capturas.length) {
    return (
      <div className="escaparate">
        <div className="ficha-pantalla vacia">
          <Marca className="marca" />
          <p><b>{titulo}</b><span>Todavía sin capturas</span></p>
        </div>
      </div>
    );
  }
  const ruta = (c) => `/capturas/${carpeta}/${c.archivo}`;
  const actual = capturas[elegida];
  const mover = (e) => {
    const paso = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!paso) return;
    e.preventDefault();
    const nueva = (elegida + paso + capturas.length) % capturas.length;
    setElegida(nueva);
    e.currentTarget.querySelectorAll("button")[nueva]?.focus();
  };
  return (
    <div className="escaparate">
      <figure className="ficha-pantalla">
        <img key={actual.archivo} src={ruta(actual)} alt={actual.texto} />
      </figure>
      <p className="ficha-epigrafe" aria-live="polite">
        <span>{actual.texto}</span>
        {capturas.length > 1 && <span className="ficha-tenue">{elegida + 1} de {capturas.length}</span>}
      </p>
      {capturas.length > 1 && (
        <div className="ficha-miniaturas" role="group" aria-label="Elegí una captura" onKeyDown={mover}>
          {capturas.map((c, i) => (
            <button key={c.archivo} type="button" aria-pressed={i === elegida} aria-label={c.texto}
              onClick={() => setElegida(i)}>
              <img src={ruta(c)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** El apartado del código: el repositorio bien a la vista. */
function Codigo({ repo }) {
  if (!repo) return null;
  const github = REPO_GITHUB.exec(repo);
  return (
    <section className="ficha-codigo" aria-labelledby="titulo-codigo">
      <div className="ficha-repo">
        <span className="ficha-icono-codigo"><IconoCodigo /></span>
        <div>
          <h2 id="titulo-codigo">El código</h2>
          <p className="ficha-slug">{github ? github[1] : repo.replace(/^https:\/\//, "")}</p>
        </div>
        <a className="ficha-boton" href={repo} target="_blank" rel="noopener">{github ? "Abrir en GitHub" : "Abrir el repositorio"}</a>
      </div>
    </section>
  );
}

/** La página de un proyecto, en sus colores: qué es, cómo se ve, qué resuelve, con qué está hecho y el código. */
export function PaginaProyecto({ proyecto, nombre }) {
  const { Icono, Marca } = emblemaDe(proyecto.tema);
  const alAire = /uso|producci/i.test(proyecto.estado);
  const tecnica = proyecto.stack.length > 0 || proyecto.bibliotecas.length > 0;
  useEffect(() => { document.title = `${proyecto.titulo} · ${nombre}`; }, [proyecto, nombre]);

  return (
    <div className="ficha-pagina tema" style={variables(proyecto.tema)}>
      <header className="ficha-cabecera">
        <a className="ficha-volver" href="/"><IconoVolver /><span>{nombre}</span></a>
      </header>

      <main className="ficha-contenido">
        <section className="ficha-heroe">
          <span className="ficha-emblema"><Icono tamano={28} /></span>
          <h1>{proyecto.titulo}</h1>
          <p className="ficha-bajada">{proyecto.bajada}</p>
          {(proyecto.estado || proyecto.anio) && (
            <p className="ficha-meta">
              {proyecto.estado && <span className={alAire ? "ficha-estado al-aire" : "ficha-estado"}>{proyecto.estado}</span>}
              {proyecto.anio && <span>{proyecto.anio}</span>}
            </p>
          )}
        </section>

        <Escaparate carpeta={proyecto.carpeta} capturas={proyecto.capturas} titulo={proyecto.titulo} Marca={Marca} />

        {(proyecto.resuelve || tecnica) && (
          <div className="ficha-info">
            <div className="ficha-texto">
              {proyecto.resuelve && (
                <section>
                  <h2>Qué resuelve</h2>
                  <p>{proyecto.resuelve}</p>
                </section>
              )}
            </div>
            {tecnica && (
              <aside className="ficha-tecnica" aria-labelledby="titulo-tecnica">
                <h2 id="titulo-tecnica">Con qué está hecho</h2>
                <Grupo titulo="Stack" items={proyecto.stack} />
                <Grupo titulo="Bibliotecas" items={proyecto.bibliotecas} />
              </aside>
            )}
          </div>
        )}

        <Codigo repo={proyecto.repo} />
      </main>

      <footer className="ficha-pie">
        <a href="/">Ver todos los proyectos</a>
        <span className="ficha-tenue">{nombre}</span>
      </footer>
    </div>
  );
}
