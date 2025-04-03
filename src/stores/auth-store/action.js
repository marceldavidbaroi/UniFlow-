import { db } from 'boot/firebase'
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import bcrypt from 'bcryptjs'

import { useUserStore } from '../user-store'

const userStore = useUserStore()

export default {
  async registerUser(
    name,
    email,
    batch,
    id,
    department,
    faculty,
    adminAccessPassword,
    role,
    password,
  ) {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        return { success: false, message: 'User already exists' }
      }

      if (role.value === 'teacher' && adminAccessPassword !== '123123') {
        return { success: false, message: 'Wrong admin access password for Teacher' }
      }

      const commonPayload = {
        name,
        email,
        personId: id,
        role: role.value,
        department,
        createdAt: new Date(),
      }

      const roleSpecificData =
        role.value === 'teacher' ? { faculty } : role.value === 'student' ? { batch } : {}

      const hashedPassword = await bcrypt.hash(password, 10) // Ensure password is hashed before usage

      const payload = {
        ...commonPayload,
        ...roleSpecificData,
        password: hashedPassword,
      }

      const userRef = await addDoc(usersRef, payload)

      return { success: true, message: 'User registered successfully', userId: userRef.id }
    } catch (error) {
      console.error('Error saving user data to Firestore:', error.code, error.message)
      throw error
    }
  },

  // Log in a user

  async loginUser(email, password) {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      const user = users.find((user) => user.email === email)

      if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
          this.user = user
          this.isAuthenticated = true
          userStore.setUser(user)
          return { success: true, message: `Login successful as ${userStore.currentRole}`, user }
        } else {
          return { success: false, message: 'Invalid password' }
        }
      } else {
        return { success: false, message: 'Invalid email ' }
      }
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  },

  // Verify user password
  async verifyUserPassword(password) {
    try {
      if (!userStore.currentUser || !userStore.currentUser.password) {
        return { success: false, message: 'User not authenticated or password not found.' }
      }

      const isPasswordCorrect = await bcrypt.compare(password, userStore.currentUser.password)

      if (typeof isPasswordCorrect === 'boolean' && isPasswordCorrect) {
        return { success: true, message: 'Password verified successfully.' }
      } else {
        return { success: false, message: 'Invalid password.' }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Password verification failed. Please try again.',
        error: error,
      }
    }
  },
}
