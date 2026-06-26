import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { fetchCurrentUser, useAuth } from './stores/auth'

async function bootstrap() {
  const auth = useAuth()

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
