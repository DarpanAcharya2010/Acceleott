import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      host: true,
      port: 5173,
      open: true,
      proxy: {
        "/api": {
          target:
            mode === "development"
              ? "http://localhost:8888/.netlify/functions/api"
              : "/.netlify/functions/api",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode === "development",
      manifest: true,
      chunkSizeWarningLimit: 1000,
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
      host: true,
      port: 4173,
      open: true,
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
