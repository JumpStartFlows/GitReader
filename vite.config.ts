import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep images in a predictable location
          if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name)) {
            return 'images/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});