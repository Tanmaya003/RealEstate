import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", //each time there written /api add http://localhost:3000 before
        secure: false,
      },
    },
  },
  plugins: [react()],
});
