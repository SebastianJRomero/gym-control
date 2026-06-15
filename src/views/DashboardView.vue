<template>
  <div>

    <h1>Dashboard</h1>

    <p>
      Bienvenido
      {{ authStore.user?.nombre }}
    </p>

    <p>
      Rol:
      {{ authStore.user?.role }}
    </p>

    <router-link to="/members">
      Gestionar Miembros
    </router-link>

  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
</script>