/**
 * Functions:
 * - setUser(user)
 * - clearUser()
 * - getUserDetails(userId)
 */


import { db } from 'boot/firebase'
import { collection, doc, getDoc ,getDocs} from 'firebase/firestore'

export default {
  setUser(user) {
    this.currentUser = user
    this.currentRole = user.role
  },

  clearUser() {
    this.currentUser = null
    this.currentRole = null
  },

  async getUserDetails(userId) {
    try {
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        console.error('Invalid userId provided:', userId)
        return null
      }

      const usersCollection = collection(db, 'users')
      const userDocRef = doc(usersCollection, userId)
      const userDocSnapshot = await getDoc(userDocRef)

      if (userDocSnapshot.exists()) {
        return { id: userDocSnapshot.id, ...userDocSnapshot.data() }
      } else {
        console.log(`User with ID "${userId}" not found.`)
        return null
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      throw error
    }
  },
    async getAllUsers() {
    try {
      const usersCollection = collection(db, 'users')
      const snapshot = await getDocs(usersCollection)

      const data= snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unnamed'
      }))
      this.allUsers=data
      return data
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }
}
