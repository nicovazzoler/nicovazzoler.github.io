# nicovazzoler.github.io

La vitrina de mis proyectos: **https://nicovazzoler.github.io**

Son herramientas que armé para resolver problemas reales. Cada una tiene su propia página, con sus colores, capturas, qué resuelve, con qué está hecha y el enlace a su código.

## Cómo está hecho

- **React y Vite**, sin backend. Todo el contenido sale de `proyectos.json` y las capturas de `public/capturas/<proyecto>/`, así que sumar un proyecto es agregar un bloque de datos y sus imágenes.
- **Una dirección por proyecto** (`/salon-ivana/`, `/autortv/`). GitHub Pages solo sirve archivos, así que el build deja una copia de la página en cada carpeta, y la página lee la dirección para saber qué proyecto mostrar.
- **Se publica sola.** Cada cambio que entra a `main` lo arma y publica un workflow de GitHub Actions.

## Correrlo localmente

```bash
npm install
npm run dev
```
