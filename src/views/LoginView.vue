<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">

      <input
        v-model="identifier"
        placeholder="Usuario o email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
      />

      <button type="submit">
        Iniciar sesión
      </button>

    </form>

    <p>{{ message }}</p>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const identifier = ref('');
const password = ref('');
const message = ref('');
const authStore = useAuthStore();
const router = useRouter();

async function handleLogin() {

  try {

    const result = await login(
      identifier.value,
      password.value
    );

  authStore.setAuth(
  result.token,
  result.user
)

    router.push('/dashboard')

    message.value =
        `Bienvenido ${result.user.nombre}`

    console.log(result);

  } catch {

    message.value =
      'Credenciales incorrectas';
  }
}
</script>