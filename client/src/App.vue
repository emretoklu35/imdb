<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

// Uygulama ilk yüklendiğinde çalışır
onMounted(() => {
  authStore.getUser()
})
</script>

<template>
  <Navbar />
  <!-- Navbar'ı burada kullan -->

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* Genel stil dosyası App.vue'de değil, main.css'te olmalı. Onu da düzenleyeceğiz. */
</style>
