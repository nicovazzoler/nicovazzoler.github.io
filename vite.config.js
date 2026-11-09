import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Las páginas de cada proyecto y la 404 las escribe prerender.mjs, después del build.
export default defineConfig({
  plugins: [react()],
});
