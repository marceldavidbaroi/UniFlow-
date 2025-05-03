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
  async createTodo(payload) {
    const userStore = useUserStore()
    const userId = userStore.currentUser.id
    if (!userId) throw new Error('User not authenticated')

    const todosRef = collection(db, 'todos', userId, 'items')
    await getDocs(todosRef)
    const now = new Date()

    const todoDocRef = doc(todosRef) // Firestore will generate a unique ID
    const todoData = {
      id: todoDocRef.id, // Use the auto-generated ID
      userId,
      ...payload,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(todoDocRef, todoData)

    this.todos.push(todoData)

    return {
      success: true,
      message: 'Todo created successfully',
      data: todoData,
    }
  },
  async getTodos() {
    const userStore = useUserStore()
    const userId = userStore.currentUser.id
    if (!userId) throw new Error('User not authenticated')

    const todosRef = collection(db, 'todos', userId, 'items')
    const snapshot = await getDocs(todosRef)

    this.todos = snapshot.docs.map((doc) => doc.data())

    return {
      success: true,
      message: 'Todos fetched successfully',
      data: this.todos,
    }
  },

  async updateTodo(todoId, updatedData) {
    const userStore = useUserStore()
    const userId = userStore.currentUser.id
    if (!userId) throw new Error('User not authenticated')

    const todoRef = doc(db, 'todos', userId, 'items', String(todoId))
    const todoSnap = await getDoc(todoRef)

    if (!todoSnap.exists()) throw new Error('Todo not found')

    const updatePayload = {
      ...updatedData,
      updatedAt: new Date(),
    }

    await updateDoc(todoRef, updatePayload)

    const index = this.todos.findIndex((t) => t.id === todoId)
    if (index !== -1) {
      this.todos[index] = {
        ...this.todos[index],
        ...updatePayload,
      }
    }

    return {
      success: true,
      message: 'Todo updated successfully',
      data: this.todos[index],
    }
  },

  async deleteTodo(todoId) {
    const userStore = useUserStore()
    const userId = userStore.currentUser.id
    if (!userId) throw new Error('User not authenticated')

    const todoRef = doc(db, 'todos', userId, 'items', String(todoId))
    await deleteDoc(todoRef)

    this.todos = this.todos.filter((todo) => todo.id !== todoId)

    return {
      success: true,
      message: 'Todo deleted successfully',
      data: { id: todoId },
    }
  },

  async searchTodos(searchTerm) {
    const lower = searchTerm.toLowerCase()

    const filtered = this.todos.filter(
      (todo) => String(todo.id) === searchTerm || todo.title.toLowerCase().includes(lower),
    )

    return {
      success: true,
      message: `${filtered.length} result(s) found`,
      data: filtered,
    }
  },

  sortTodos(data, key = 'dueDate', direction = 'asc') {
    const sorted = [...data].sort((a, b) => {
      if (!a[key]) return 1
      if (!b[key]) return -1

      const valA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key]
      const valB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key]

      if (valA < valB) return direction === 'asc' ? -1 : 1
      if (valA > valB) return direction === 'asc' ? 1 : -1
      return 0
    })

    return {
      success: true,
      message: 'Todos sorted successfully',
      data: sorted,
    }
  },
  filterTodos(data = [], filterFn) {
    // if (typeof filterFn !== 'function') {
    //   throw new Error('filterFn must be a function')
    // }

    const filtered = data.filter(filterFn) // Use the passed 'data' instead of 'this.todos'

    return {
      success: true,
      message: `${filtered.length} todo(s) matched the filter`,
      data: filtered,
    }
  },
}
