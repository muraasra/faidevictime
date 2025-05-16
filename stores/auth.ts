import { defineStore } from 'pinia'
import { useCookie } from '#app'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: number; username: string } | null>(null)

  const cookieToken = useCookie<string | null>('auth_token', {
    default: () => null,
    maxAge: 60 * 60*24 , // 1 jour
    httpOnly: false
  })

  const token = ref(cookieToken.value)

  function setToken(newToken: string) {
    token.value = newToken
    cookieToken.value = newToken
    if (process.client) {
      localStorage.setItem('access_token', newToken)
    }
  }

  function setUser(data: { id: number; username: string ; }) {
    console.log('Setting user:', data);
    user.value = data
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(data))
    }
  }

  function restoreUser() {
    if (process.client) {
      console.log('Restoring user from localStorage');
      const storedUser = localStorage.getItem('user')
      console.log('Stored user:', storedUser);
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        console.log('Restored user:', user.value);
      }
    }
  }

  function logout() {
    console.log('Logging out user');
    token.value = null
    cookieToken.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
    navigateTo('/login')
  }

  // restauration automatique si client
  if (process.client) {
    console.log('Initializing auth store');
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      console.log('Found stored token');
      token.value = storedToken
      cookieToken.value = storedToken
    }
    restoreUser()
  }

  return { user, token, setToken, setUser, logout }
})