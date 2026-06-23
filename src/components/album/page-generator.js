const STICKERS_PER_PAGE = 6
const STICKERS_PER_SPREAD = 12

function chunkEmployees(employees) {
  const chunks = []

  for (let index = 0; index < employees.length; index += STICKERS_PER_SPREAD) {
    chunks.push(employees.slice(index, index + STICKERS_PER_SPREAD))
  }

  return chunks
}

function createEmptySlot(spreadNumber, side, slotIndex) {
  return {
    id: `empty-${spreadNumber}-${side}-${slotIndex + 1}`,
    name: 'Figurinha indisponivel',
    role: '',
    department: '',
    revealed: false,
    imagePath: '',
    imageUrl: '',
    revealToken: 0,
    albumOrder: Number.MAX_SAFE_INTEGER,
  }
}

function fillPageSlots(stickers, spreadNumber, side) {
  const filled = stickers.slice(0, STICKERS_PER_PAGE)

  while (filled.length < STICKERS_PER_PAGE) {
    filled.push(createEmptySlot(spreadNumber, side, filled.length))
  }

  return filled
}

function createContentPage(pageId, spreadNumber, side, stickers) {
  return {
    id: pageId,
    type: 'content',
    title: `Spread ${spreadNumber}`,
    titleSize: 'normal',
    layout: '6',
    background: '#fdd835',
    stickers: fillPageSlots(stickers, spreadNumber, side),
  }
}

function createCoverPage() {
  return {
    id: 'cover',
    type: 'cover',
    title: 'Album Ball',
    background: '#2e7d32',
  }
}

function createBackCoverPage() {
  return {
    id: 'back-cover',
    type: 'cover',
    title: 'Obrigado por participar!',
    background: '#2e7d32',
  }
}

export function generateAlbumPages(employees) {
  const normalizedEmployees = Array.isArray(employees) ? employees : []
  const spreadChunks = chunkEmployees(normalizedEmployees)

  const employeePages = spreadChunks.flatMap((spreadEmployees, spreadIndex) => {
    const spreadNumber = spreadIndex + 1
    const leftStickers = spreadEmployees.slice(0, STICKERS_PER_PAGE)
    const rightStickers = spreadEmployees.slice(STICKERS_PER_PAGE, STICKERS_PER_SPREAD)

    return [
      createContentPage(`spread-${spreadNumber}-left`, spreadNumber, 'left', leftStickers),
      createContentPage(`spread-${spreadNumber}-right`, spreadNumber, 'right', rightStickers),
    ]
  })

  return [createCoverPage(), ...employeePages, createBackCoverPage()]
}
