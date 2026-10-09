import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-09',
  srcDir: 'src/',
  ssr: false,
  devtools: { enabled: true },
  css: ['~/index.css'],
  modules: ['@pinia/nuxt'],
  vite: { plugins: [tailwindcss()] },
  nitro: {
    externals: {
      inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/]
    }
  },
  runtimeConfig: {
    public: {
      delcomBaseurl: process.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1'
    }
  },
  app: {
    head: {
      title: 'Delcom Cash Flow',
      meta: [{ name: 'description', content: 'Dashboard pencatatan arus kas pribadi.' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' }
      ]
    }
  },
  devServer: { port: Number(process.env.APP_PORT || 3000) },
  typescript: { strict: true, typeCheck: true }
})
