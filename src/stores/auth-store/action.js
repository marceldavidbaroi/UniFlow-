import { db } from 'boot/firebase' // Ensure you have proper Firestore import
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
// import bcrypt from 'bcryptjs' // Make sure to install bcryptjs for password hashing

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
      if (role.value === 'teacher' && adminAccessPassword !== '123456') {
        return { success: false, message: 'Wrong admin access password for Teacher' }
      }

      // Hash password before saving
      // const hashedPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds

      // If user does not exist, proceed with registration
      const userRef = await addDoc(usersRef, {
        name,
        email,
        personId: id,
        role: role.value,
        batch,
        faculty,
        department,
        password, // Store hashed password instead of plain text
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
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      const user = users.find((user) => user.email === email && user.password === password)

      if (user) {
        console.log('Login successful for user:', user)
        this.user = user
        return { success: true, message: 'Login successful', user }
      } else {
        console.error('Invalid email or password.')
        return { success: false, message: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Login error:', error.message)
      throw error
    }
  },
}
