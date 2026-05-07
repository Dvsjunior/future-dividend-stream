import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  build: {
    minify: "esbuild",
    target: "esnext",
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          query: ["@tanstack/react-query"],
          charts: ["recharts"],
          motion: ["framer-motion"],
        },
      },
    },
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
});