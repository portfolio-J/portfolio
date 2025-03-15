// vite.config.js
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// Vite 설정 정의
export default defineConfig({
  // 절대경로를 위해 설치 tsconfig.json에서 절대경로를 변경하면 vite에 변경사항을 자동으로 추가해줘 따로 속성을 추가하지 않아도 된다.
  plugins: [tsconfigPaths()],
  css: {
    postcss: './postcss.config.js',
    preprocessorOptions: {
      // scss의 절대경로를 지정
      scss: {
        loadPaths: [path.resolve(__dirname, 'src/assets')],
      },
    },
  },
});
