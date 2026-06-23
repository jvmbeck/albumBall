import { firestoreDb } from '@/boot/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

export default async function revealSticker(employeeId = 'emp-01') {
  const employeeRef = doc(firestoreDb, 'employees', employeeId)
  const employee = await getDoc(employeeRef)

  if (!employee.exists()) {
    throw new Error('Employee not found')
  }

  await updateDoc(employeeRef, {
    revealed: employee.data().revealed ? false : true,
  })
}
