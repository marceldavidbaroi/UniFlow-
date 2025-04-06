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
        isActive: false,
        isEnded: false,
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
      const sessionSnap = await getDoc(sessionRef)

      if (!sessionSnap.exists()) {
        return {
          success: false,
          message: 'Session does not exist.',
        }
      }

      const sessionData = sessionSnap.data()

      // Check if session is ended
      if (sessionData.isEnded === true) {
        return {
          success: false,
          message: 'The session has already ended.',
        }
      }

      // Check if user is already a participant
      if (sessionData.participants?.includes(userId)) {
        return {
          success: true,
          message: 'You are already a participant.',
        }
      }

      // Add user to participants
      await updateDoc(sessionRef, {
        participants: arrayUnion(userId),
      })

      return {
        success: true,
        message: 'Successfully joined the session.',
      }
    } catch (error) {
      console.error('Error joining session:', error)
      return {
        success: false,
        message: 'An error occurred while joining the session.',
      }
    }
  },
  async endSession(sessionId) {
    try {
      const sessionRef = doc(db, 'sessions', sessionId)
      await updateDoc(sessionRef, {
        isActive: false,
        isEnded: true,
        discussionOption: false,
        endedAt: serverTimestamp(),
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
        .sort((a, b) => {
          // Handle Firebase Timestamp comparison
          const aTime = a.createdAt?.seconds || 0
          const bTime = b.createdAt?.seconds || 0
          return bTime - aTime // Newest first
        })

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

  sortSessionsBy(field, order = 'desc') {
    if (!this.sessionList || !Array.isArray(this.sessionList)) return

    this.sessionList.sort((a, b) => {
      const aValue = a[field]
      const bValue = b[field]

      if (!aValue || !bValue) return 0

      // If the value is a Firestore Timestamp, sort by seconds
      const aComparable = aValue?.seconds || aValue
      const bComparable = bValue?.seconds || bValue

      if (order === 'asc') {
        return aComparable > bComparable ? 1 : -1
      } else {
        return aComparable < bComparable ? 1 : -1
      }
    })
  },
}
