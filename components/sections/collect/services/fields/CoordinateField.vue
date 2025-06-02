<template>
  <div>
    <div class="flex space-x-2">
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="getCurrentLocation"
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i class="fas fa-location-arrow"></i>
      </button>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    emit('error', 'La géolocalisation n\'est pas supportée par votre navigateur')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const value = props.placeholder.toLowerCase().includes('longitude')
        ? position.coords.longitude.toFixed(6)
        : position.coords.latitude.toFixed(6)
      emit('update:modelValue', value)
    },
    (error) => {
      emit('error', 'Erreur de géolocalisation: ' + error.message)
    }
  )
}
</script> 