import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '~': srcDir,
      '@': srcDir
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/helpers/**/*.ts',
        'src/hooks/**/*.ts',
        'src/features/**/*.ts',
        'src/features/**/*.vue',
        'src/routes.ts',
        'src/router.options.ts'
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.vue',
        'src/setupTests.ts',
        'src/test-utils.ts'
      ]
    }
  }
})
