<template>
  <section class="album-page" :class="pageClasses" :data-density="pageDensity">
    <template v-if="page.type === 'cover'">
      <div class="album-page__cover">
        <p class="album-page__eyebrow">Ball Brac Cup</p>
        <h1 class="album-page__cover-title">{{ page.title }}</h1>
      </div>
    </template>

    <template v-else>
      <header class="album-page__header">
        <div v-if="showBrazilFlag" class="album-page__flag-row">
          <span class="album-page__flag album-page__flag--brazil" aria-label="Bandeira do Brasil" />
          <span class="album-page__flag-label">Seleção Brasileira</span>
        </div>

        <h2 class="album-page__title" :class="titleSizeClass">{{ page.title }}</h2>
      </header>

      <div class="album-page__slot-grid" :class="layoutClass">
        <StickerSlot v-for="sticker in page.stickers" :key="sticker.id" :sticker="sticker" />
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StickerSlot from '../StickerSlot.vue'

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
})

const layoutClass = computed(() => {
  const layout = props.page.layout ?? 'custom'
  return `album-page__slot-grid--${layout}`
})

const pageClasses = computed(() => ({
  'album-page--cover': props.page.type === 'cover',
  'album-page--content': props.page.type !== 'cover',
}))

const pageDensity = computed(() => (props.page.type === 'cover' ? 'hard' : 'soft'))

const showBrazilFlag = computed(() => props.page.headerFlag === 'brazil')

const titleSizeClass = computed(() =>
  props.page.titleSize === 'large' ? 'album-page__title--large' : 'album-page__title--normal',
)
</script>

<style scoped>
.album-page {
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 1.25rem;
  box-sizing: border-box;
  border-radius: 2px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #102033;
}

.album-page--cover {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  background-color: #2e7d32;
}

.album-page__cover {
  max-width: 20rem;
  display: grid;
  gap: 0.9rem;
}

.album-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.8;
}

.album-page__cover-title,
.album-page__title {
  margin: 0;
  line-height: 1.02;
}

.album-page__cover-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
}

.album-page__cover-subtitle {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.86;
}

.album-page--content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fdd835;
}

.album-page__header {
  display: grid;
  gap: 0.35rem;
}

.album-page__flag-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.album-page__flag {
  width: 1.25rem;
  height: 0.9rem;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(16, 32, 51, 0.15);
}

.album-page__flag--brazil {
  background:
    radial-gradient(circle at center, #0a4ea3 0 24%, transparent 26%),
    conic-gradient(
      from 45deg,
      transparent 0 25%,
      #ffde00 25% 50%,
      transparent 50% 75%,
      #ffde00 75% 100%
    ),
    #19964b;
}

.album-page__flag-label {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0.78;
}

.album-page__title {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
}

.album-page__title--large {
  font-size: clamp(2rem, 4.3vw, 2.9rem);
  line-height: 0.95;
}

.album-page__title--normal {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
}

.album-page__slot-grid {
  flex: 1;
  display: grid;
  gap: 0.75rem;
}

.album-page__slot-grid--6 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.album-page__slot-grid--9 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.album-page__slot-grid--12 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.album-page__slot-grid--15 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.album-page__slot-grid--custom {
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
}
</style>
