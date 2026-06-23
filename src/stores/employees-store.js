import { defineStore } from 'pinia'
import { getDownloadURL, ref } from 'firebase/storage'
import { firebaseStorage } from '@/boot/firebase'
import { subscribeToEmployees } from '@/services/employees-realtime'

function toBoolean(value) {
  return value === true
}

function toNumber(value, fallback = 0) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

function normalizeEmployee(snapshotDoc) {
  const data = snapshotDoc.data() ?? {}

  return {
    id: typeof data.id === 'string' && data.id.trim().length > 0 ? data.id : snapshotDoc.id,
    name: typeof data.name === 'string' ? data.name : '',
    role: typeof data.role === 'string' ? data.role : '',
    department: typeof data.department === 'string' ? data.department : '',
    imagePath: typeof data.imagePath === 'string' ? data.imagePath : '',
    revealed: toBoolean(data.revealed),
    albumOrder: toNumber(data.albumOrder, Number.MAX_SAFE_INTEGER),
  }
}

async function resolveEmployeeImageUrl(imagePath) {
  if (!imagePath) {
    return ''
  }

  const storageRef = ref(firebaseStorage, imagePath)
  return getDownloadURL(storageRef)
}

function byAlbumOrderThenId(a, b) {
  if (a.albumOrder !== b.albumOrder) {
    return a.albumOrder - b.albumOrder
  }

  return a.id.localeCompare(b.id)
}

export const useEmployeesStore = defineStore('employees', {
  state: () => ({
    employeesById: {},
    imageUrlsById: {},
    revealEventsById: {},
    loading: false,
    error: '',
    unsubscribe: null,
  }),

  getters: {
    sortedEmployees: (state) => Object.values(state.employeesById).slice().sort(byAlbumOrderThenId),

    albumEmployees: (state) =>
      Object.values(state.employeesById)
        .slice()
        .sort(byAlbumOrderThenId)
        .map((employee) => ({
          ...employee,
          revealToken: state.revealEventsById[employee.id] ?? 0,
          imageUrl: state.imageUrlsById[employee.id] ?? '',
        })),
  },

  actions: {
    async syncEmployeeImage(employeeId) {
      const employee = this.employeesById[employeeId]

      if (!employee || !employee.revealed || !employee.imagePath) {
        if (this.imageUrlsById[employeeId] === '') {
          return
        }

        this.imageUrlsById = {
          ...this.imageUrlsById,
          [employeeId]: '',
        }
        return
      }

      try {
        const imageUrl = await resolveEmployeeImageUrl(employee.imagePath)
        const latestEmployee = this.employeesById[employeeId]

        if (
          !latestEmployee ||
          !latestEmployee.revealed ||
          latestEmployee.imagePath !== employee.imagePath
        ) {
          return
        }

        this.imageUrlsById = {
          ...this.imageUrlsById,
          [employeeId]: imageUrl,
        }
      } catch {
        this.imageUrlsById = {
          ...this.imageUrlsById,
          [employeeId]: '',
        }
      }
    },

    async syncImagesForEmployees(employees) {
      const activeEmployeeIds = new Set(employees.map((employee) => employee.id))
      const nextImageUrlsById = Object.fromEntries(
        Object.entries(this.imageUrlsById).filter(([employeeId]) =>
          activeEmployeeIds.has(employeeId),
        ),
      )

      this.imageUrlsById = nextImageUrlsById

      await Promise.all(employees.map((employee) => this.syncEmployeeImage(employee.id)))
    },

    startRealtime() {
      if (this.unsubscribe) {
        return Promise.resolve()
      }

      this.loading = true
      this.error = ''

      let resolveInitialSnapshot = null
      const initialSnapshotReady = new Promise((resolve) => {
        resolveInitialSnapshot = resolve
      })

      let hasResolvedInitialSnapshot = false

      this.unsubscribe = subscribeToEmployees(
        async (snapshot) => {
          const employees = snapshot.docs.map((doc) => normalizeEmployee(doc))
          const previousEmployeesById = this.employeesById
          const previousRevealEventsById = this.revealEventsById
          const nextEmployeesById = Object.fromEntries(
            employees.map((employee) => [employee.id, employee]),
          )
          const nextRevealEventsById = { ...previousRevealEventsById }

          for (const employee of employees) {
            const previousEmployee = previousEmployeesById[employee.id]
            const wasRevealed = previousEmployee?.revealed === true

            if (!wasRevealed && employee.revealed) {
              const previousToken = previousRevealEventsById[employee.id] ?? 0
              nextRevealEventsById[employee.id] = previousToken + 1
            }
          }

          const activeEmployeeIds = new Set(employees.map((employee) => employee.id))
          const prunedRevealEventsById = Object.fromEntries(
            Object.entries(nextRevealEventsById).filter(([employeeId]) =>
              activeEmployeeIds.has(employeeId),
            ),
          )

          this.$patch({
            employeesById: nextEmployeesById,
            revealEventsById: prunedRevealEventsById,
            loading: false,
            error: '',
          })

          await this.syncImagesForEmployees(employees)

          if (!hasResolvedInitialSnapshot) {
            hasResolvedInitialSnapshot = true
            resolveInitialSnapshot?.()
          }
        },
        (error) => {
          this.error = error?.message ?? 'Could not load employees'
          this.loading = false

          if (!hasResolvedInitialSnapshot) {
            hasResolvedInitialSnapshot = true
            resolveInitialSnapshot?.()
          }
        },
      )

      return initialSnapshotReady
    },

    stopRealtime() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    },
  },
})
