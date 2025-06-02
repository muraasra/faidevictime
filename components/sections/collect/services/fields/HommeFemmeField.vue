<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Hommes</label>
      <input
        type="number"
        :value="modelValue?.hommes || 0"
        @input="updateValue('hommes', $event.target.value)"
        min="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Femmes</label>
      <input
        type="number"
        :value="modelValue?.femmes || 0"
        @input="updateValue('femmes', $event.target.value)"
        min="0"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1 col-span-2">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ hommes: 0, femmes: 0 })
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: parseInt(value) || 0
  })
}
</script> 