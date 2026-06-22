<template>
  <article
    class="sticker-slot stf__block"
    :class="[slotClasses]"
    :role="showImage ? 'button' : undefined"
    :tabindex="showImage ? 0 : undefined"
    @touchstart.stop.prevent="handlePreview"
    @touchmove.stop.prevent="handlePreview"
    @touchend.stop.prevent="handlePreview"
    @pointerdown.capture.stop.prevent="handlePointerDown"
    @mousedown.capture.stop.prevent
    @click.stop.prevent="handlePreview"
    @keydown.enter.stop.prevent="handlePreview"
    @keydown.space.stop.prevent="handlePreview"
  >
    <template v-if="showImage">
      <img class="sticker-slot__image" :src="sticker.imageUrl" :alt="sticker.name" />
    </template>

    <template v-else>
      <div class="sticker-slot__placeholder">
        <div class="sticker-slot__placeholder-icon">{{ placeholderIcon }}</div>
        <div class="sticker-slot__placeholder-text">{{ placeholderText }}</div>
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

const emit = defineEmits(['preview'])

const hasImage = computed(() => Boolean(props.sticker.imageUrl))

const showImage = computed(() => props.sticker.revealed && hasImage.value)

const placeholderText = computed(() =>
  props.sticker.revealed ? 'Figurinha revelada sem imagem' : 'Figurinha não revelada',
)

const placeholderIcon = computed(() => (props.sticker.revealed ? '!' : '?'))

const slotClasses = computed(() => ({
  'sticker-slot--revealed': showImage.value,
  'sticker-slot--missing': props.sticker.revealed && !hasImage.value,
  'sticker-slot--hidden': !showImage.value,
}))

function handlePreview() {
  if (!showImage.value) {
    return
  }

  emit('preview', props.sticker)
}

function handlePointerDown(event) {
  if (!showImage.value) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
}
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
  place-items: center;
  cursor: pointer;
}

.sticker-slot--hidden {
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.9), rgba(241, 245, 249, 0.9));
}

.sticker-slot--missing {
  border-style: dashed;
  border-color: rgba(180, 83, 9, 0.45);
  background: linear-gradient(180deg, rgba(254, 240, 138, 0.5), rgba(255, 251, 235, 0.9));
}

.sticker-slot__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 14px;
  display: block;
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
