import { db } from 'boot/firebase'
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import bcrypt from 'bcryptjs'
import { useUserStore } from '../user-store'

const userStore = useUserStore()
export default {
  // create a group
  async createGroup(
    groupName,
    batch,
    semester,
    year,
    subjectName,
    description,
    groupRules,
    password,
    confirmPassword,
    maxMembers,
    labGroup,
  ) {
    try {
      if (
        !groupName ||
        !batch ||
        !semester ||
        !year ||
        !subjectName ||
        !password ||
        !confirmPassword
      ) {
        throw new Error('Please fill in all required fields.')
      }

      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match.' }
      }
      const groupQuery = query(collection(db, 'group'), where('groupName', '==', groupName))
      const existingGroups = await getDocs(groupQuery)

      if (!existingGroups.empty) {
        return {
          success: false,
          message: 'Group name already exists. Please choose a different name.',
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newGroup = {
        groupName,
        batch,
        semester,
        year,
        subjectName,
        description,
        groupRules,
        password: hashedPassword,
        maxMembers: maxMembers ? parseInt(maxMembers, 10) : null,
        labGroup: Boolean(labGroup),
        createdAt: new Date(),
        owner: userStore.currentUser,
      }

      const docRef = await addDoc(collection(db, 'group'), newGroup)
      this.group = docRef

      return { success: true, message: 'Group successfully created' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // get all group data by user
  async fetchAllGroups() {
    try {
      const querySnapshot = await getDocs(collection(db, 'group'))
      const groups = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((group) => group.owner?.id === userStore.currentUser?.id)

      this.groupList = groups
      this.groupCount = groups.length
      return { success: true, message: 'all data fetched', data: groups }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}
