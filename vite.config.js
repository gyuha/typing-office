import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        help: resolve(import.meta.dirname, 'Help/Help_Kor.html'),
      },
    },
  },
});
