import { db } from 'boot/firebase'
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
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

      // const hashedPassword = await bcrypt.hash(password, 10)

      const newGroup = {
        groupName,
        batch,
        semester,
        year,
        subjectName,
        description,
        groupRules,
        password: password,
        maxMembers: maxMembers ? parseInt(maxMembers, 10) : null,
        labGroup: Boolean(labGroup),
        createdAt: new Date(),
        owner: userStore.currentUser,
        members: [userStore.currentUser],
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

      // total member count
      const totalMember = groups.reduce((total, group) => {
        const memberCount = Array.isArray(group.members) ? group.members.length : 0
        return total + memberCount
      }, 0)

      this.groupList = groups
      this.groupCount = groups.length
      this.totalMemberCount = totalMember
      return { success: true, message: 'all data fetched', data: groups }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Function to add a member to a group
  async addMemberToGroup(groupId, password) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDocs(
        query(collection(db, 'group'), where('__name__', '==', groupId)),
      )
      if (groupSnapshot.empty) {
        return { success: false, message: 'Group not found' }
      }
      const groupData = groupSnapshot.docs[0].data()

      if (groupData.password !== password) {
        return { success: false, message: 'Incorrect password.' }
      }

      if (groupData.maxMembers && groupData.members.length >= groupData.maxMembers) {
        return { success: false, message: 'Group is full.' }
      }

      if (groupData.members.some((member) => member.id === userStore.currentUser.id)) {
        return { success: false, message: 'You are already a member of this group.' }
      }

      await updateDoc(groupDocRef, {
        members: arrayUnion(userStore.currentUser),
      })

      return { success: true, message: 'Member added to group.' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async searchGroupById(groupId) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDoc(groupDocRef)

      if (groupSnapshot.exists()) {
        return { success: true, data: { id: groupSnapshot.id, ...groupSnapshot.data() } }
      } else {
        return { success: false, message: 'Group not found.' }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}
