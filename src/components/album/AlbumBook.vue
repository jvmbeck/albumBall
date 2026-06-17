<template>
  <section class="album-book">
    <div ref="bookRef" class="album-book__flipbook">
      <AlbumPage
        v-for="page in resolvedPages"
        :key="page.id"
        class="album-book__page"
        :page="page"
      />
    </div>

    <div class="album-book__controls">
      <q-btn flat color="primary" label="Anterior" icon="chevron_left" @click="goToPreviousPage" />
      <q-btn
        flat
        color="primary"
        label="Próximo"
        icon-right="chevron_right"
        @click="goToNextPage"
      />
    </div>

    <div class="album-book__status text-caption">Página atual: {{ currentPageNumber }}</div>
  </section>
</template>

<script>
function createStickerImage(name, color) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="40" fill="url(#bg)" />
      <circle cx="192" cy="60" r="30" fill="rgba(255,255,255,0.12)" />
      <circle cx="70" cy="196" r="44" fill="rgba(255,255,255,0.08)" />
      <text x="50%" y="48%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="74" font-weight="800" fill="#ffffff">${initials}</text>
      <text x="50%" y="74%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="2" fill="rgba(255,255,255,0.72)">${name}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function createSticker(id, name, revealed, color) {
  return {
    id,
    name,
    revealed,
    imageUrl: revealed ? createStickerImage(name, color) : '',
  }
}

const defaultPages = [
  {
    id: 'cover',
    type: 'cover',
    title: 'Album Ball',
    background: '#2e7d32',
  },
  {
    id: 1,
    title: 'We are BRAC',
    titleSize: 'large',
    headerFlag: 'brazil',
    layout: '6',
    background: '#fdd835',
    stickers: [
      createSticker('emp-001', 'Maria', true, '#2563eb'),
      createSticker('emp-002', 'Lucas', true, '#0f766e'),
      createSticker('emp-003', 'Ana', false, '#64748b'),
      createSticker('emp-004', 'João', true, '#d97706'),
      createSticker('emp-005', 'Paula', false, '#7c3aed'),
      createSticker('emp-006', 'Rafael', true, '#db2777'),
    ],
  },
  {
    id: 2,
    title: 'Supervisores',
    titleSize: 'normal',
    layout: '9',
    background: '#fdd835',
    stickers: [
      createSticker('emp-007', 'Bruna', true, '#dc2626'),
      createSticker('emp-008', 'Diego', false, '#0891b2'),
      createSticker('emp-009', 'Fernanda', true, '#16a34a'),
      createSticker('emp-010', 'Gustavo', false, '#9333ea'),
      createSticker('emp-011', 'Helena', true, '#ca8a04'),
      createSticker('emp-012', 'Igor', false, '#475569'),
      createSticker('emp-013', 'Julia', true, '#14b8a6'),
      createSticker('emp-014', 'Kevin', false, '#f97316'),
      createSticker('emp-015', 'Larissa', true, '#4f46e5'),
    ],
  },
  {
    id: 'back-cover',
    type: 'cover',
    title: 'Obrigado por participar!',
    background: '#2e7d32',
  },
]
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { PageFlip } from 'page-flip'
import AlbumPage from './pages/AlbumPage.vue'

const props = defineProps({
  pages: {
    type: Array,
    default: () => defaultPages,
  },
})

const bookRef = ref(null)
const pageFlip = ref(null)
const currentPageIndex = ref(0)

const resolvedPages = computed(() => (props.pages?.length ? props.pages : defaultPages))

const currentPageNumber = computed(() => currentPageIndex.value + 1)

function goToPreviousPage() {
  pageFlip.value?.flipPrev()
}

function goToNextPage() {
  pageFlip.value?.flipNext()
}

onMounted(() => {
  if (!bookRef.value) {
    return
  }

  pageFlip.value = new PageFlip(bookRef.value, {
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

  pageFlip.value.loadFromHTML(bookRef.value.querySelectorAll('.album-book__page'))

  pageFlip.value.on('flip', (event) => {
    currentPageIndex.value = event.data
  })
})

onBeforeUnmount(() => {
  pageFlip.value?.destroy()
})
</script>

<style scoped>
.album-book {
  width: min(100%, 960px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.album-book__flipbook {
  width: min(100%, 900px);
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.18);
}

.album-book__page {
  display: block;
  width: 100%;
  height: 100%;
}

:deep(.album-book__page .album-page) {
  width: 100%;
  height: 100%;
}

.album-book__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.album-book__status {
  opacity: 0.7;
}
</style>
