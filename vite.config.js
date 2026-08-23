import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forwards /api/* to your FastAPI backend during local dev
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
