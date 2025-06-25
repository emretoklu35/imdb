<!-- client/src/views/LoginView.vue -->

<template>
  <div class="auth-page">
    <form @submit.prevent="handleLogin" class="auth-form">
      <h1>Giriş Yap</h1>

      <!-- Hata mesajını göstermek için eklenen bölüm -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Şifre</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit" class="btn-submit">Giriş Yap</button>

      <p class="form-link">Hesabın yok mu? <router-link to="/register">Üye Ol</router-link></p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // @/src/ demek, bu bir kısayol

const email = ref('')
const password = ref('')
const errorMessage = ref('') // Hata mesajlarını saklamak için reaktif bir değişken

// Pinia store'umuzu kullanıma hazır hale getiriyoruz.
const authStore = useAuthStore()
// Programatik olarak sayfa yönlendirmesi yapmak için Vue Router'ı kullanıyoruz.
const router = useRouter()

// Form gönderildiğinde çalışacak olan asenkron fonksiyon
const handleLogin = async () => {
  // Önceki hata mesajını temizle
  errorMessage.value = ''

  try {
    // authStore'daki login aksiyonunu çağırıyoruz ve form verilerini gönderiyoruz.
    await authStore.login({
      email: email.value,
      password: password.value,
    })

    // Eğer login aksiyonu başarılı olursa (hata fırlatmazsa),
    // kullanıcıyı ana sayfaya ('/') yönlendiriyoruz.
    router.push('/')
  } catch (error: any) {
    // Eğer login aksiyonu hata fırlatırsa (örn: şifre yanlışsa),
    // hatayı yakalayıp errorMessage değişkenine atıyoruz.
    errorMessage.value = error.message || 'Giriş sırasında bir hata oluştu.'
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
/* Bu sayfaya özel stiller */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-form {
  width: 100%;
  max-width: 400px; /* Mobil uyumluluk için max-width eklemek daha iyi */
  padding: 40px;
  background-color: #1a1a1a;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #f5c518;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #ccc;
}

.form-group input {
  width: 100%;
  padding: 10px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: white;
  font-size: 16px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #f5c518;
  color: #121212;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #e4b517;
}

.form-link {
  text-align: center;
  margin-top: 20px;
}

.form-link a {
  color: #5799ef;
  text-decoration: none;
}

/* Hata mesajı kutusunun stili */
.error-message {
  background-color: #5f2120; /* Daha koyu bir kırmızı */
  color: #ffc1c1;
  border: 1px solid #a83c3b;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
