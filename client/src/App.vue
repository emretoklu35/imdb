<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()

const shouldHideNavbar = computed(() => route.meta.hideNavbar)
</script>

<template>
  <Navbar v-if="!shouldHideNavbar" />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* Gerekli değil */
</style>
