/* eslint-env node */
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  resolve: {
    alias: {
      '@stevent-team/react-party': resolve(__dirname, 'lib/index.ts')
    },
  },
  esbuild: {
    jsxInject: 'import * as React from "react"'
  }
})
