import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*']
    })
  ],
  build: mode === 'library' ? {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactAdvancedDataTable',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        // Ensure default + named export interop is friendly
        exports: 'named',
        // Emit a consistent CSS filename for consumers
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          // Preserve default for other assets
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  } : {
    outDir: 'dist-demo'
  },
  css: {
    postcss: './postcss.config.js'
  }
}))
