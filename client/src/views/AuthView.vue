<template>
  <div class="auth-page-wrapper">
    <div class="auth-form-container">
      <div v-if="isLoginMode">
        <h1 class="title">Giriş Yap</h1>
        <a href="https://imdb-l6w1.onrender.com/api/auth/google" class="google-btn">
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

      <div v-else>
        <h1 class="title">Üye Ol</h1>
        <form @submit.prevent="handleRegister">
          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-group profile-photo-group">
            <label>Profil Fotoğrafı (Opsiyonel)</label>
            <div class="photo-uploader">
              <img :src="photoPreview || '/default-avatar.png'" class="avatar-preview" />
              <input
                id="reg-photo"
                type="file"
                @change="handlePhotoChange"
                accept="image/png, image/jpeg, image/jpg"
                style="display: none"
              />
              <label for="reg-photo" class="upload-btn">Görsel Seç</label>
            </div>
          </div>

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

const selectedPhoto = ref<File | null>(null)
const photoPreview = ref<string | null>(null)

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

const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedPhoto.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

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
  selectedPhoto.value = null
  photoPreview.value = null
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

  const formData = new FormData()
  formData.append('firstName', registerForm.value.firstName)
  formData.append('lastName', registerForm.value.lastName)
  formData.append('email', registerForm.value.email)
  formData.append('password', registerForm.value.password)
  formData.append('country', registerForm.value.country)
  formData.append('city', registerForm.value.city)

  if (selectedPhoto.value) {
    formData.append('profilePhoto', selectedPhoto.value)
  }

  try {
    const response = await fetch('https://imdb-l6w1.onrender.com/api/auth/register', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      const errorMessage =
        data.msg ||
        (data.errors && data.errors.map((e: any) => e.msg).join(', ')) ||
        'Kayıt başarısız.'
      throw new Error(errorMessage)
    }

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
.profile-photo-group {
  margin-bottom: 25px;
}
.photo-uploader {
  display: flex;
  align-items: center;
  gap: 20px;
}
.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #555;
  background-color: #333;
}
.upload-btn {
  background-color: #3a3a3a;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: 1px solid #555;
  transition: background-color 0.2s;
}
.upload-btn:hover {
  background-color: #4a4a4a;
}
</style>
