import { db } from 'boot/firebase' // Ensure you have proper Firestore import
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'

export default {
  async registerUser(name, email, batch, id, department, password) {
    console.log('Input Data:', { name, email, batch, id, department })

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

      // If user does not exist, proceed with registration
      const userRef = await addDoc(usersRef, {
        name,
        email,
        studentId: id,
        batch,
        department,
        password, // WARNING: Plain text password storage is insecure
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
