import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative paths make the site work both at username.github.io/repository
  // and on a custom domain.
  base: "./",
  plugins: [react()],
});
