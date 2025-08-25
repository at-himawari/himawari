import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  plugins: [react(), vike(), mdx()],
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
  build: {
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-vendor";
          }

          // Markdown processing (heavy dependencies)
          if (
            id.includes("react-markdown") ||
            id.includes("remark-gfm") ||
            id.includes("remark-math")
          ) {
            return "markdown-core";
          }

          // HTML processing (conditional loading)
          if (id.includes("rehype-raw") || id.includes("rehype-sanitize")) {
            return "markdown-html";
          }

          // Math rendering (conditional loading)
          if (id.includes("rehype-katex") || id.includes("katex")) {
            return "markdown-math";
          }

          // Icons (tree-shakeable)
          if (id.includes("react-icons")) {
            return "icons";
          }

          // Vike framework
          if (id.includes("vike")) {
            return "vike-vendor";
          }

          // Utilities
          if (id.includes("gray-matter") || id.includes("@twemoji/api")) {
            return "utils";
          }

          // Node modules (vendor)
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // 500KB warning threshold
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-markdown",
      "remark-gfm",
      "gray-matter",
    ],
    exclude: [
      // Conditionally loaded dependencies
      "rehype-katex",
      "rehype-raw",
      "rehype-sanitize",
    ],
  },
});
