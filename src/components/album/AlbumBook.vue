<template>
  <section class="album-book">
    <q-banner v-if="employeesStore.error" class="album-book__error" dense rounded>
      {{ employeesStore.error }}
    </q-banner>

    <div ref="bookRef" class="album-book__flipbook">
      <AlbumPage v-for="page in pages" :key="page.id" class="album-book__page" :page="page" />
    </div>

    <div v-if="employeesStore.loading" class="album-book__loading text-caption">
      Carregando figurinhas...
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

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { PageFlip } from 'page-flip'
import { useEmployeesStore } from '@/stores/employees-store.js'
import AlbumPage from './pages/AlbumPage.vue'
import { generateAlbumPages } from './page-generator'

const bookRef = ref(null)
const pageFlip = ref(null)
const currentPageIndex = ref(0)
const employeesStore = useEmployeesStore()

const pages = computed(() => generateAlbumPages(employeesStore.albumEmployees))

const currentPageNumber = computed(() => {
  if (!pages.value.length) {
    return 0
  }

  return currentPageIndex.value + 1
})

function goToPreviousPage() {
  pageFlip.value?.flipPrev()
}

function goToNextPage() {
  pageFlip.value?.flipNext()
}

function initPageFlip() {
  if (!bookRef.value || pageFlip.value) {
    return
  }

  const pageNodes = bookRef.value.querySelectorAll('.album-book__page')
  if (!pageNodes.length) {
    return
  }

  const instance = new PageFlip(bookRef.value, {
    width: 500,
    height: 700,
    size: 'stretch',
    showCover: true,
    usePortrait: true,
    minWidth: 280,
    maxWidth: 600,
    minHeight: 400,
    maxHeight: 700,
    maxShadowOpacity: 0.5,
    flippingTime: 600,
    mobileScrollSupport: false,
  })

  instance.loadFromHTML(pageNodes)

  instance.on('flip', (event) => {
    currentPageIndex.value = event.data
  })

  pageFlip.value = instance
}

onMounted(async () => {
  await employeesStore.startRealtime()
  await nextTick()
  initPageFlip()
})

onBeforeUnmount(() => {
  employeesStore.stopRealtime()
  pageFlip.value?.destroy()
  pageFlip.value = null
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
  width: min(100%, 600px);
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

.album-book__loading {
  opacity: 0.75;
}

.album-book__error {
  width: min(100%, 600px);
  background: rgba(176, 0, 32, 0.08);
  color: #7f1d1d;
}
</style>
