import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    vike()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  ssr: {
    noExternal: ['tailwindcss']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});