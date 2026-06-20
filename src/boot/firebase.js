// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
