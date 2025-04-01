import { db } from 'boot/firebase' // Import initialized Firebase instance
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

export async function getNextSessionNumber() {
  const counterRef = doc(db, 'metadata', 'counters')

  try {
    const counterSnap = await getDoc(counterRef)

    if (counterSnap.exists()) {
      await updateDoc(counterRef, { sessionCount: increment(1) })
      return counterSnap.data().sessionCount + 1
    } else {
      await setDoc(counterRef, { sessionCount: 1 })
      return 1
    }
  } catch (error) {
    console.error('Error getting session number:', error)
    return null
  }
}

export async function createSession(userId, payload) {
  const sessionNumber = await getNextSessionNumber()
  if (!sessionNumber) return null

  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      sessionNumber,
      createdBy: userId,
      createdAt: serverTimestamp(),
      participants: [userId],
      isActive: true,
      ...payload,
    })

    console.log('Session created with ID:', docRef.id, 'Session Number:', sessionNumber)
    return docRef.id
  } catch (error) {
    console.error('Error creating session:', error)
    return null
  }
}

export async function searchSessionByNumber(sessionNumber) {
  const sessionsRef = collection(db, 'sessions')
  const querySnapshot = await getDocs(
    query(sessionsRef, where('sessionNumber', '==', sessionNumber)),
  )

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data()
  } else {
    return null
  }
}
