<template>
  <div class="flex space-x-4">
    <div class="flex items-center">
      <input
        type="radio"
        :id="'yes-' + name"
        :name="name"
        value="true"
        :checked="modelValue === true"
        @change="$emit('update:modelValue', true)"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
      />
      <label :for="'yes-' + name" class="ml-2 block text-sm text-gray-700">
        Oui
      </label>
    </div>
    <div class="flex items-center">
      <input
        type="radio"
        :id="'no-' + name"
        :name="name"
        value="false"
        :checked="modelValue === false"
        @change="$emit('update:modelValue', false)"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
      />
      <label :for="'no-' + name" class="ml-2 block text-sm text-gray-700">
        Non
      </label>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: null
  },
  name: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script> 