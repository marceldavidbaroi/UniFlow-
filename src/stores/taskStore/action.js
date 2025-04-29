/**
 * Functions:
 * - createTodo({ title, description, dueDate, priority })
 * - getTodos()
 * - updateTodo(todoId, updatedData)
 * - deleteTodo(todoId)
 * - searchTodos(searchTerm)
 * - sortTodos(key, direction)
 * - filterTodos(filterFn)
 */

import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from 'boot/firebase'
import { useUserStore } from '../user-store'
export default {
  async createTask(taskData) {
    const userStore = useUserStore();
    const taskRef = doc(collection(db, 'tasks'));
    const task = {
      ...taskData,
      ownerId: userStore.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(taskRef, task);
    return { id: taskRef.id, ...task };
  },

  async getTasks() {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getTaskById(taskId) {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (taskDoc.exists()) {
      return { id: taskDoc.id, ...taskDoc.data() };
    } else {
      throw new Error('Task not found');
    }
  },

  async getTasksByMemberId(memberId) {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.tasks.some(t => t.membersProgress.some(mp => mp.memberId === memberId)));
  },

  async getTasksByOwnerId(ownerId) {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.ownerId === ownerId);
  },

  async updateTask(taskId, updatedData) {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteTask(taskId) {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  },

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
