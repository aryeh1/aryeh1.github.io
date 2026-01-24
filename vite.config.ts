import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { execSync } from 'child_process'

// Build metadata - auto-generated from git
function getBuildInfo() {
  try {
    const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim()
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
    return { version: `1.0.${commitCount}`, hash: commitHash }
  } catch {
    return { version: '1.0.0', hash: 'dev' }
  }
}

const buildInfo = getBuildInfo()
const BUILD_VERSION = `${buildInfo.version}-${buildInfo.hash}`
const BUILD_TIME = new Date().toISOString()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    __BUILD_VERSION__: JSON.stringify(BUILD_VERSION),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/archive/**'],
  },
})
