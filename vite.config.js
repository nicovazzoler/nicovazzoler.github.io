import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages sirve /<carpeta>/index.html: cada proyecto lleva una copia de la página, que lee la dirección.
// 404.html también, así una dirección mal escrita cae en la portada en vez de en el error de GitHub.
function paginasPorProyecto() {
  return {
    name: "paginas-por-proyecto",
    closeBundle() {
      const { proyectos } = JSON.parse(readFileSync("proyectos.json", "utf8"));
      for (const { carpeta } of proyectos) {
        mkdirSync(`dist/${carpeta}`, { recursive: true });
        copyFileSync("dist/index.html", `dist/${carpeta}/index.html`);
      }
      copyFileSync("dist/index.html", "dist/404.html");
    },
  };
}

export default defineConfig({
  plugins: [react(), paginasPorProyecto()],
});
