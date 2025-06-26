<!-- Dosya Yolu: client/src/views/AuthCallback.vue (DOĞRU KOD) -->
<template>
  <div class="callback-page">
    <p>Login successful, redirecting...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // 1. URL'den token'ı al
  const token = route.query.token as string

  if (token) {
    // 2. Token'ı DOĞRUDAN localStorage'a yaz.
    localStorage.setItem('token', token)

    // 3. Ana sayfaya yönlendir ve SAYFANIN TAMAMEN YENİLENMESİNİ SAĞLA.
    window.location.href = '/'
  } else {
    // Token yoksa, bir hata var demektir. Login sayfasına yönlendir.
    window.location.href = '/login?error=google_auth_failed'
  }
})
</script>

<style scoped>
.callback-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  color: white;
  font-size: 1.5em;
  background-color: #000;
}
</style>
