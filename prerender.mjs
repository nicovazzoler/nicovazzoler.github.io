// Después de `vite build`: escribe cada página con su contenido ya en el HTML, así se lee sin JavaScript
// (buscadores, la vista previa de un link en LinkedIn o WhatsApp, lectores de pantalla).
// GitHub Pages sirve /<carpeta>/index.html, por eso cada proyecto lleva su propia página.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const { paginas } = await import("./dist-ssr/prerender.js");
const plantilla = readFileSync("dist/index.html", "utf8");
const escapar = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// La 404 va sin armar: una dirección mal escrita la resuelve el navegador y cae en la portada.
writeFileSync("dist/404.html", plantilla);

for (const { carpeta, titulo, descripcion, html } of paginas()) {
  const pagina = plantilla
    // Con funciones y no con texto: así un "$" del contenido (US$ 2) no se toma como patrón de reemplazo.
    .replace(/<title>.*?<\/title>/, () => `<title>${escapar(titulo)}</title>`)
    .replace(/<meta name="description" content=".*?">/, () => `<meta name="description" content="${escapar(descripcion)}">`)
    .replace('<div id="raiz"></div>', () => `<div id="raiz">${html}</div>`);
  const destino = carpeta ? `dist/${carpeta}` : "dist";
  mkdirSync(destino, { recursive: true });
  writeFileSync(`${destino}/index.html`, pagina);
}

rmSync("dist-ssr", { recursive: true, force: true });
