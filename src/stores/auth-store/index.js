import { defineStore } from 'pinia';
// import { auth } from 'boot/firebase';
// import { onAuthStateChanged } from 'firebase/auth';
import actions from './action'; // Fix import

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions,
  persist: {
    key: 'auth',
    pick: ['user', 'isAuthenticated'],
  },
  created() {
    this.initAuthState();
  },
});
