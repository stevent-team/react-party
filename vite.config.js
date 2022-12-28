/* eslint-env node */
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@stevent-team/react-party': resolve(__dirname, '/lib/index.js')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'react-party',
      fileName: 'react-party',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    }
  }
})
