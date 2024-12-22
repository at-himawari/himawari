import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 出力先ディレクトリ
    assetsDir: 'assets', // アセットファイルのディレクトリ
  },
  base: './'
});