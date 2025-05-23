<template>
  <div class="min-h-screen pt-[64px] dark:bg-zinc-900">
    <div class="chatbot-page">
      <div class="page-header">
        <h1 class="text-emerald-600 dark:text-emerald-400">Assistance aux victimes</h1>
        <p class="subtitle dark:text-gray-300">Nous sommes là pour vous écouter et vous aider. Votre sécurité est notre priorité.</p>
      </div>

      <div class="message-form-section bg-white dark:bg-zinc-800">
        <div class="form-header">
          <i class="fas fa-shield-alt text-emerald-600 dark:text-emerald-400"></i>
          <div>
            <h2 class="dark:text-white">Envoyez-nous votre message en toute confidentialité</h2>
            <p class="dark:text-gray-300">Tous les échanges sont sécurisés et confidentiels</p>
          </div>
        </div>

        <form class="message-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="dark:text-white">Votre situation <span class="required">*</span></label>
            <select v-model="formData.situationType" required class="dark:bg-zinc-700 dark:text-white dark:border-gray-600">
              <option value="">Sélectionnez le type de situation</option>
              <option value="urgence">Situation d'urgence</option>
              <option value="harcelement">Harcèlement</option>
              <option value="violence">Violence</option>
              <option value="autre">Autre situation</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="dark:text-white">Votre prénom</label>
              <input 
                type="text" 
                v-model="formData.firstName"
                placeholder="Prénom (facultatif)"
                class="dark:bg-zinc-700 dark:text-white dark:border-gray-600"
              >
            </div>
            <div class="form-group">
              <label class="dark:text-white">Votre âge</label>
              <input 
                type="number" 
                v-model="formData.age"
                placeholder="Âge (facultatif)"
                min="0"
                max="120"
                class="dark:bg-zinc-700 dark:text-white dark:border-gray-600"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="dark:text-white">Votre message <span class="required">*</span></label>
            <textarea 
              v-model="formData.message"
              placeholder="Décrivez votre situation... Nous sommes là pour vous écouter"
              required
              rows="5"
              class="dark:bg-zinc-700 dark:text-white dark:border-gray-600"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="dark:text-white">Comment souhaitez-vous être contacté(e) ? <span class="required">*</span></label>
            <div class="contact-options">
              <label class="contact-option dark:bg-zinc-700 dark:text-white dark:border-gray-600">
                <input type="radio" v-model="formData.contactPreference" value="chat">
                <i class="fas fa-comments text-emerald-600 dark:text-emerald-400"></i>
                <span>Chat en ligne</span>
              </label>
              <label class="contact-option dark:bg-zinc-700 dark:text-white dark:border-gray-600">
                <input type="radio" v-model="formData.contactPreference" value="email">
                <i class="fas fa-envelope text-emerald-600 dark:text-emerald-400"></i>
                <span>Email</span>
              </label>
              <label class="contact-option dark:bg-zinc-700 dark:text-white dark:border-gray-600">
                <input type="radio" v-model="formData.contactPreference" value="phone">
                <i class="fas fa-phone text-emerald-600 dark:text-emerald-400"></i>
                <span>Téléphone</span>
              </label>
            </div>
          </div>

          <div class="form-group" v-if="formData.contactPreference === 'email'">
            <label class="dark:text-white">Votre email <span class="required">*</span></label>
            <input 
              type="email" 
              v-model="formData.email"
              placeholder="Votre adresse email"
              required
              class="dark:bg-zinc-700 dark:text-white dark:border-gray-600"
            >
          </div>

          <div class="form-group" v-if="formData.contactPreference === 'phone'">
            <label class="dark:text-white">Votre numéro de téléphone <span class="required">*</span></label>
            <input 
              type="tel" 
              v-model="formData.phone"
              placeholder="Votre numéro de téléphone"
              required
              class="dark:bg-zinc-700 dark:text-white dark:border-gray-600"
            >
          </div>

          <div class="form-footer">
            <div class="privacy-notice dark:text-gray-300">
              <i class="fas fa-lock text-emerald-600 dark:text-emerald-400"></i>
              Vos informations resteront strictement confidentielles
            </div>
            <button type="submit" class="submit-button bg-emerald-600 hover:bg-emerald-700" :disabled="isSubmitting">
              <span v-if="!isSubmitting">Envoyer le message</span>
              <span v-else>
                <i class="fas fa-spinner fa-spin"></i>
                Envoi en cours...
              </span>
            </button>
          </div>
        </form>
      </div>

      <div class="emergency-section">
        <div class="emergency-card bg-red-100 dark:bg-red-900">
          <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
          <h3 class="text-red-600 dark:text-red-400">Besoin d'aide immédiate ?</h3>
          <p class="dark:text-gray-300">En cas d'urgence, contactez directement les services d'urgence</p>
          <div class="emergency-numbers">
            <a href="tel:17" class="emergency-button bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400">
              <i class="fas fa-phone"></i>
              Police : 17
            </a>
            <a href="tel:15" class="emergency-button bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400">
              <i class="fas fa-ambulance"></i>
              SAMU : 15
            </a>
            <a href="tel:112" class="emergency-button bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400">
              <i class="fas fa-first-aid"></i>
              Urgences : 112
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { ref, reactive } from 'vue'

const formData = reactive({
  situationType: '',
  firstName: '',
  age: '',
  message: '',
  contactPreference: 'chat',
  email: '',
  phone: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Simuler l'envoi du message
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Message envoyé:', formData)
    // Réinitialiser le formulaire
    formData.situationType = ''
    formData.firstName = ''
    formData.age = ''
    formData.message = ''
    formData.contactPreference = 'chat'
    formData.email = ''
    formData.phone = ''
    alert('Votre message a été envoyé. Nous vous contacterons rapidement.')
  } catch (error) {
    alert('Une erreur est survenue. Veuillez réessayer.')
  } finally {
    isSubmitting.value = false
  }
}
  </script>
  
  <style scoped>
.chatbot-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
}

.message-form-section {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-header i {
  font-size: 2.5rem;
}

.form-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.form-header p {
  margin: 0.5rem 0 0;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.required {
  color: #dc2626;
}

input, select, textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.contact-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.contact-option:hover {
  background: #f9fafb;
}

.contact-option input {
  margin: 0;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.privacy-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.submit-button {
  padding: 0.75rem 2rem;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.emergency-section {
  margin-top: 3rem;
}

.emergency-card {
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.emergency-card i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.emergency-card h3 {
  margin: 0 0 0.5rem;
}

.emergency-numbers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.emergency-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.emergency-button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .chatbot-page {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .submit-button {
    width: 100%;
    justify-content: center;
  }
}
  </style>