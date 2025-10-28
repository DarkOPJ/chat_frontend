import 'dotenv/config';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: process.env.NODE_ENV === 'development' ? '0.0.0.0' : false,
    port: 4000,
  },
});
