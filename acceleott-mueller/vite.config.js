import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    port: 5173,
    open: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode === "development", // only generate source maps in dev
    manifest: true,
    chunkSizeWarningLimit: 1000, // suppress warnings for large vendor bundles
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          vendor: ["axios", "aos", "framer-motion", "react-toastify"],
        },
      },
    },
  },

  preview: {
    port: 4173,
    open: true,
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
