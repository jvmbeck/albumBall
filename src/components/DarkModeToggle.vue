<template>
  <q-toggle
    v-model="darkMode"
    checked-icon="dark_mode"
    unchecked-icon="light_mode"
    color="primary"
  />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'

const $q = useQuasar()

onMounted(() => {
  const savedMode = LocalStorage.getItem('darkMode')

  if (savedMode !== null) {
    $q.dark.set(savedMode)
  }
})

const darkMode = computed({
  get: () => $q.dark.isActive,
  set: (val) => {
    $q.dark.set(val)
    LocalStorage.set('darkMode', val)
  },
})
</script>
