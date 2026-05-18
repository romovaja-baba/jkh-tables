import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://showroom.eis24.me/c300/api/v4/test',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // secure: false,
      },
    },
  },
});
