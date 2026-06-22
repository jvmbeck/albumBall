<template>
  <q-page class="album-home">
    <section class="album-home__hero">
      <p class="album-home__eyebrow">Ball</p>
      <h1 class="album-home__title">Álbum de Figurinhas</h1>
    </section>

    <AlbumBook />
  </q-page>
</template>

<script setup>
import AlbumBook from '@/components/album/AlbumBook.vue'
</script>

<style scoped>
.album-home {
  width: 100%;
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 1rem 3rem;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.72), transparent 42%),
    linear-gradient(180deg, rgba(245, 238, 174, 0.7), rgba(238, 241, 246, 0.98));
}

.album-home__hero {
  width: min(100%, 960px);
  display: grid;
  gap: 0.5rem;
  text-align: center;
}

.album-home__eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.68;
}

.album-home__title {
  margin: 0;
  font-size: clamp(2.25rem, 4vw, 4rem);
  line-height: 0.95;
}

.album-home__subtitle {
  margin: 0 auto;
  max-width: 42rem;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.8;
}
</style>
