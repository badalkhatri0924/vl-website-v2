// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRokvFbQmKX8OFHH0aidfwWrFXZSplUPk",
  authDomain: "versionlabs-official.firebaseapp.com",
  projectId: "versionlabs-official",
  storageBucket: "versionlabs-official.firebasestorage.app",
  messagingSenderId: "592977531131",
  appId: "1:592977531131:web:cd7a3b27c795a6ebb9e05e",
  measurementId: "G-6PRS72969V"
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} else {
  app = getApps()[0]
  db = getFirestore(app)
}

export { db }
export default app
