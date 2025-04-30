<template>
  <div class="max-w-md mx-auto mt-20">
    <h1 class="text-2xl font-bold mb-4">Connexion</h1>
    <form @submit.prevent="login">
      <input
        v-model="username"
        placeholder="Nom d'utilisateur"
        class="mb-2 w-full p-2 border"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="mb-2 w-full p-2 border"
      />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2">
        Se connecter
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')

type LoginResponse = {
  access: string
  refresh: string
  user_id: number
  username: string
}

const login = async () => {
  error.value = ''

  try {
    const { data, error: fetchError } = await useFetch<LoginResponse>(
      'http://127.0.0.1:8000/api/token/',
      {
        method: 'POST',
        body: {
          username: username.value,
          password: password.value
        },
        server: false
      }
    )

    if (fetchError.value) {
      console.error('Erreur d’authentification :', fetchError.value.data ?? fetchError.value)
      error.value = 'Identifiants incorrects'
      return
    }

    // Vérifie que data est bien présent
    if (!data.value?.access || !data.value?.username) {
      error.value = "Données de réponse invalides"
      return
    }

    // Stocker le token et l'utilisateur
    auth.setToken(data.value.access)
    auth.setUser({
      id: data.value.user_id,
      username: data.value.username
    })

    console.log('Connexion réussie. Redirection vers /collect/root')
    await navigateTo('/collect/root')
  } catch (err) {
    console.error('Erreur réseau :', err)
    error.value = 'Erreur lors de la connexion'
  }
}
</script>