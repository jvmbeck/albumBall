<template>
  <article class="sticker-slot" :class="slotClasses">
    <template v-if="sticker.revealed">
      <img class="sticker-slot__image" :src="sticker.imageUrl" :alt="sticker.name" />
      <div class="sticker-slot__label">{{ sticker.name }}</div>
    </template>

    <template v-else>
      <div class="sticker-slot__placeholder">
        <div class="sticker-slot__placeholder-icon">?</div>
        <div class="sticker-slot__placeholder-text">Figurinha não revelada</div>
      </div>
    </template>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sticker: {
    type: Object,
    required: true,
  },
})

const slotClasses = computed(() => ({
  'sticker-slot--revealed': props.sticker.revealed,
  'sticker-slot--hidden': !props.sticker.revealed,
}))
</script>

<style scoped>
.sticker-slot {
  min-width: 0;
  min-height: 0;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.sticker-slot--revealed {
  padding: 0.25rem;
  display: grid;
  gap: 0.1rem;
  align-content: start;
}

.sticker-slot--hidden {
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.9), rgba(241, 245, 249, 0.9));
}

.sticker-slot__image {
  width: 100%;
  max-height: 90%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.sticker-slot__label {
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
  color: #0f172a;
}

.sticker-slot__placeholder {
  display: grid;
  gap: 0.5rem;
  place-items: center;
  text-align: center;
  color: rgba(15, 23, 42, 0.6);
}

.sticker-slot__placeholder-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  font-weight: 800;
}

.sticker-slot__placeholder-text {
  font-size: 0.72rem;
  font-weight: 600;
}
</style>
