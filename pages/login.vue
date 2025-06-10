<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

definePageMeta({ layout: 'auth' });

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const rememberPassword = ref(false);
const error = ref('');
const loading = ref(false);

const usernameTouched = ref(false);
const passwordTouched = ref(false);

type LoginResponse = {
  access: string
  refresh: string
  user_id: number
  username: string
};

const usernameError = computed(() => {
  if (!usernameTouched.value) return '';
  if (!username.value) return 'Nom d\'utilisateur requis';
  return '';
});

const passwordError = computed(() => {
  if (!passwordTouched.value) return '';
  if (!password.value) return 'Mot de passe requis';
  if (password.value.length < 8) return 'Minimum 8 caractères';
  return '';
});

const handleSubmit = async () => {
  usernameTouched.value = true;
  passwordTouched.value = true;
  error.value = '';
  loading.value = true;

  if (usernameError.value || passwordError.value) {
    loading.value = false;
    return;
  }

  // Vérifier la connexion internet
  if (!navigator.onLine) {
    error.value = 'Pas de connexion internet. Veuillez vérifier votre connexion.';
    loading.value = false;
    return;
  }

  try {
    // Ajouter un timeout pour la requête
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

    const { data, error: fetchError } = await useFetch<LoginResponse>('https://wilfriedtayou.pythonanywhere.com/api/token/', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      },
      server: false,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (fetchError.value) {
      if (fetchError.value.name === 'AbortError') {
        error.value = 'La connexion a pris trop de temps. Veuillez réessayer.';
      } else if (!navigator.onLine) {
        error.value = 'La connexion internet a été perdue. Veuillez vérifier votre connexion.';
      } else {
        error.value = 'Identifiants incorrects';
      }
      loading.value = false;
      return;
    }

    if (!data.value?.access) {
      error.value = 'Identifiants incorrects';
      loading.value = false;
      return;
    }

    auth.setToken(data.value.access);
    auth.setUser({
      id: data.value.user_id ?? 0,
      username: username.value
    });

    await nextTick();
    router.push('/collect/dash');
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        error.value = 'La connexion a pris trop de temps. Veuillez réessayer.';
      } else if (!navigator.onLine) {
        error.value = 'La connexion internet a été perdue. Veuillez vérifier votre connexion.';
      } else {
        error.value = 'Erreur lors de la connexion';
      }
    } else {
      error.value = 'Erreur lors de la connexion';
    }
  } finally {
    loading.value = false;
  }
};

// Ajouter un écouteur pour les changements de connexion
onMounted(() => {
  window.addEventListener('online', () => {
    if (error.value.includes('connexion internet')) {
      error.value = '';
    }
  });
  
  window.addEventListener('offline', () => {
    if (loading.value) {
      error.value = 'La connexion internet a été perdue. Veuillez vérifier votre connexion.';
      loading.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('online', () => {});
  window.removeEventListener('offline', () => {});
});
</script>

<template>
  <div class="flex flex-col lg:flex-row w-full relative">
    <!-- Overlay sombre pendant chargement -->
    

    <!-- Partie gauche -->
    <div class="hidden lg:flex w-full lg:w-1/2 bg-emerald-500 dark:bg-emerald-700 items-center justify-center p-6">
      <div class="text-center">
        <h1 class="text-white font-bold text-3xl mb-10">
          Connectez-vous pour ajouter un service !
        </h1>
        <img src="/screens/login.png" alt="login" class="aspect-square max-w-sm mx-auto" />
      </div>
    </div>

    <!-- Partie formulaire -->
    <div class="w-full lg:w-1/2 h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div class="w-[320px] md:w-[420px] lg:w-[480px] p-6 border shadow-xl rounded-md bg-white dark:bg-zinc-900 relative">
        <h2 class="text-center text-2xl font-semibold text-black dark:text-white">Connexion</h2>
        <p class="text-center text-sm text-gray-500 dark:text-gray-300 mb-6">
          Veuillez entrer votre nom d'utilisateur et mot de passe
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nom d'utilisateur -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom d'utilisateur</label>
            <input
              id="username"
              v-model="username"
              type="text"
              @blur="usernameTouched = true"
              placeholder="exemple"
              class="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p v-if="usernameError" class="text-sm text-red-500 mt-1">{{ usernameError }}</p>
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              @blur="passwordTouched = true"
              class="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p v-if="passwordError" class="text-sm text-red-500 mt-1">{{ passwordError }}</p>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 text-sm">
              <input type="checkbox" v-model="rememberPassword" class="rounded" />
              <span class="text-gray-700 dark:text-gray-300">Se souvenir de moi</span>
            </label>
            <NuxtLink to="/forget-password" class="text-sm text-emerald-600 hover:underline">
              Mot de passe oublié ?
            </NuxtLink>
          </div>

          <!-- Bouton -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? 'Connexion...' : 'Connexion' }}</span>
          </button>

          <!-- Erreur -->
          <p v-if="error" class="text-sm text-red-500 text-center mt-2">{{ error }}</p>
        </form>

        <NuxtLink
          to="/register/root_register.vue"
          class="block text-center text-sm text-gray-600 dark:text-gray-300 hover:underline mt-4"
        >
          Pas encore de compte ? S'inscrire ici
        </NuxtLink>
      </div>
    </div>
  </div>
</template>