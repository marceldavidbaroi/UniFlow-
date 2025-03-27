import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from 'boot/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { registerUser, loginUser, logoutUser } from './action'; // Fix import

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Monitor authentication state
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    isAuthenticated.value = !!firebaseUser;
  });

  return { user, isAuthenticated, registerUser, loginUser, logoutUser }; // Return functions separately
});
