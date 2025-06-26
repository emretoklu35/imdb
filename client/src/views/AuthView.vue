<!-- Dosya Yolu: client/src/views/AuthView.vue (TAM KOD) -->
<template>
  <div class="auth-page-wrapper">
    <div class="auth-form-container">
      <!-- GİRİŞ FORMU BÖLÜMÜ -->
      <div v-if="isLoginMode">
        <h1 class="title">Giriş Yap</h1>

        <!-- YENİ: GOOGLE İLE GİRİŞ BUTONU -->
        <a href="http://localhost:9090/api/auth/google" class="google-btn">
          GOOGLE ile Giriş Yap
        </a>
        <div class="divider"><span>veya</span></div>

        <form @submit.prevent="handleLogin">
          <div v-if="error" class="error-message">{{ error }}</div>
          <div class="form-group">
            <label for="login-email">Email</label>
            <input id="login-email" type="email" v-model="loginForm.email" required />
          </div>
          <div class="form-group">
            <label for="login-password">Şifre</label>
            <input id="login-password" type="password" v-model="loginForm.password" required />
          </div>
          <button type="submit" class="submit-btn">Giriş Yap</button>
        </form>
        <p class="switch-mode">Hesabın yok mu? <a @click="switchToRegisterMode">Üye Ol</a></p>
      </div>

      <!-- KAYIT FORMU BÖLÜMÜ -->
      <div v-else>
        <h1 class="title">Üye Ol</h1>
        <form @submit.prevent="handleRegister">
          <div v-if="error" class="error-message">{{ error }}</div>
          <div class="form-group">
            <label for="reg-firstname">Ad</label>
            <input id="reg-firstname" type="text" v-model="registerForm.firstName" required />
          </div>
          <div class="form-group">
            <label for="reg-lastname">Soyad</label>
            <input id="reg-lastname" type="text" v-model="registerForm.lastName" required />
          </div>
          <div class="form-group">
            <label for="reg-email">Email</label>
            <input id="reg-email" type="email" v-model="registerForm.email" required />
          </div>
          <div class="form-group">
            <label for="reg-password">Şifre</label>
            <input id="reg-password" type="password" v-model="registerForm.password" required />
          </div>
          <div class="form-group">
            <label for="reg-country">Ülke</label>
            <select id="reg-country" v-model="registerForm.country" required>
              <option disabled value="">Lütfen bir ülke seçin</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="reg-city">Şehir</label>
            <select
              id="reg-city"
              v-model="registerForm.city"
              :disabled="!registerForm.country"
              required
            >
              <option disabled value="">Lütfen bir şehir seçin</option>
              <option v-for="city in availableCities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
          <button type="submit" class="submit-btn">Üye Ol</button>
        </form>
        <p class="switch-mode">
          Zaten bir hesabın var mı? <a @click="switchToLoginMode">Giriş Yap</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const isLoginMode = ref(true)
const authStore = useAuthStore()
const router = useRouter()
const error = ref('')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  country: '',
  city: '',
})

const countries = ['Türkiye', 'Almanya', 'ABD']
const citiesByCountry: { [key: string]: string[] } = {
  Türkiye: ['İstanbul', 'Ankara', 'İzmir'],
  Almanya: ['Berlin', 'Münih', 'Hamburg'],
  ABD: ['New York', 'Los Angeles', 'Chicago'],
}

const availableCities = computed(() => {
  return citiesByCountry[registerForm.value.country] || []
})

watch(
  () => registerForm.value.country,
  () => {
    registerForm.value.city = ''
  },
)

const switchToRegisterMode = () => {
  isLoginMode.value = false
  error.value = ''
  loginForm.value = { email: '', password: '' }
}

const switchToLoginMode = () => {
  isLoginMode.value = true
  error.value = ''
  registerForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    city: '',
  }
}

const handleLogin = async () => {
  error.value = ''
  try {
    await authStore.login(loginForm.value)
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Giriş bilgileri hatalı.'
  }
}

const handleRegister = async () => {
  error.value = ''
  try {
    const response = await fetch('http://localhost:9090/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm.value),
    })
    const data = await response.json()
    if (!response.ok)
      throw new Error(data.msg || (data.errors && data.errors[0].msg) || 'Kayıt başarısız.')

    await authStore.login({
      email: registerForm.value.email,
      password: registerForm.value.password,
    })
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Kayıt sırasında bir hata oluştu.'
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background-color: #000;
}
.auth-form-container {
  background-color: #1a1a1a;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
.title {
  color: #f5c518;
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: 600;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #ccc;
  font-size: 14px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f5c518;
  box-shadow: 0 0 0 2px rgba(245, 197, 24, 0.3);
}
.submit-btn {
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
  margin-top: 10px;
}
.submit-btn:hover {
  background-color: #e4b517;
}
.switch-mode {
  text-align: center;
  margin-top: 25px;
  color: #aaa;
}
.switch-mode a {
  color: #5799ef;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}
.switch-mode a:hover {
  text-decoration: underline;
}
.error-message {
  color: #ef5350;
  background-color: rgba(239, 83, 80, 0.1);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid rgba(239, 83, 80, 0.4);
  font-size: 14px;
}
.google-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #db4437;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-bottom: 20px;
}
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #888;
  margin: 20px 0;
  font-size: 12px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #444;
}
.divider:not(:empty)::before {
  margin-right: 0.5em;
}
.divider:not(:empty)::after {
  margin-left: 0.5em;
}
</style>
