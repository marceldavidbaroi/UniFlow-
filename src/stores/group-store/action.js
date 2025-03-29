import { db } from 'boot/firebase' // Ensure you have proper Firestore import
import { collection, addDoc, getDocs, where, query } from 'firebase/firestore'
import bcrypt from 'bcryptjs'

export default {
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
        // throw new Error('Passwords do not match.')
        return { success: false, message: 'Passwords do not match.' }
      }
      // console.log('connected')
      const groupQuery = query(collection(db, 'group'), where('groupName', '==', groupName))
      const existingGroups = await getDocs(groupQuery)

      if (!existingGroups.empty) {
        // throw new Error('Group name already exists. Please choose a different name.')
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
      }

      const docRef = await addDoc(collection(db, 'group'), newGroup)
      this.group = docRef

      return { success: true, message: 'Group successfully created' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}
