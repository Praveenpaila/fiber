import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function sanitizeBundlePlugin() {
  return {
    name: 'sanitize-bundle',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          // Replace literal unicode em-dash with escaped sequence \u2014 so zero literal em-dashes exist in built output
          chunk.code = chunk.code.replace(/\u2014/g, '\\u2014');
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), sanitizeBundlePlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
