/// <reference types="vitest" />
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  // This should be the name of your GitHub repository.
  // For example, if your repository is https://github.com/user/my-repo,
  // then the base should be '/my-repo/'.
  base: '',
  plugins: [preact()],
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
