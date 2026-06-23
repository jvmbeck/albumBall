import { collection, onSnapshot } from 'firebase/firestore'
import { firestoreDb } from '@/boot/firebase'

export function subscribeToEmployees(onNext, onError) {
  const employeesCollection = collection(firestoreDb, 'employees')
  return onSnapshot(employeesCollection, onNext, onError)
}
