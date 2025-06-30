// Dosya Yolu: client/src/main.ts (GÜNCELLENMİŞ HALİ)

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n' // YENİ: i18n yapılandırmasını import et

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n) // YENİ: i18n'i uygulamaya ekle

app.mount('#app')
