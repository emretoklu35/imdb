<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue' // Navbar'ı import et
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
