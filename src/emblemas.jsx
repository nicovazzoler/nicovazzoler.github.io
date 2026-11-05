// Las claves tienen que coincidir con temas.EMBLEMAS del servidor.

function IconoCorona({ tamano = 26 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18 L2 7 L8 12 L12 4 L16 12 L22 7 L21 18 Z" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  );
}

function MarcaCorona({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="0.8"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M6 40 L4 14 L18 26 L32 6 L46 26 L60 14 L58 40 Z" />
      <line x1="6" y1="44" x2="58" y2="44" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="32" cy="4" r="2" />
      <circle cx="60" cy="12" r="2" />
    </svg>
  );
}

function IconoTerminal({ tamano = 26 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="5 7 10 12 5 17" />
      <line x1="12" y1="18" x2="19" y2="18" />
    </svg>
  );
}

function MarcaTerminal({ className }) {
  return <div className={`${className} lineas-terminal`} aria-hidden="true" />;
}

export const EMBLEMAS = {
  corona: { Icono: IconoCorona, Marca: MarcaCorona, deFondo: true },
  terminal: { Icono: IconoTerminal, Marca: MarcaTerminal, deFondo: false },
};

export function emblemaDe(tema) {
  return EMBLEMAS[tema.emblema] ?? EMBLEMAS.terminal;
}
