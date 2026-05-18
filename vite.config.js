import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Vite config for local development and production builds.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/theme": {
        target: "https://lmsstyle.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
