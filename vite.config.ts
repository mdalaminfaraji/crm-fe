import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 3000,
    watch: {
      usePolling: true,  // Needed for Docker volumes
    },
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
  },
});
