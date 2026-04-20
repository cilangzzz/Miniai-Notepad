import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/app/router'
import App from '@/app/App.vue'

// Import styles
import '@/assets/styles/main.css'

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')