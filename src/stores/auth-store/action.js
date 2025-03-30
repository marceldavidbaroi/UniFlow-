import { db } from 'boot/firebase' // Ensure you have proper Firestore import
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
    // console.log('Input Data:', {
    //   Name: name,
    //   Email: email,
    //   Batch: batch,
    //   ID: id,
    //   Department: department,
    //   Role: role.value,
    //   Faculty: faculty,
    //   'Admin Access Password': adminAccessPassword,
    //   Password: password,
    // })

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

      // let payload = null
      // if (role.value === 'teacher') {
      //   payload = {
      //     name,
      //     email,
      //     personId: id,
      //     role: role.value,
      //     faculty,
      //     department,
      //     password: hashedPassword,
      //     createdAt: new Date(),
      //   }
      // } else if (role.value === 'student') {
      //   payload = {
      //     name,
      //     email,
      //     personId: id,
      //     role: role.value,
      //     batch,
      //     department,
      //     password: hashedPassword,
      //     createdAt: new Date(),
      //   }
      // }

      // const hashedPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds
      // const userRef = await addDoc(usersRef, payload)
      // // const userRef = await addDoc(usersRef, {
      // //   name,
      // //   email,
      // //   personId: id,
      // //   role: role.value,
      // //   batch,
      // //   faculty,
      // //   department,
      // //   password: hashedPassword,
      // //   createdAt: new Date(),
      // // })

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
        password: hashedPassword, // Add hashed password at the end
      }

      const userRef = await addDoc(usersRef, payload)

      console.log('User registered successfully:', userRef.id)
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
          console.log('Login successful for user:', user)
          this.user = user
          userStore.setUser(user)
          console.log(userStore.currentUser)
          return { success: true, message: `Login successful as ${userStore.currentRole}`, user }
        } else {
          console.error('Invalid password.')
          return { success: false, message: 'Invalid password' }
        }
      } else {
        console.error('Invalid email or password.')
        return { success: false, message: 'Invalid email ' }
      }
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  },
}
