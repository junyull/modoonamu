import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  // modootree 프로젝트 설정
  apiKey: "AIzaSyARnx7eJd-vo4fRO8lUt0vkJT-PdwBOdnY",
  authDomain: "modootree.firebaseapp.com",
  projectId: "modootree",
  storageBucket: "modootree.firebasestorage.app",
  messagingSenderId: "713152280381",
  appId: "1:713152280381:web:50bc4b30af0318a1adf754",
  measurementId: "G-11989289S0"
}

// 파이어베이스 초기화
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

// 파이어베이스 서비스 내보내기
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// 애널리틱스는 클라이언트 사이드에서만 초기화
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export default app 