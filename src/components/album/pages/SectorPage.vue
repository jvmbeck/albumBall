<template>
  <div class="sector-page">
    <div class="text-h3">{{ sector }}</div>
  </div>
</template>

<script setup>
defineProps({
  sector: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.sector-page {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
