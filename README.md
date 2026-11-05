# Vitrina

Mis proyectos, publicados en https://nicovazzoler.github.io

## Sumar o cambiar un proyecto

1. Abrí una rama.
2. En `proyectos.json` va un bloque por proyecto: copiá uno y cambiá los datos.
3. Las capturas van en `public/capturas/<carpeta>/`, en PNG o JPG, y se nombran en `capturas`. La primera sale
   grande en su página y en la tarjeta de la portada. Se publican tal cual: sacalas con datos de prueba.
4. Abrí el PR y mergealo. GitHub arma y publica el sitio solo; en la pestaña **Actions** se ve cómo va.

## Los campos de cada proyecto

| Campo | Qué es |
|---|---|
| `carpeta` | La dirección del proyecto: `nicovazzoler.github.io/<carpeta>/`. Minúsculas y guiones. |
| `titulo`, `bajada` | El nombre y una o dos frases de qué es. |
| `estado`, `anio` | Por ejemplo «En uso» o «En desarrollo», y el año. |
| `tema` | Los colores de la página y el emblema (`corona` o `terminal`). |
| `resuelve` | Un párrafo: qué problema resuelve. |
| `stack`, `bibliotecas` | Listas de nombres. |
| `repo` | La dirección del repositorio. Vacío si no hay. |
| `capturas` | Lista de `{ "archivo": "...", "texto": "lo que se ve" }`. |

## Verlo en tu compu antes de subir

```bash
npm install
npm run dev
```
