// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['./app/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'Altersvorsorgedepot Rechner 2027',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Berechnen Sie Ihre staatliche Förderung für das neue Altersvorsorgedepot ab 2027.' }
      ]
    }
  }
})
