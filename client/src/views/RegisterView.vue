<!-- client/src/views/RegisterView.vue -->
<template>
  <div class="auth-page">
    <form @submit.prevent="handleRegister" class="auth-form">
      <h1>Üye Ol</h1>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Şifre</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="country">Ülke</label>
        <input type="text" id="country" v-model="country" required />
      </div>
      <div class="form-group">
        <label for="city">Şehir</label>
        <input type="text" id="city" v-model="city" required />
      </div>
      <button type="submit" class="btn-submit">Kayıt Ol</button>
      <p class="form-link">
        Zaten bir hesabın var mı? <router-link to="/login">Giriş Yap</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const country = ref('')
const city = ref('')

const handleRegister = () => {
  // TODO: API'ye kayıt isteği gönderme mantığı buraya gelecek.
  console.log('Registering with:', email.value, password.value, country.value, city.value)
}
</script>

<style scoped>
/* Bu stilleri daha sonra ayrı bir dosyaya taşıyabiliriz */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.auth-form {
  width: 400px;
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
}
.form-link {
  text-align: center;
  margin-top: 20px;
}
.form-link a {
  color: #5799ef;
  text-decoration: none;
}
</style>
