// vite.config.js
import { defineConfig } from 'vite';

// Vite 설정 정의
export default defineConfig({
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
});
