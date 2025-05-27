/**
 * Task Store Actions
 *
 * Functions:
 * - createTask(taskData): Create a new task in Firestore for the current user.
 * - getTasks(): Fetch all tasks from Firestore.
 * - getTaskById(taskId): Fetch a single task by its ID.
 * - getTasksByMemberId(memberId): Fetch all tasks where a member is involved.
 * - getTasksByOwnerId(ownerId): Fetch all tasks owned by a specific user.
 * - updateTask(taskId, updatedData): Update a task's data in Firestore.
 * - deleteTask(taskId): Delete a task from Firestore.
 * - sortTasks(key, direction): Sort tasks by a given key and direction.
 */

import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from 'boot/firebase'
import { useUserStore } from '../user-store'

export default {
  /**
   * Create a new task in Firestore for the current user.
   * @param {Object} taskData - Task data (title, description, dueDate, priority, etc.)
   * @returns {Promise<Object>} The created task object with its Firestore ID.
   */
  async createTask(taskData) {
    const userStore = useUserStore();
    const taskRef = doc(collection(db, 'tasks'));
    const task = {
      ...taskData,
      ownerId: userStore.currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(taskRef, task);
    return { id: taskRef.id, ...task };
  },

  /**
   * Fetch all tasks from Firestore.
   * @returns {Promise<Array>} Array of all task objects.
   */
  async getTasks() {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const data=querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.taskList=data
    return data
  },

  /**
   * Fetch a single task by its ID.
   * @param {string} taskId - The Firestore ID of the task.
   * @returns {Promise<Object>} The task object.
   */
  async getTaskById(taskId) {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (taskDoc.exists()) {
      return { id: taskDoc.id, ...taskDoc.data() };
    } else {
      throw new Error('Task not found');
    }
  },

  /**
   * Fetch all tasks where a member is involved (by memberId).
   * @param {string} memberId - The member's ID.
   * @returns {Promise<Array>} Array of tasks involving the member.
   */
  async getTasksByMemberId(memberId) {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.tasks.some(t => t.membersProgress.some(mp => mp.memberId === memberId)));
  },

  /**
   * Fetch all tasks owned by a specific user (by ownerId).
   * @param {string} ownerId - The owner's user ID.
   * @returns {Promise<Array} Array of tasks owned by the user.
   */
  async getTasksByOwnerId(ownerId) {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.ownerId === ownerId);
  },

  /**
   * Update a task's data in Firestore.
   * @param {string} taskId - The Firestore ID of the task.
   * @param {Object} updatedData - The updated task data.
   * @returns {Promise<void>}
   */
  async updateTask(taskId, updatedData) {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Delete a task from Firestore.
   * @param {string} taskId - The Firestore ID of the task.
   * @returns {Promise<void>}
   */
  async deleteTask(taskId) {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    // Remove the deleted task from the local taskList
    this.taskList = this.taskList.filter(task => task.id !== taskId && task.taskID !== taskId)
  },

  /**
   * Sort tasks by a given key and direction.
   * @param {string} key - The key to sort by (e.g., 'dueDate').
   * @param {string} direction - 'asc' or 'desc'.
   * @returns {Promise<Array>} Sorted array of tasks.
   */
  async sortTasks(key, direction = 'asc') {
    const tasks = await this.getTasks();
    return tasks.sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  },
}
