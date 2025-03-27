import { db } from 'boot/firebase';  // Ensure you have proper Firestore import
import { collection, addDoc ,getDocs } from 'firebase/firestore';

const registerUser = async (name, email, batch, id, department,password) => {
  console.log("User registration triggered");

  // Log the input parameters to ensure valid data
  console.log("Input Data:", { name, email, batch, id, department });

  try {
    const userRef = await addDoc(collection(db, "users"), {
      name: name,
      email: email,
      studentId: id,
      batch: batch,
      department: department,
      password:password,
      createdAt: new Date(),
    });

    return { success: true, message: "User details saved successfully", userId: userRef.id };
  } catch (error) {
    console.error("Error saving user data to Firestore:", error.code, error.message);
    throw error;
  }
};
const loginUser = async (email, password) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      console.log("Login successful for user:", user);
      return { success: true, message: "Login successful", user };
    } else {
      console.error("Invalid email or password.");
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

const logoutUser = async () => {
  // try {
  //   await signOut(auth);
  //   console.log("User logged out");
  // } catch (error) {
  //   console.error("Logout error:", error.message);
  //   throw error;
  // }
};

// Export as named exports
export { registerUser, loginUser, logoutUser };
