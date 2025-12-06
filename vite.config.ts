import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    vike(),
    {
      name: "serve-admin",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/admin")) {
            if (req.url === "/admin" || req.url === "/admin/") {
              const indexPath = path.resolve(
                __dirname,
                "public/admin/index.html"
              );
              const html = fs.readFileSync(indexPath, "utf-8");
              res.setHeader("Content-Type", "text/html");
              res.end(html);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  ssr: {
    noExternal: ["tailwindcss"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  publicDir: "public",
  server: {
    fs: {
      strict: false,
    },
  },
});
