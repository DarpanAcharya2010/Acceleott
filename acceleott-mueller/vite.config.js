import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // ✅ Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // ✅ Base path (keep "/" if deploying on Netlify or Vercel)
    base: "/",

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      host: true,            // Allow external connections
      port: 5173,            // ✅ Standard Vite dev port
      strictPort: false,     // ✅ Avoid port conflict automatically
      open: true,
      proxy: {
        "/api": {
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
      host: true,
      port: 4173,
      open: true,
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
