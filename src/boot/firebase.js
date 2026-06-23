import { boot } from 'quasar/wrappers'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB0weZfAblwuiPLiFjHfIg7_OuZ45NBd4k',
  authDomain: 'album-ball.firebaseapp.com',
  projectId: 'album-ball',
  storageBucket: 'album-ball.firebasestorage.app',
  messagingSenderId: '129962045017',
  appId: '1:129962045017:web:ee73857481d90affd40b48',
  measurementId: 'G-7NLZRZW040',
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
const firestoreDb = getFirestore(firebaseApp)
const firebaseStorage = getStorage(firebaseApp)

export { firebaseApp, firestoreDb, firebaseStorage }

export default boot(() => {
  // Firebase is initialized by importing this boot file.
})
