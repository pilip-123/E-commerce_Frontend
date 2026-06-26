import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { fetchCurrentUser, useAuth, persistAuth } from './stores/auth'

async function bootstrap() {
  const auth = useAuth()

  // Handle social login callback from query params
  const params = new URLSearchParams(window.location.search)
  const socialToken = params.get('social_token')
  const socialUser = params.get('social_user')
  const socialError = params.get('social_error')

  if (socialError) {
    alert(decodeURIComponent(socialError))
    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname)
  } else if (socialToken && socialUser) {
    try {
      const user = JSON.parse(decodeURIComponent(socialUser))
      persistAuth(socialToken, user)
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname)
    } catch (e) {
      // Ignore parse errors
    }
  }

  if (auth.token && !auth.user) {
    try {
      await fetchCurrentUser()
    } catch (error) {
      // Invalid tokens are cleared by the auth store.
    }
  }

  const app = createApp(App)
  app.use(router)

  await router.isReady()
  app.mount('#app')
}

bootstrap()
