import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

// tsconfig.json meng-extend ./.nuxt/tsconfig.json, file itu baru ada setelah `nuxt prepare`.
// Di CI (Jenkins) folder .nuxt belum ada, jadi dibuat otomatis sebelum test berjalan.
if (!existsSync('.nuxt/tsconfig.json')) {
  execSync('npx --no-install nuxt prepare', {
    stdio: 'inherit',
    env: {
      ...process.env,
      HOME: process.env.HOME || '/tmp',
      npm_config_cache: process.env.npm_config_cache || '/tmp/.npm'
    }
  })
}

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