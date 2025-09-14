import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // auto open in browser (optional)
  },
  resolve: {
    alias: {
      "@": "/src", // allows you to import like "@/components/Button"
    },
  },
});
