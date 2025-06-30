<template>
  <!-- Modal'ın dışına tıklandığında kapanması için @click.self -->
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <div class="video-container">
        <iframe
          :src="trailerUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Hangi props'ları alacağını ve hangi event'leri göndereceğini tanımlıyoruz
defineProps<{
  visible: boolean
  trailerUrl: string
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background-color: #000;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 960px;
}

.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
