import { CENTRO } from "./tema.js";

const CUERPO = { x: 116, y: 278, ancho: 168, alto: 132, separacion: 6 };

/** Columnas y filas para repartir n bloques en el cuerpo: hasta 3 en fila, 4 en cuadrado. */
function grilla(n) {
  const columnas = n <= 3 ? Math.max(n, 1) : n === 4 ? 2 : 3;
  return { columnas, filas: Math.ceil(Math.max(n, 1) / columnas) };
}

function Bloque({ x, y, ancho, alto, color, indice }) {
  const raya = (dy, largo) => (
    <rect x={x + 12} y={y + dy} width={Math.max(ancho * largo - 24, 8)} height="4" rx="2" fill="#000" opacity="0.32" />
  );
  return (
    <g>
      <rect x={x} y={y} width={ancho} height={alto} fill={color} filter="url(#grano-robot)" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 16 + i * 12} cy={y + 18} r="3.5" fill="#000" opacity="0.32" />
      ))}
      {raya(34, 0.9)}
      {alto >= 56 && raya(46, indice % 2 ? 0.55 : 0.7)}
      {alto > 70 && raya(58, indice % 2 ? 0.75 : 0.45)}
    </g>
  );
}

/** El robot del centro con el cuerpo armado por un bloque de color por proyecto. */
export function RobotPiezas({ proyectos }) {
  const { columnas, filas } = grilla(proyectos.length);
  const { x, y, ancho, alto, separacion } = CUERPO;
  const anchoBloque = (ancho - separacion * (columnas - 1)) / columnas;
  const altoBloque = (alto - separacion * (filas - 1)) / filas;
  const colores = proyectos.length ? proyectos.map((p) => p.tema?.acento ?? CENTRO.acento) : [CENTRO.acento];
  const lugar = (i) => ({
    x: x + (i % columnas) * (anchoBloque + separacion), y: y + Math.floor(i / columnas) * (altoBloque + separacion),
  });
  const libres = Array.from({ length: columnas * filas - colores.length }, (_, i) => lugar(colores.length + i));
  return (
    <svg className="robot-grande" width="400" height="460" viewBox="0 0 400 460" fill="none"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <defs>
        {/* Grano de papel impreso: ruido gris aclarado y multiplicado sobre el color de cada pieza. */}
        <filter id="grano-robot" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" result="ruido" />
          <feColorMatrix in="ruido" type="saturate" values="0" result="gris" />
          <feComponentTransfer in="gris" result="suave">
            <feFuncR type="linear" slope="0.55" intercept="0.56" />
            <feFuncG type="linear" slope="0.55" intercept="0.56" />
            <feFuncB type="linear" slope="0.55" intercept="0.56" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="suave" mode="multiply" result="mezcla" />
          <feComposite in="mezcla" in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id="cuerpo-robot"><rect x={x} y={y} width={ancho} height={alto} rx="32" /></clipPath>
      </defs>

      <circle cx="200" cy="230" r="196" stroke="#1F1F23" strokeWidth="1" />
      <circle cx="200" cy="230" r="150" stroke="#1F1F23" strokeWidth="1" strokeDasharray="4 8" />
      <g stroke="var(--acento)" strokeWidth="1" opacity="0.5">
        <path d="M116 300 H 40" />
        <path d="M284 300 H 360" />
        <path d="M200 48 V 20" />
      </g>
      <g fill="var(--acento)">
        <circle cx="40" cy="300" r="4" />
        <circle cx="360" cy="300" r="4" />
        <circle className="antena" cx="200" cy="40" r="9" />
      </g>

      <line x1="200" y1="48" x2="200" y2="96" stroke="var(--texto)" strokeWidth="3" />
      <rect x="96" y="96" width="208" height="160" rx="44" fill="#E7E1D2" filter="url(#grano-robot)" />
      <rect x="124" y="136" width="152" height="70" rx="35" fill="var(--fondo)" />
      <g stroke="#E7E1D2" strokeWidth="3">
        <line x1="84" y1="160" x2="96" y2="160" />
        <line x1="304" y1="160" x2="316" y2="160" />
      </g>
      <circle className="ojo" cx="168" cy="171" r="11" fill="var(--acento)" />
      <circle className="ojo" cx="232" cy="171" r="11" fill="var(--acento)" />
      <path d="M186 226 Q 200 236 214 226" stroke="#3A3A3A" strokeWidth="3" />
      <rect x="176" y="256" width="48" height="22" rx="6" fill="#3A3A40" />

      <g clipPath="url(#cuerpo-robot)">
        {colores.map((color, i) => (
          <Bloque key={i} indice={i} color={color} ancho={anchoBloque} alto={altoBloque} {...lugar(i)} />
        ))}
        {/* El hueco que queda en la última fila es el lugar del próximo proyecto. */}
        {libres.map((l, i) => (
          <rect key={`libre-${i}`} x={l.x + 3} y={l.y + 3} width={anchoBloque - 6} height={altoBloque - 6} rx="4"
            stroke="#5A5A60" strokeWidth="2" strokeDasharray="6 5" />
        ))}
      </g>

      <g stroke="var(--texto)" strokeWidth="3">
        <path d="M116 312 C 80 320, 70 350, 82 384" />
        <path d="M284 312 C 320 320, 330 350, 318 384" />
      </g>
      <circle cx="80" cy="392" r="10" fill={colores[0]} />
      <circle cx="320" cy="392" r="10" fill={colores[colores.length - 1]} />
    </svg>
  );
}
