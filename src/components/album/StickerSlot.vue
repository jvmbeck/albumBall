<template>
  <article
    class="sticker-slot"
    :class="[slotClasses, animationClasses]"
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
      <div v-if="showRevealCurtain" class="sticker-slot__reveal-curtain" aria-hidden="true">
        <div class="sticker-slot__placeholder-icon">?</div>
      </div>
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  sticker: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['preview'])

const hasImage = computed(() => Boolean(props.sticker.imageUrl))

const showImage = computed(() => props.sticker.revealed && hasImage.value)
const MISSING_PLACEHOLDER_DELAY_MS = 1200

const revealToken = computed(() => Number(props.sticker.revealToken ?? 0))
const isAwaitingImage = ref(false)
const lastConsumedRevealToken = ref(revealToken.value)

const isAnimatingReveal = ref(false)
const revealStage = ref('idle')
const reducedMotionQuery =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null
const prefersReducedMotion = ref(reducedMotionQuery?.matches ?? false)

let stageTimerIds = []
let missingPlaceholderTimerId = null

if (reducedMotionQuery) {
  const syncReducedMotionPreference = (event) => {
    prefersReducedMotion.value = event.matches
  }

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', syncReducedMotionPreference)

    onBeforeUnmount(() => {
      reducedMotionQuery.removeEventListener('change', syncReducedMotionPreference)
    })
  } else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener(syncReducedMotionPreference)

    onBeforeUnmount(() => {
      reducedMotionQuery.removeListener(syncReducedMotionPreference)
    })
  }
}

const showMissingPlaceholder = computed(
  () => props.sticker.revealed && !hasImage.value && !isAwaitingImage.value,
)

const placeholderText = computed(() => {
  if (showMissingPlaceholder.value) {
    return 'Figurinha revelada sem imagem'
  }

  if (isAwaitingImage.value) {
    return 'Revelando figurinha...'
  }

  return 'Figurinha nao revelada'
})

const placeholderIcon = computed(() => (showMissingPlaceholder.value ? '!' : '?'))

const slotClasses = computed(() => ({
  'sticker-slot--revealed': showImage.value,
  'sticker-slot--missing': showMissingPlaceholder.value,
  'sticker-slot--hidden': !showImage.value && !showMissingPlaceholder.value,
}))

const animationClasses = computed(() => ({
  'sticker-slot--animating': isAnimatingReveal.value,
  'sticker-slot--flash': revealStage.value === 'flash',
  'sticker-slot--scale': revealStage.value === 'scale',
  'sticker-slot--flip-out': revealStage.value === 'flip-out',
  'sticker-slot--flip-in': revealStage.value === 'flip-in',
  'sticker-slot--settle': revealStage.value === 'settle',
}))

const showRevealCurtain = computed(
  () =>
    isAnimatingReveal.value && revealStage.value !== 'flip-in' && revealStage.value !== 'settle',
)

watch(
  [revealToken, showImage],
  ([nextToken, nextShowImage]) => {
    if (!nextShowImage) {
      stopRevealAnimation()
      return
    }

    if (nextToken > lastConsumedRevealToken.value && nextToken > 0) {
      lastConsumedRevealToken.value = nextToken
      startRevealAnimation()
    }
  },
  { immediate: true },
)

watch(
  [() => props.sticker.revealed, hasImage],
  ([isRevealed, hasImageNow]) => {
    clearMissingPlaceholderTimer()

    if (!isRevealed) {
      isAwaitingImage.value = false
      return
    }

    if (hasImageNow) {
      isAwaitingImage.value = false
      return
    }

    isAwaitingImage.value = true
    missingPlaceholderTimerId = window.setTimeout(() => {
      isAwaitingImage.value = false
      missingPlaceholderTimerId = null
    }, MISSING_PLACEHOLDER_DELAY_MS)
  },
  { immediate: true },
)

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

function queueRevealStage(stage, delay) {
  const timerId = window.setTimeout(() => {
    revealStage.value = stage
  }, delay)

  stageTimerIds.push(timerId)
}

function startRevealAnimation() {
  stopRevealAnimation()

  if (prefersReducedMotion.value) {
    return
  }

  isAnimatingReveal.value = true
  revealStage.value = 'idle'

  queueRevealStage('flash', 100)
  queueRevealStage('scale', 300)
  queueRevealStage('flip-out', 500)
  queueRevealStage('flip-in', 1000)
  queueRevealStage('settle', 1200)

  const finishTimerId = window.setTimeout(() => {
    stopRevealAnimation()
  }, 1450)

  stageTimerIds.push(finishTimerId)
}

function stopRevealAnimation() {
  if (stageTimerIds.length > 0) {
    stageTimerIds.forEach((timerId) => {
      window.clearTimeout(timerId)
    })
  }

  stageTimerIds = []
  isAnimatingReveal.value = false
  revealStage.value = 'idle'
}

function clearMissingPlaceholderTimer() {
  if (missingPlaceholderTimerId !== null) {
    window.clearTimeout(missingPlaceholderTimerId)
    missingPlaceholderTimerId = null
  }
}

onBeforeUnmount(() => {
  stopRevealAnimation()
  clearMissingPlaceholderTimer()
})
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
  cursor: zoom-in;
  border-color: rgba(15, 23, 42, 0.2);
  box-shadow: 0 10px 12px rgba(0, 0, 0, 0.15);
}

.sticker-slot--revealed:hover {
  transition: all 0.5s ease;
  transform: scale(1.15);
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.2);
}

.sticker-slot--animating {
  transform-style: preserve-3d;
  will-change: transform, box-shadow, filter;
}

.sticker-slot--flash {
  animation: sticker-reveal-flash 200ms ease-out forwards;
}

.sticker-slot--scale {
  animation: sticker-reveal-scale 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.sticker-slot--flip-out {
  animation: sticker-reveal-flip-out 500ms cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

.sticker-slot--flip-in {
  animation: sticker-reveal-flip-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.sticker-slot--settle {
  animation: sticker-reveal-settle 250ms ease-out forwards;
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
  backface-visibility: hidden;
}

.sticker-slot__reveal-curtain {
  position: absolute;
  inset: 0.25rem;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.96), rgba(241, 245, 249, 0.96));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  pointer-events: none;
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

@keyframes sticker-reveal-flash {
  0% {
    box-shadow:
      0 10px 12px rgba(0, 0, 0, 0.15),
      0 0 0 0 rgba(255, 249, 196, 0.95);
    filter: brightness(1);
  }

  100% {
    box-shadow:
      0 12px 15px rgba(0, 0, 0, 0.18),
      0 0 0 14px rgba(255, 249, 196, 0);
    filter: brightness(1.06);
  }
}

@keyframes sticker-reveal-scale {
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1.1);
  }
}

@keyframes sticker-reveal-flip-out {
  0% {
    transform: scale(1.1) rotateY(0deg);
    filter: brightness(1.06);
  }

  100% {
    transform: scale(1) rotateY(90deg);
    filter: brightness(0.96);
  }
}

@keyframes sticker-reveal-flip-in {
  0% {
    transform: rotateY(90deg);
    filter: brightness(1);
  }

  100% {
    transform: rotateY(0deg);
    filter: brightness(1.02);
  }
}

@keyframes sticker-reveal-settle {
  0% {
    transform: scale(1.03);
    box-shadow: 0 13px 16px rgba(0, 0, 0, 0.2);
    filter: brightness(1.02);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 10px 12px rgba(0, 0, 0, 0.15);
    filter: brightness(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sticker-slot--animating,
  .sticker-slot--flash,
  .sticker-slot--scale,
  .sticker-slot--flip-out,
  .sticker-slot--flip-in,
  .sticker-slot--settle {
    animation: none !important;
    transform: none !important;
    filter: none !important;
  }
}
</style>
