<template>
  <div ref="bookContainer" class="book">
    <div class="page cover" data-density="hard">Cover</div>

    <div class="page">Sector A</div>

    <div class="page">Sector B</div>

    <div class="page">Sector C</div>

    <div class="page cover" data-density="hard">Back Cover</div>
  </div>

  <div class="q-mt-md flex justify-center gap-4">
    <q-btn label="Anterior" @click="pageFlip.flipPrev()" />

    <q-btn label="Próximo" @click="pageFlip.flipNext()" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PageFlip } from 'page-flip'

const bookContainer = ref(null)
let pageFlip = null

onMounted(() => {
  pageFlip = new PageFlip(bookContainer.value, {
    width: 450,
    height: 550,
    size: 'stretch',

    showCover: true,
    usePortrait: true,

    minWidth: 280,
    maxWidth: 450,

    minHeight: 400,
    maxHeight: 550,

    maxShadowOpacity: 0.5,
    flippingTime: 600,

    mobileScrollSupport: false,
  })

  pageFlip.loadFromHTML(bookContainer.value.querySelectorAll('.page'))

  pageFlip.on('flip', (e) => {
    console.log('Current page:', e.data)
  })
})

onBeforeUnmount(() => {
  pageFlip?.destroy()
})
</script>

<style scoped>
.book {
  margin: 0 auto;
  margin-top: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page {
  background: var(--album-page-bg);
}

.cover {
  background: green;
  color: var(--header-text-color);
}
</style>
