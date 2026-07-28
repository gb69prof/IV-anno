import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  // Relative paths make the site work both at username.github.io/repository
  // and on a custom domain.
  base: "./",
  plugins: [react()],
  build: {
    // Keep the editable source entry separate from the generated index.html
    // served by GitHub Pages.
    rollupOptions: {
      input: resolve(import.meta.dirname, "index.source.html"),
    },
  },
});
