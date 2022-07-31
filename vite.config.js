/* eslint-env node */
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  resolve: {
    alias: {
      '@stevent-team/react-party': resolve(__dirname, '/lib/main.js')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
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
      input: {
        main: resolve(__dirname, 'sample/index.html'),
      },
    }
  }
})
