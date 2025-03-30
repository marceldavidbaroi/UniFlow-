// import { db } from 'boot/firebase' // Ensure you have proper Firestore import
// import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
// import bcrypt from 'bcryptjs' // Make sure to install bcryptjs for password hashing
// import { useUserStore } from '../user-store'

// const userStore = useUserStore()

export default {
  setUser(user) {
    this.currentUser = user
    // console.log('current user from', this.currentUser)
    this.currentRole = user.role
  },
}
