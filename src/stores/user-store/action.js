// import { db } from 'boot/firebase' // Ensure you have proper Firestore import
// import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
// import bcrypt from 'bcryptjs' // Make sure to install bcryptjs for password hashing
// import { useUserStore } from '../user-store'

import { db } from 'boot/firebase' // Assuming you have Firebase setup in boot/firebase.js
import { collection, doc, getDoc } from 'firebase/firestore'
// const userStore = useUserStore()

export default {
  //set current user data
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
        return null // Or throw an error if you prefer strict validation
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
      throw error // Re-throw the error for the calling function to handle
    }
  },
}
