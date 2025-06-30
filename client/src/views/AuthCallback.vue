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
  const token = route.query.token as string

  if (token) {
    localStorage.setItem('token', token)

    window.location.href = '/'
  } else {
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
