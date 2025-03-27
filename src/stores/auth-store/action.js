import { db } from 'boot/firebase';  // Ensure you have proper Firestore import
import { collection, addDoc ,getDocs } from 'firebase/firestore';


export default {
  async registerUser(name, email, batch, id, department, password) {
    console.log("Input Data:", { name, email, batch, id, department });

    try {
      const userRef = await addDoc(collection(db, "users"), {
        name: name,
        email: email,
        studentId: id,
        batch: batch,
        department: department,
        password: password,
        createdAt: new Date(),
      });

      return { success: true, message: "User details saved successfully", userId: userRef.id };
    } catch (error) {
      console.error("Error saving user data to Firestore:", error.code, error.message);
      throw error;
    }
  },

  // Log in a user
  async loginUser(email, password) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        console.log("Login successful for user:", user);
        this.user=user
        return { success: true, message: "Login successful", user };
      } else {
        console.error("Invalid email or password.");
        return { success: false, message: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  },

}
