// Arma dist/index.html pegando los trabajos de proyectos.json dentro de plantilla.html.
//
// Por qué existe: la portada es un archivo solo, y editar a mano cada <article>
// —con su color, sus diapositivas, el alto y el ancho de cada imagen— es la
// clase de tarea donde uno se equivoca en silencio. Acá el proyecto se declara
// una vez y el HTML sale solo.
//
// Lo que decide por su cuenta:
//   - qué capturas hay, leyendo la carpeta (orden alfabético = orden de las diapositivas)
//   - si una captura es de celular o de computadora, por su forma
//   - el alto y el ancho de cada imagen, para que la página no salte mientras carga
//   - el color del proyecto, si dice "auto", sacado de la propia captura
//
// Correr: npm run build
import { mkdir, readFile, readdir, writeFile, cp, access } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const RAIZ = new URL(".", import.meta.url).pathname;
const DIST = join(RAIZ, "dist");

const escapar = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const hay = (p) => access(p).then(() => true, () => false);

// "01-gastos-del-mes.webp" -> "Gastos del mes"
function pieDelNombre(archivo) {
  const base = archivo.replace(/\.[^.]+$/, "").replace(/^\d+[-_]/, "").replace(/[-_]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

// El color del proyecto, sacado de su primera captura.
//
// No sirve el color más repetido: en una pantalla de app oscura, eso es el
// fondo, y el acento quedaría negro. Se busca el color más vivo, agrupando por
// tono para que gane una familia y no un píxel suelto, y después se lo lleva a
// una claridad que funcione sobre el fondo oscuro de la página.
// Si menos de esta parte de la imagen tiene color de verdad, no hay acento que
// sacar: una captura de app oscura es casi toda gris, y dejar que el 1% decida
// el color de la marca da resultados que parecen elegidos al azar. Medido: la
// primera del Conciliador tiene 1,6% y de ahí salía un violeta que chocaba con
// el proyecto de al lado.
const MINIMO_VIVO = .03;

async function acentoDe(archivo) {
  const ancho = 48;
  const { data, info } = await sharp(archivo).resize(ancho, ancho, { fit: "inside" })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const cubos = new Map(); // tono (de a 30°) -> {peso, r, g, b}
  let vivos = 0, total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    total++;
    const [r, g, b] = [data[i] / 255, data[i + 1] / 255, data[i + 2] / 255];
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) continue;                       // gris puro: no aporta tono
    const s = l > .5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    if (s < .25 || l < .25 || l > .85) continue;     // apagado, muy oscuro o casi blanco
    vivos++;
    let h = max === r ? (g - b) / (max - min) + (g < b ? 6 : 0) : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
    h = (h * 60) % 360;
    // Pesa lo vivo y lo que está cerca de media luz, que es donde un acento se lee.
    const peso = s * (1 - Math.abs(l - .55) * 1.4);
    const k = Math.floor(h / 30);
    const c = cubos.get(k) ?? { peso: 0, r: 0, g: 0, b: 0 };
    c.peso += peso; c.r += r * peso; c.g += g * peso; c.b += b * peso;
    cubos.set(k, c);
  }
  if (!cubos.size || vivos / total < MINIMO_VIVO) {
    console.warn(`    la captura casi no tiene color (${(100 * vivos / total).toFixed(1)}% de la imagen): no saco acento de ahí`);
    return null;                                     // que decida el JSON
  }
  const mejor = [...cubos.values()].sort((a, b) => b.peso - a.peso)[0];
  // Promedio del cubo, subido a una saturación y una claridad fijas: así dos
  // capturas distintas del mismo proyecto no dan dos acentos distintos de brillo.
  const [r, g, b] = [mejor.r / mejor.peso, mejor.g / mejor.peso, mejor.b / mejor.peso];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = max === min ? 0 : max === r ? (g - b) / (max - min) + (g < b ? 6 : 0) : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
  return hsl((h * 60 + 360) % 360, .72, .66);
}

function hsl(h, s, l) {
  const c = (n) => {
    const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return "#" + [c(0), c(8), c(4)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// Las diapositivas de un proyecto: capturas de verdad, o maquetas dibujadas.
async function diapositivas(p) {
  if (Array.isArray(p.capturas)) {
    return p.capturas.map((c) => ({
      maqueta: c.maqueta,
      pie: c.pie ?? "",
    }));
  }
  const dir = join(RAIZ, "capturas", p.carpeta);
  if (!(await hay(dir))) {
    console.warn(`  ! ${p.carpeta}: dice "auto" pero no existe capturas/${p.carpeta}/`);
    return [];
  }
  const archivos = (await readdir(dir)).filter((f) => /\.(webp|png|jpe?g|avif)$/i.test(f)).sort();
  const salida = [];
  for (const archivo of archivos) {
    const { width, height } = await sharp(join(dir, archivo)).metadata();
    const extra = p.pies?.[archivo] ?? {};
    const pie = extra.pie ?? pieDelNombre(archivo);
    salida.push({
      src: `capturas/${p.carpeta}/${archivo}`,
      ancho: width, alto: height,
      // Más alta que ancha: es un celular, y se muestra como un teléfono
      // asomando desde abajo en vez de llenar la diapositiva.
      celu: height > width,
      pie,
      alt: extra.alt ?? `${pie} — ${p.titulo}`,
    });
  }
  return salida;
}

function slide(d, i) {
  if (d.maqueta) {
    return `              <figure class="slide"><svg aria-hidden="true"><use href="#${d.maqueta}"/></svg><figcaption>${escapar(d.pie)}</figcaption></figure>`;
  }
  // La primera no lleva loading=lazy: es la que se ve al llegar.
  const lazy = i === 0 ? "" : ' loading="lazy"';
  return `              <figure class="slide"><img class="foto${d.celu ? " celu" : ""}" src="${d.src}" alt="${escapar(d.alt)}" width="${d.ancho}" height="${d.alto}"${lazy}><figcaption>${escapar(d.pie)}</figcaption></figure>`;
}

function articulo(p, ds, acento) {
  const datos = (p.datos ?? []).map(([t, d]) => `              <dt>${escapar(t)}</dt><dd>${escapar(d)}</dd>`).join("\n");
  return `        <article class="proyecto revela" data-ambiente="${escapar(p.ambiente)}" style="--tinte:${acento}">
          <div class="galeria">
            <div class="carril" tabindex="0" aria-label="Capturas de ${escapar(p.titulo)}">
${ds.map(slide).join("\n")}
            </div>
            <div class="galeria-control"></div>
          </div>
          <div class="proyecto-texto">
            <p class="rubro">${escapar(p.rubro)}</p>
            <h3>${escapar(p.titulo)}</h3>
            <p class="estado"><i></i>${escapar(p.estado)}</p>
            <p class="proyecto-desc">${escapar(p.bajada)}</p>${datos ? `
            <dl class="datos">
${datos}
            </dl>` : ""}
          </div>
        </article>`;
}

const plantilla = await readFile(join(RAIZ, "plantilla.html"), "utf8");
const { proyectos } = JSON.parse(await readFile(join(RAIZ, "proyectos.json"), "utf8"));

// El tono de un color, para avisar si dos proyectos quedan iguales. Sólo sabe
// de hex: una var(--algo) la resuelve el navegador y acá no se puede mirar.
function tono(c) {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return null;
  const h = max === r ? (g - b) / (max - min) + (g < b ? 6 : 0) : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
  return (h * 60 + 360) % 360;
}

const articulos = [], coloresFinales = [], todasLasDiapos = [];
let hayMaquetas = false;
for (const p of proyectos) {
  const ds = await diapositivas(p);
  todasLasDiapos.push(ds);
  if (ds.some((d) => d.maqueta)) hayMaquetas = true;
  let acento = p.acento ?? "var(--turquesa)";
  if (acento === "auto") {
    const primera = ds.find((d) => d.src);
    acento = (primera && await acentoDe(join(RAIZ, primera.src))) || "var(--turquesa)";
  }
  console.log(`  ${p.carpeta}: ${ds.length} diapositiva${ds.length === 1 ? "" : "s"}, acento ${acento}${p.acento === "auto" ? " (de la captura)" : ""}`);
  articulos.push(articulo(p, ds, acento));
  coloresFinales.push(acento);
}

// Dos proyectos seguidos del mismo color se leen como uno solo. No lo corrijo
// solo —el color es una decisión, no un detalle— pero lo digo.
const tonos = articulos.map((_, i) => coloresFinales[i]).map(tono).filter((h) => h !== null);
for (let i = 1; i < tonos.length; i++) {
  const d = Math.abs(tonos[i] - tonos[i - 1]);
  if (Math.min(d, 360 - d) < 25) {
    console.warn(`  ! ${proyectos[i - 1].carpeta} y ${proyectos[i].carpeta} quedaron de colores casi iguales`);
  }
}

// El aviso sólo mientras haya maquetas: el día que todas las capturas sean
// reales, sobra, y decir que son ilustrativas cuando no lo son es mentir al revés.
// Nombra los que sí tienen capturas de verdad, en vez de un "algunas son
// ilustrativas" que no dice nada. Se arma solo: el día que un proyecto cambie
// sus maquetas por capturas reales, pasa a figurar en la excepción sin que
// nadie toque este texto, y cuando no quede ninguna maqueta el aviso desaparece.
const conReales = proyectos
  .filter((p, i) => todasLasDiapos[i].length && todasLasDiapos[i].every((d) => d.src))
  .map((p) => p.titulo);
const salvo = conReales.length
  ? `, salvo las ${conReales.length === 1 ? "del " + conReales[0] : "de " + conReales.slice(0, -1).join(", ") + " y " + conReales.at(-1)}`
  : "";
const aviso = hayMaquetas
  ? `        <span class="nota-boceto">Capturas ilustrativas${salvo}</span>`
  : "";

const html = plantilla
  .replace("<!--PROYECTOS-->", () => `      <div class="proyectos">\n${articulos.join("\n\n")}\n`)
  .replace("<!--AVISO-CAPTURAS-->", () => aviso);

await mkdir(DIST, { recursive: true });
await writeFile(join(DIST, "index.html"), html);
for (const extra of ["capturas", "CNAME", "404.html"]) {
  if (await hay(join(RAIZ, extra))) await cp(join(RAIZ, extra), join(DIST, extra), { recursive: true });
}
console.log(`\ndist/index.html: ${html.length} bytes`);
