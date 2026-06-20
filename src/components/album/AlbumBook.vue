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
const localStickerModules = import.meta.glob('@/assets/stickers/*.png', {
  eager: true,
  import: 'default',
})

const localStickerById = Object.fromEntries(
  Object.entries(localStickerModules).map(([path, imageUrl]) => {
    const fileName = path.split('/').pop() ?? ''
    const stickerId = fileName.replace(/\.png$/i, '')
    return [stickerId, imageUrl]
  }),
)

function resolveStickerImage(id, revealed) {
  if (!revealed) {
    return ''
  }

  // Sticker files should live in src/assets/stickers using the sticker id as filename.
  return localStickerById[id] ?? ''
}

function createSticker(id, name, revealed) {
  return {
    id,
    name,
    revealed,
    imageUrl: resolveStickerImage(id, revealed),
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
      createSticker('emp-01', 'Maria', true),
      createSticker('emp-02', 'Lucas', true),
      createSticker('emp-03', 'Ana', false),
      createSticker('emp-04', 'João', true),
      createSticker('emp-05', 'Paula', false),
      createSticker('emp-06', 'Rafael', true),
    ],
  },
  {
    id: 2,
    title: 'Supervisores',
    titleSize: 'normal',
    layout: '9',
    background: '#fdd835',
    stickers: [
      createSticker('emp-07', 'Bruna', true),
      createSticker('emp-08', 'Diego', false),
      createSticker('emp-09', 'Fernanda', true),
      createSticker('emp-10', 'Gustavo', false),
      createSticker('emp-11', 'Helena', true),
      createSticker('emp-12', 'Igor', false),
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
