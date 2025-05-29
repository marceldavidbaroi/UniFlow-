/**
 * Task Store Actions
 *
 * Functions:
 * - createTask(taskData): Create a new task in Firestore for the current user.
 * - getTasks(): Fetch all tasks from Firestore.
 * - getTaskById(taskId): Fetch a single task by its ID.
 * - getTasksByOwnerId(ownerId): Fetch all tasks owned by a specific user.
 * - updateTask(taskId, updatedData): Update a task's data in Firestore.
 * - deleteTask(taskId): Delete a task from Firestore.
 * - sortTasks(key, direction): Sort tasks by a given key and direction.
 *
 *
 * - createSubmission(submissionData): Create a new task submission.
 * - getSubmission(taskId, userId): Get a submission for a task by a user.
 * - getSubmissionsByTask(taskId): Get all submissions for a task.
 * - getSubmissionsByUser(userId): Get all submissions by a user.
 * - updateSubmission(taskId, userId, updateData): Update a submission.
 * - deleteSubmission(taskId, userId): Delete a submission.
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
    // Use the counters document in metadata for all counters
    const countersRef = doc(db, 'metadata', 'counters');
    let taskCount = 1;
    try {
      const countersSnap = await getDoc(countersRef);
      if (countersSnap.exists()) {
        taskCount = countersSnap.data().taskCount || 1;
      }
    } catch {
      taskCount = 1;
    }

    // Generate a unique, sequential taskID
    const taskID = taskCount;
    const taskRef = doc(collection(db, 'tasks'));
    const task = {
      ...taskData,
      taskID, // assign sequential taskID
      ownerId: userStore.currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(taskRef, task);
    // Increment the taskCount in metadata/counters
    await setDoc(countersRef, { taskCount: taskCount + 1 }, { merge: true });
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

  /**
   * Create a new task submission. One person can submit one response per task.
   * @param {Object} submissionData - { taskId, userId, content, attachments, ... }
   * @returns {Promise<Object>} The created submission object with its Firestore ID.
   */
  async createSubmission(submissionData) {
    const { taskId, userId } = submissionData;
    if (!taskId || !userId) throw new Error('taskId and userId are required');
    const submissionRef = doc(db, 'submissions', `${taskId}_${userId}`);
    const now = new Date().toISOString();
    const submission = {
      ...submissionData,
      status: 'submitted', // submitted | graded | resubmitted | late | rejected
      submittedAt: now,
      updatedAt: now,
      grade: null, // to be filled by teacher
      feedback: '',
      isLate: false, // can be set based on deadline check
    };
    await setDoc(submissionRef, submission);
    return { id: submissionRef.id, ...submission };
  },

  /**
   * Get a submission for a task by a user.
   * @param {string} taskId
   * @param {string} userId
   * @returns {Promise<Object|null>} Submission or null if not found
   */
  async getSubmission(taskId, userId) {
    const submissionRef = doc(db, 'submissions', `${taskId}_${userId}`);
    const snap = await getDoc(submissionRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /**
   * Get all submissions for a task.
   * @param {string} taskId
   * @returns {Promise<Array>} Array of submissions
   */
  async getSubmissionsByTask(taskId) {
    const querySnapshot = await getDocs(collection(db, 'submissions'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(sub => sub.taskId === taskId);
  },

  /**
   * Get all submissions by a user.
   * @param {string} userId
   * @returns {Promise<Array>} Array of submissions
   */
  async getSubmissionsByUser(userId) {
    const querySnapshot = await getDocs(collection(db, 'submissions'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(sub => sub.userId === userId);
  },

  /**
   * Update a submission (e.g., grade, feedback, status).
   * @param {string} taskId
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<void>}
   */
  async updateSubmission(taskId, userId, updateData) {
    const submissionRef = doc(db, 'submissions', `${taskId}_${userId}`);
    await updateDoc(submissionRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Delete a submission.
   * @param {string} taskId
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteSubmission(taskId, userId) {
    const submissionRef = doc(db, 'submissions', `${taskId}_${userId}`);
    await deleteDoc(submissionRef);
  },

  /**
   * Fetch all sessions for a given groupID or sessionId.
   * @param {string} id - The group ID or session ID to filter sessions.
   * @returns {Promise<Array>} Array of matching session objects.
   */
  async getSessionsByGroupOrSessionId(id) {
    const querySnapshot = await getDocs(collection(db, 'sessions'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(session => session.groupID === id || session.sessionID === id);
  },
}
