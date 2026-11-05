// La clave es el "emblema" del tema de cada proyecto en proyectos.json.

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

function IconoVela({ tamano = 26 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5 C14.2 5 14.6 6.8 12 8.8 C9.4 6.8 9.8 5 12 2.5 Z" />
      <line x1="12" y1="8.8" x2="12" y2="11" />
      <rect x="7.5" y="11" width="9" height="10.5" rx="1.2" />
    </svg>
  );
}

function MarcaVela({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="0.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M32 3 C37.5 9.5 38.5 13.5 32 18.5 C25.5 13.5 26.5 9.5 32 3 Z" />
      <path d="M32 9 C34.2 11.6 34.4 13.2 32 15.2 C29.6 13.2 29.8 11.6 32 9 Z" />
      <line x1="32" y1="18.5" x2="32" y2="23" />
      <path d="M22 44 V25 Q22 23 24 23 H40 Q42 23 42 25 V44" />
      <path d="M22 28 Q25 31 27 28 T32 29 T37 28 T42 29" />
      <line x1="12" y1="44" x2="52" y2="44" />
    </svg>
  );
}

export const EMBLEMAS = {
  corona: { Icono: IconoCorona, Marca: MarcaCorona },
  terminal: { Icono: IconoTerminal, Marca: MarcaTerminal },
  vela: { Icono: IconoVela, Marca: MarcaVela },
};

export function emblemaDe(tema) {
  return EMBLEMAS[tema.emblema] ?? EMBLEMAS.terminal;
}
