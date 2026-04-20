import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/app/router'
import App from '@/app/App.vue'
import { initDB } from '@/storage/db'

// Import styles
import '@/assets/styles/main.css'

// Initialize database before app mount
initDB().catch(err => {
  console.warn('Database initialization error:', err)
  // Continue anyway - app can work without persistent storage
})

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')