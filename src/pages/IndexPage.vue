<template>
  <q-page class="page">
    <div>
      <div class="text-subtitle1 text-weight-light q-mb-md">Ball</div>
      <div class="text-h2 text-weight-bold">Álbum de Figurinhas</div>
    </div>
    <StickerAlbum />
  </q-page>
</template>

<script setup>
import StickerAlbum from '@/components/StickerAlbum.vue'
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
