import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ainance-app/', // GitHub Pages用にリポジトリ名を指定
  plugins: [react()],
  build: {
    // アセットのパスを相対パスにする
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
})