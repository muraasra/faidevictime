<template>
  <div class="space-y-2">
    <div v-for="option in options" :key="option" class="flex items-center">
      <input
        type="checkbox"
        :id="option"
        :value="option"
        :checked="modelValue.includes(option)"
        @change="handleChange(option)"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label :for="option" class="ml-2 block text-sm text-gray-700">
        {{ option }}
      </label>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (option) => {
  const newValue = props.modelValue.includes(option)
    ? props.modelValue.filter(item => item !== option)
    : [...props.modelValue, option]
  emit('update:modelValue', newValue)
}
</script> 