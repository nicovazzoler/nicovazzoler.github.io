export const CENTRO = {
  fondo: "#0B0B0C",
  superficie: "#121214",
  borde: "#222226",
  acento: "#CBEF5B",
  texto: "#EDEBE6",
  texto2: "#B9B7B0",
  emblema: "terminal",
};

export function temaDe(proyecto) {
  return proyecto?.tema ?? CENTRO;
}

export function variables(tema) {
  return {
    "--fondo": tema.fondo,
    "--superficie": tema.superficie,
    "--borde": tema.borde,
    "--acento": tema.acento,
    "--texto": tema.texto,
    "--texto2": tema.texto2,
  };
}
