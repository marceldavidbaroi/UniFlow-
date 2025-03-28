import { db } from 'boot/firebase' // Ensure you have proper Firestore import
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import bcrypt from 'bcryptjs' // Make sure to install bcryptjs for password hashing
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
    console.log('Input Data:', {
      Name: name,
      Email: email,
      Batch: batch,
      ID: id,
      Department: department,
      Role: role.value,
      Faculty: faculty,
      'Admin Access Password': adminAccessPassword,
      Password: password,
    })

    try {
      // Query Firestore to check if a user with the given email already exists
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      console.log('Query Snapshot Size:', querySnapshot.size) // Log how many results are found

      if (!querySnapshot.empty) {
        console.log('User already exists!') // Debugging log
        return { success: false, message: 'User already exists' }
      }

      // Check if role is teacher and validate admin access password
      if (role.value === 'teacher' && adminAccessPassword !== '123123') {
        return { success: false, message: 'Wrong admin access password for Teacher' }
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds
      // console.log('hash password', typeof hashedPassword, hashedPassword)
      // If user does not exist, proceed with registration
      const userRef = await addDoc(usersRef, {
        name,
        email,
        personId: id,
        role: role.value,
        batch,
        faculty,
        department,
        password: hashedPassword, // Store hashed password instead of plain text
        createdAt: new Date(),
      })

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
      // Fetch all users from Firestore (consider optimizing this with queries in a production app)
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // Find the user by email
      const user = users.find((user) => user.email === email)

      if (user) {
        // Compare the entered password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
          console.log('Login successful for user:', user)
          this.user = user
          userStore.currentUser = user
          userStore.currentRole = user.role
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
