import { db } from 'boot/firebase'
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore'

export default {
  async createSession(userId, payload) {
    try {
      const docRef = await addDoc(collection(db, 'sessions'), {
        createdBy: userId,
        createdAt: serverTimestamp(),
        participants: [userId],
        isActive: true,
        ...payload,
      })
      console.log('Session created with ID: ', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error creating session: ', error)
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
}
