import { db } from 'boot/firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  getDoc,
} from 'firebase/firestore'
import { useUserStore } from '../user-store'
import { getNextSessionNumber } from 'src/services/firebaseService'

const userStore = useUserStore()

export default {
  async createSession(userId, payload) {
    const sessionNumber = await getNextSessionNumber()
    if (!sessionNumber) return // Prevent session creation if there's an error
    try {
      await addDoc(collection(db, 'sessions'), {
        sessionID: sessionNumber,
        createdBy: userId,
        createdAt: serverTimestamp(),
        participants: [userId],
        isActive: true,
        ...payload,
      })
      // console.log('Session created with ID: ', docRef.id)
      return { success: true, message: 'Session Successfully Created' }
    } catch (error) {
      return { success: false, message: 'Error creating session', error }
      // console.error('Error creating session: ', error)
    }
  },

  async joinSession(sessionId, userId) {
    try {
      const sessionRef = doc(db, 'sessions', sessionId)
      await updateDoc(sessionRef, {
        participants: arrayUnion(userId),
      })
      console.log('User joined the session!')
    } catch (error) {
      console.error('Error joining session: ', error)
    }
  },

  async endSession(sessionId) {
    try {
      const sessionRef = doc(db, 'sessions', sessionId)
      await updateDoc(sessionRef, {
        isActive: false,
      })
      console.log('Session ended.')
    } catch (error) {
      console.error('Error ending session: ', error)
    }
  },

  // get all session data by user
  async fetchAllSession() {
    try {
      const querySnapshot = await getDocs(collection(db, 'sessions'))
      const sessions = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((session) => session.createdBy === userStore.currentUser?.id)

      this.sessionList = sessions
      this.sessionCount = sessions.length
      return { success: true, message: 'all data fetched', data: sessions }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async updateSessionData(sessionId, newData) {
    try {
      // Reference to the session document
      const sessionDocRef = doc(db, 'sessions', sessionId)

      // Update specific fields in the document
      await updateDoc(sessionDocRef, newData)

      console.log('Session data updated successfully!')
    } catch (error) {
      console.error('Error updating session: ', error)
    }
  },

  async searchSessionById(sessionId) {
    const sessionDocRef = doc(db, 'sessions', sessionId)

    try {
      const sessionDocSnap = await getDoc(sessionDocRef)
      if (!sessionDocSnap.exists()) {
        throw new Error('Session not found')
      }
      console.log('API', sessionDocSnap.data())
      return sessionDocSnap.data()
    } catch (error) {
      console.error('Error fetching session: ', error.message)
      return null // Or return error.message or re-throw if needed
    }
  },
}
