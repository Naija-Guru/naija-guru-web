import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import { fileURLToPath, URL } from 'url';
import tailwindcss from '@tailwindcss/vite';

import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as ManifestV3Export }),
    tailwindcss(),
  ],
  server: {
    port: 3001,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
});
