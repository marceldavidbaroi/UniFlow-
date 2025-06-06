/**
 * Functions:
 * - createGroup(groupName, batch, semester, year, courseName, description, groupRules, password, confirmPassword, maxMembers, labGroup)
 * - fetchAllGroups()
 * - addMemberToGroup(groupId, password)
 * - searchGroupById(groupId)
 * - fetchGroupsByStudent()
 * - deleteGroup(groupId)
 * - removeMemberFromGroup(groupId, memberId)
 * - editGroup(groupId, updatedData)
 * - filterGroups(filters)
 * - searchGroupByGroupNameForSearchAction(groupName)
 * - addGroupItem(groupId, type, data)
 * - editGroupItem(groupId, type, itemId, updatedData)
 * - deleteGroupItem(groupId, type, itemId)
 * - getGroupItems(groupId, type = null)

 */

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
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useUserStore } from '../user-store'

const typeConfigs = {
  resource: { collection: 'resources' },
  task: { collection: 'tasks' },
  announcement: { collection: 'announcements' },
  poll: { collection: 'polls' },
}

const userStore = useUserStore()
export default {
  // create a group
  async createGroup(payload) {
    try {
      const requiredFields = [
        'groupName',
        'semester',
        'year',
        'course', // changed from courseName to course
        'password',
        'confirmPassword',
      ]

      for (const field of requiredFields) {
        if (!payload[field]) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      if (payload.password !== payload.confirmPassword) {
        return { success: false, message: 'Passwords do not match.' }
      }

      const groupQuery = query(collection(db, 'group'), where('groupName', '==', payload.groupName))
      const existingGroups = await getDocs(groupQuery)

      if (!existingGroups.empty) {
        return {
          success: false,
          message: 'Group name already exists. Please choose a different name.',
        }
      }

      // Optional password hashing (uncomment if needed)
      // const hashedPassword = await bcrypt.hash(payload.password, 10)

      const newGroup = {
        ...payload,
        password: payload.password, // or use hashedPassword
        maxMembers: payload.maxMembers ? parseInt(payload.maxMembers, 10) : null,
        labGroup: Boolean(payload.labGroup),
        createdAt: new Date(),
        owner: userStore.currentUser,
        members: [userStore.currentUser],
      }

      delete newGroup.confirmPassword // Don't store confirmPassword

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
        return { success: true, message: 'You are already a member of this group.' }
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

  // Function to fetch all groups the student is a member of
  async fetchGroupsByStudent() {
    try {
      // Fetch all groups from the 'group' collection
      const querySnapshot = await getDocs(collection(db, 'group'))

      // Filter groups where the current student is a member
      const groups = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((group) => group.members.some((member) => member.id === userStore.currentUser.id))

      // Set the group data to store variables
      this.groupList = groups
      this.groupCount = groups.length
      this.totalMemberCount = groups.reduce((total, group) => {
        const memberCount = Array.isArray(group.members) ? group.members.length : 0
        return total + memberCount
      }, 0)

      // Return success with the filtered groups
      return { success: true, message: 'Groups fetched successfully', data: groups }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  async deleteGroup(groupId) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDoc(groupDocRef)

      if (!groupSnapshot.exists()) {
        return { success: false, message: 'Group not found.' }
      }

      const groupData = groupSnapshot.data()

      // Check ownership
      if (groupData.owner?.id !== userStore.currentUser?.id) {
        return { success: false, message: 'You are not authorized to delete this group.' }
      }

      // Delete the group
      await deleteDoc(groupDocRef)

      // Optionally update local store
      this.groupList = this.groupList?.filter((group) => group.id !== groupId) || []
      this.groupCount = this.groupList.length
      this.totalMemberCount = this.groupList.reduce((total, group) => {
        return total + (Array.isArray(group.members) ? group.members.length : 0)
      }, 0)

      return { success: true, message: 'Group deleted successfully.' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  async removeMemberFromGroup(groupId, memberId) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDoc(groupDocRef)

      if (!groupSnapshot.exists()) {
        return { success: false, message: 'Group not found.' }
      }

      const groupData = groupSnapshot.data()

      // Prevent owner from being removed
      if (groupData.owner?.id === memberId) {
        return {
          success: false,
          message: 'Owner cannot be removed from the group.',
        }
      }

      // Filter out the member to remove
      const updatedMembers = (groupData.members || []).filter((member) => member.id !== memberId)

      await updateDoc(groupDocRef, {
        members: updatedMembers,
      })

      return {
        success: true,
        message: 'Member successfully removed from group.',
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  async editGroup(groupId, updatedData) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDoc(groupDocRef)

      if (!groupSnapshot.exists()) {
        return { success: false, message: 'Group not found.' }
      }

      const groupData = groupSnapshot.data()

      // Only the group owner can edit the group
      if (groupData.owner?.id !== userStore.currentUser?.id) {
        return { success: false, message: 'You are not authorized to edit this group.' }
      }

      const allowedFields = [
        'groupName',
        'batch',
        'semester',
        'year',
        'courseName',
        'description',
        'groupRules',
        'password',
        'maxMembers',
        'labGroup',
      ]

      const updates = {}

      allowedFields.forEach((field) => {
        if (field in updatedData) {
          updates[field] =
            field === 'maxMembers'
              ? parseInt(updatedData[field], 10)
              : field === 'labGroup'
                ? Boolean(updatedData[field])
                : updatedData[field]
        }
      })

      await updateDoc(groupDocRef, updates)

      return { success: true, message: 'Group successfully updated.' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async filterGroups(filters) {
    try {
      console.log('filter value', filters)
      let groupsQuery = collection(db, 'group')
      const queryConstraints = []

      if (filters.groupName) {
        queryConstraints.push(where('groupName', '>=', filters.groupName))
        queryConstraints.push(where('groupName', '<=', filters.groupName + '\uf8ff'))
      }
      if (filters.batch) {
        queryConstraints.push(where('batch', '==', filters.batch))
      }
      if (filters.semester) {
        queryConstraints.push(where('semester', '==', filters.semester))
      }
      if (filters.year) {
        queryConstraints.push(where('year', '==', filters.year))
      }
      if (filters.courseName) {
        queryConstraints.push(where('courseName', '>=', filters.courseName))
        queryConstraints.push(where('courseName', '<=', filters.courseName + '\uf8ff'))
      }
      if (
        filters.labGroup !== undefined &&
        filters.labGroup !== null &&
        filters.labGroup !== 'all'
      ) {
        queryConstraints.push(where('labGroup', '==', Boolean(filters.labGroup)))
      }

      const q = query(groupsQuery, ...queryConstraints)
      const querySnapshot = await getDocs(q)

      const filteredGroups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      this.groupList = filteredGroups
      this.filterActive = true

      return { success: true, data: filteredGroups }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  async searchGroupByGroupNameForSearchAction(groupName) {
    console.log('Searching by groupName (partial match):', groupName)

    const groupsRef = collection(db, 'group')
    const q = query(
      groupsRef,
      where('groupName', '>=', groupName),
      where('groupName', '<=', groupName + '\uf8ff'),
    )

    try {
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.warn('No groups found with a partial match for groupName:', groupName)
        return {
          success: false,
          message: 'No groups found matching the name',
          data: [],
        }
      }

      const groups = []
      querySnapshot.forEach((doc) => {
        groups.push({ id: doc.id, ...doc.data() })
      })

      console.log('Found matching groups:', groups)
      return {
        success: true,
        message: 'Matching groups found',
        data: groups, // Returning all groups that partially match
      }
    } catch (error) {
      console.error('Error searching groups (partial match):', error.message)
      return {
        success: false,
        message: `Error searching groups: ${error.message}`,
        data: [],
      }
    }
  },

  /**
   * Get all groups (details) for the current user (teacher or student).
   * @returns {Promise<Array<Object>>} Array of group objects (id + details).
   */
  async getAllGroupsForCurrentUser() {
    let result = []
    if (userStore.currentRole === 'teacher') {
      result = await this.fetchAllGroups()
    } else {
      result = await this.fetchGroupsByStudent()
    }
    // Each group already contains id and details
    return result?.data || []
  },

  async addGroupItem(groupId, type, data) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDoc(groupDocRef)

      if (!groupSnapshot.exists()) {
        return { success: false, message: 'Group not found.' }
      }

      const groupData = groupSnapshot.data()
      const currentUserId = userStore.currentUser?.id

      if (groupData.owner?.id !== currentUserId) {
        return { success: false, message: 'You are not authorized to modify this group.' }
      }

      const typeConfigs = {
        resource: {
          collection: 'resources',
          required: ['title', 'link'],
          buildData: (data) => ({
            title: data.title,
            description: data.description || '',
            link: data.link,
            addedBy: currentUserId,
            createdAt: serverTimestamp(),
          }),
        },
        task: {
          collection: 'tasks',
          required: ['name', 'link'],
          buildData: (data) => ({
            name: data.name,
            link: data.link,
            description: data.description || '',
            dueDate: data.dueDate || null,
            addedBy: currentUserId,
            createdAt: serverTimestamp(),
          }),
        },

        announcement: {
          collection: 'announcements',
          required: ['title', 'message'],
          buildData: (data) => ({
            title: data.title,
            message: data.message,
            addedBy: currentUserId,
            createdAt: serverTimestamp(),
          }),
        },
        poll: {
          collection: 'polls',
          required: ['title', 'options'],
          buildData: (data) => ({
            title: data.title,
            options: data.options,
            expiresAt: data.expiresAt || null,
            addedBy: currentUserId,
            createdAt: serverTimestamp(),
            votes: {}, // optional: track userId => selectedOption
          }),
          validate: (data) => {
            if (!Array.isArray(data.options) || data.options.length < 2) {
              return 'Poll must have at least 2 options.'
            }
            return null
          },
        },
      }

      const config = typeConfigs[type]

      if (!config) {
        return { success: false, message: 'Invalid item type.' }
      }

      // Validate required fields
      const missingFields = config.required.filter((field) => !data[field])
      if (missingFields.length) {
        return {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        }
      }

      // Run custom validation if defined
      if (config.validate) {
        const validationError = config.validate(data)
        if (validationError) {
          return { success: false, message: validationError }
        }
      }

      const itemData = config.buildData(data)
      const subColRef = collection(groupDocRef, config.collection)

      await addDoc(subColRef, itemData)

      return {
        success: true,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully.`,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
  async editGroupItem(groupId, type, itemId, updatedData) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnap = await getDoc(groupDocRef)

      if (!groupSnap.exists()) {
        return { success: false, message: 'Group not found.' }
      }

      const groupData = groupSnap.data()
      const currentUserId = userStore.currentUser?.id

      if (groupData.owner?.id !== currentUserId) {
        return { success: false, message: 'You are not authorized to edit this group.' }
      }

      const validTypes = {
        resource: 'resources',
        task: 'tasks',
        announcement: 'announcements',
        poll: 'polls',
      }

      const subCollection = validTypes[type]
      if (!subCollection) {
        return { success: false, message: 'Invalid item type.' }
      }

      const itemRef = doc(db, 'group', groupId, subCollection, itemId)
      const itemSnap = await getDoc(itemRef)

      if (!itemSnap.exists()) {
        return { success: false, message: 'Item not found.' }
      }

      await updateDoc(itemRef, {
        ...updatedData,
        updatedAt: new Date(),
      })

      return { success: true, message: `${type} updated successfully.` }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async deleteGroupItem(groupId, type, itemId) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnap = await getDoc(groupDocRef)

      if (!groupSnap.exists()) {
        return { success: false, message: 'Group not found.' }
      }

      const groupData = groupSnap.data()
      const currentUserId = userStore.currentUser?.id

      if (groupData.owner?.id !== currentUserId) {
        return { success: false, message: 'You are not authorized to delete this item.' }
      }

      const validTypes = {
        resource: 'resources',
        task: 'tasks',
        announcement: 'announcements',
        poll: 'polls',
      }

      const subCollection = validTypes[type]
      if (!subCollection) {
        return { success: false, message: 'Invalid item type.' }
      }

      const itemRef = doc(db, 'group', groupId, subCollection, itemId)
      const itemSnap = await getDoc(itemRef)

      if (!itemSnap.exists()) {
        return { success: false, message: 'Item not found.' }
      }

      await deleteDoc(itemRef)

      return { success: true, message: `${type} deleted successfully.` }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Get a group by its ID. Returns the group object or null if not found.
   * @param {string} groupId
   * @returns {Promise<Object|null>}
   */
  async getGroupById(groupId) {
    try {
      const groupDocRef = doc(db, 'group', groupId)
      const groupSnapshot = await getDoc(groupDocRef)
      if (groupSnapshot.exists()) {
        return { id: groupSnapshot.id, ...groupSnapshot.data() }
      } else {
        return null
      }
    } catch {
      return null
    }
  },
  async getGroupItems(groupId, type = null) {
    const groupDocRef = doc(db, 'group', groupId)
    const items = []

    const typesToFetch = type ? [type] : Object.keys(typeConfigs)

    for (const t of typesToFetch) {
      const config = typeConfigs[t]
      if (!config) {
        console.warn(`Invalid type: ${t}`)
        continue
      }

      const subColRef = collection(groupDocRef, config.collection)

      try {
        const snapshot = await getDocs(subColRef)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          type: t,
          ...doc.data(),
        }))
        items.push(...data)
      } catch (error) {
        console.error(`Failed to fetch ${t}:`, error)
      }
    }

    return items
  },
}
