import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // ✅ Load environment variables from `.env` files
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
          // ✅ Use VITE_BACKEND_URL for backend requests
          target: env.VITE_BACKEND_URL || "http://localhost:5000",
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
      port: 4173,
      open: true,
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
