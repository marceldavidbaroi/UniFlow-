/**
 * Admin Store Actions
 *
 * User CRUD:
 * - fetchUsers(): Fetch all users.
 * - getUserById(id): Get a user by ID.
 * - addUser(data): Add a new user.
 * - updateUser(id, data): Update a user by ID.
 * - deleteUser(id): Delete a user by ID.
 *
 * Group CRUD:
 * - fetchGroups(): Fetch all groups.
 * - getGroupById(id): Get a group by ID.
 * - addGroup(data): Add a new group.
 * - updateGroup(id, data): Update a group by ID.
 * - deleteGroup(id): Delete a group by ID.
 *
 * Session CRUD:
 * - fetchSessions(): Fetch all sessions.
 * - getSessionById(id): Get a session by ID.
 * - addSession(data): Add a new session.
 * - updateSession(id, data): Update a session by ID.
 * - deleteSession(id): Delete a session by ID.
 *
 * Task CRUD:
 * - fetchTasks(): Fetch all tasks.
 * - getTaskById(id): Get a task by ID.
 * - addTask(data): Add a new task.
 * - updateTask(id, data): Update a task by ID.
 * - deleteTask(id): Delete a task by ID.
 *
 * Todo CRUD:
 * - fetchTodos(): Fetch all todos.
 * - getTodoById(id): Get a todo by ID.
 * - addTodo(data): Add a new todo.
 * - updateTodo(id, data): Update a todo by ID.
 * - deleteTodo(id): Delete a todo by ID.
 *
 * Note CRUD:
 * - fetchNotes(): Fetch all notes.
 * - getNoteById(id): Get a note by ID.
 * - addNote(data): Add a new note.
 * - updateNote(id, data): Update a note by ID.
 * - deleteNote(id): Delete a note by ID.
 *
 * Subject CRUD:
 * - fetchSubjects(): Fetch all subjects.
 * - getSubjectById(id): Get a subject by ID.
 * - addSubject(data): Add a new subject.
 * - updateSubject(id, data): Update a subject by ID.
 * - deleteSubject(id): Delete a subject by ID.
 *
 * Log CRUD:
 * - fetchLogs(): Fetch all logs.
 * - getLogById(id): Get a log by ID.
 * - addLog(data): Add a new log.
 * - updateLog(id, data): Update a log by ID.
 * - deleteLog(id): Delete a log by ID.
 *
 * Faculty CRUD:
 * - fetchFaculties(): Fetch all faculties.
 * - getFacultyById(id): Get a faculty by ID.
 * - addFaculty(data): Add a new faculty.
 * - updateFaculty(id, data): Update a faculty by ID.
 * - deleteFaculty(id): Delete a faculty by ID.
 *
 * Course CRUD:
 * - fetchCourses(): Fetch all courses.
 * - getCourseById(id): Get a course by ID.
 * - addCourse(data): Add a new course.
 * - updateCourse(id, data): Update a course by ID.
 * - deleteCourse(id): Delete a course by ID.
 *
 * Department CRUD:
 * - fetchDepartments(): Fetch all departments.
 * - getDepartmentById(id): Get a department by ID.
 * - addDepartment(data): Add a new department.
 * - updateDepartment(id, data): Update a department by ID.
 * - deleteDepartment(id): Delete a department by ID.
 *
 * Department Sample Injection:
 * - injectSampleDepartments(): Replace all departments with sample data.
 */
import { db } from 'src/boot/firebase'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { sampleFaculties } from '../../modules/admin/sample/sampleFaculties'
import { sampleCourses } from '../../modules/admin/sample/sampleCourses'
import { sampleDepartments } from '../../modules/admin/sample/sampleDepartments'

export default {
  // USERS
  async fetchUsers(search = {}) {
    const usersCol = collection(db, 'users')
    const snapshot = await getDocs(usersCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(user => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            user[key] &&
            user[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allUser = data
    return { success: true, data }
  },
  async getUserById(id) {
    const userDoc = await getDoc(doc(db, 'users', id))
    const data = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null
    this.selectedUser = data
    return { success: true, data }
  },
  async addUser(data) {
    const docRef = await addDoc(collection(db, 'users'), data)
    return { success: true, data: docRef }
  },
  async updateUser(id, data) {
    await updateDoc(doc(db, 'users', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteUser(id) {
    await deleteDoc(doc(db, 'users', id))
    return { success: true, data: id }
  },
  // GROUPS
  async fetchGroups(search = {}) {
    const groupsCol = collection(db, 'group')
    const snapshot = await getDocs(groupsCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(group => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            group[key] &&
            group[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allGroup = data
    return { success: true, data }
  },
  async getGroupById(id) {
    const groupDoc = await getDoc(doc(db, 'group', id))
    const data = groupDoc.exists() ? { id: groupDoc.id, ...groupDoc.data() } : null
    this.selectedGroup = data
    return { success: true, data }
  },
  async addGroup(data) {
    const docRef = await addDoc(collection(db, 'group'), data)
    return { success: true, data: docRef }
  },
  async updateGroup(id, data) {
    await updateDoc(doc(db, 'group', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteGroup(id) {
    await deleteDoc(doc(db, 'group', id))
    return { success: true, data: id }
  },
  // SESSIONS
  async fetchSessions(search = {}) {
    const sessionsCol = collection(db, 'sessions')
    const snapshot = await getDocs(sessionsCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(session => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            session[key] &&
            session[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allSession = data
    return { success: true, data }
  },
  async getSessionById(id) {
    const sessionDoc = await getDoc(doc(db, 'sessions', id))
    const data = sessionDoc.exists() ? { id: sessionDoc.id, ...sessionDoc.data() } : null
    this.selectedSession = data
    return { success: true, data }
  },
  async addSession(data) {
    const docRef = await addDoc(collection(db, 'sessions'), data)
    return { success: true, data: docRef }
  },
  async updateSession(id, data) {
    await updateDoc(doc(db, 'sessions', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteSession(id) {
    await deleteDoc(doc(db, 'sessions', id))
    return { success: true, data: id }
  },
  // TASKS
  async fetchTasks(search = {}) {
    const tasksCol = collection(db, 'tasks')
    const snapshot = await getDocs(tasksCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(task => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            task[key] &&
            task[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allTask = data
    return { success: true, data }
  },
  async getTaskById(id) {
    const taskDoc = await getDoc(doc(db, 'tasks', id))
    const data = taskDoc.exists() ? { id: taskDoc.id, ...taskDoc.data() } : null
    this.selectedTask = data
    return { success: true, data }
  },
  async addTask(data) {
    const docRef = await addDoc(collection(db, 'tasks'), data)
    return { success: true, data: docRef }
  },
  async updateTask(id, data) {
    await updateDoc(doc(db, 'tasks', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteTask(id) {
    await deleteDoc(doc(db, 'tasks', id))
    return { success: true, data: id }
  },
  // TODOS
  async fetchTodos(search = {}) {
    const todosCol = collection(db, 'todos')
    const snapshot = await getDocs(todosCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(todo => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            todo[key] &&
            todo[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allTodo = data
    return { success: true, data }
  },
  async getTodoById(id) {
    const todoDoc = await getDoc(doc(db, 'todos', id))
    const data = todoDoc.exists() ? { id: todoDoc.id, ...todoDoc.data() } : null
    this.selectedTodo = data
    return { success: true, data }
  },
  async addTodo(data) {
    const docRef = await addDoc(collection(db, 'todos'), data)
    return { success: true, data: docRef }
  },
  async updateTodo(id, data) {
    await updateDoc(doc(db, 'todos', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteTodo(id) {
    await deleteDoc(doc(db, 'todos', id))
    return { success: true, data: id }
  },
  // NOTES
  async fetchNotes(search = {}) {
    const notesCol = collection(db, 'notes')
    const snapshot = await getDocs(notesCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(note => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            note[key] &&
            note[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allNote = data
    return { success: true, data }
  },
  async getNoteById(id) {
    const noteDoc = await getDoc(doc(db, 'notes', id))
    const data = noteDoc.exists() ? { id: noteDoc.id, ...noteDoc.data() } : null
    this.selectedNote = data
    return { success: true, data }
  },
  async addNote(data) {
    const docRef = await addDoc(collection(db, 'notes'), data)
    return { success: true, data: docRef }
  },
  async updateNote(id, data) {
    await updateDoc(doc(db, 'notes', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteNote(id) {
    await deleteDoc(doc(db, 'notes', id))
    return { success: true, data: id }
  },
  // SUBJECTS
  async fetchSubjects(search = {}) {
    const subjectsCol = collection(db, 'metadata')
    const snapshot = await getDocs(subjectsCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(subject => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            subject[key] &&
            subject[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allSubject = data
    return { success: true, data }
  },
  // LOGS
  async fetchLogs(search = {}) {
    const logsCol = collection(db, 'logs')
    const snapshot = await getDocs(logsCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(log => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            log[key] &&
            log[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allLog = data
    return { success: true, data }
  },
  async getLogById(id) {
    const logDoc = await getDoc(doc(db, 'logs', id))
    const data = logDoc.exists() ? { id: logDoc.id, ...logDoc.data() } : null
    this.selectedLog = data
    return { success: true, data }
  },
  async addLog(data) {
    const docRef = await addDoc(collection(db, 'logs'), data)
    return { success: true, data: docRef }
  },
  async updateLog(id, data) {
    await updateDoc(doc(db, 'logs', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteLog(id) {
    await deleteDoc(doc(db, 'logs', id))
    return { success: true, data: id }
  },
  // FACULTY
  async fetchFaculties(search = {}) {
    const facultiesCol = collection(db, 'faculties')
    const snapshot = await getDocs(facultiesCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(faculty => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            faculty[key] &&
            faculty[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allFaculty = data
    return { success: true, data }
  },
  async getFacultyById(id) {
    const facultyDoc = await getDoc(doc(db, 'faculties', id))
    const data = facultyDoc.exists() ? { id: facultyDoc.id, ...facultyDoc.data() } : null
    this.selectedFaculty = data
    return { success: true, data }
  },
  async addFaculty(data) {
    // Validation
    if (!data.name || !data.initial || !data.code || !data.headOfFaculty || !data.email) {
      return { success: false, error: 'Required fields missing: name, initial, code, headOfFaculty, email.' }
    }
    if (!/^\d+$/.test(data.code)) {
      return { success: false, error: 'Faculty code must be a number.' }
    }
    if (!/^[A-Z]{2,}$/.test(data.initial)) {
      return { success: false, error: 'Initial must be at least 2 uppercase letters.' }
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return { success: false, error: 'Invalid email format.' }
    }
    const docRef = await addDoc(collection(db, 'faculties'), data)
    return { success: true, data: docRef }
  },
  async updateFaculty(id, data) {
    await updateDoc(doc(db, 'faculties', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteFaculty(id) {
    await deleteDoc(doc(db, 'faculties', id))
    return { success: true, data: id }
  },
  // COURSES
  async fetchCourses(search = {}) {
    const coursesCol = collection(db, 'courses')
    const snapshot = await getDocs(coursesCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(course => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            course[key] &&
            course[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allCourse = data
    return { success: true, data }
  },
  async getCourseById(id) {
    const courseDoc = await getDoc(doc(db, 'courses', id))
    const data = courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null
    this.selectedCourse = data
    return { success: true, data }
  },
  async addCourse(data) {
    const docRef = await addDoc(collection(db, 'courses'), data)
    return { success: true, data: docRef }
  },
  async updateCourse(id, data) {
    await updateDoc(doc(db, 'courses', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteCourse(id) {
    await deleteDoc(doc(db, 'courses', id))
    return { success: true, data: id }
  },
  // DEPARTMENT
  async fetchDepartments(search = {}) {
    console.log('search',search)
    const departmentsCol = collection(db, 'departments')
    const snapshot = await getDocs(departmentsCol)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (search && Object.keys(search).length) {
      data = data.filter(department => {
        return Object.entries(search).every(([key, value]) => {
          if (!value) return true
          return (
            department[key] &&
            department[key].toString().toLowerCase().includes(value.toString().toLowerCase())
          )
        })
      })
    }
    this.allDepartment = data
    return { success: true, data }
  },
  async getDepartmentById(id) {
    const departmentDoc = await getDoc(doc(db, 'departments', id))
    const data = departmentDoc.exists() ? { id: departmentDoc.id, ...departmentDoc.data() } : null
    this.selectedDepartment = data
    return { success: true, data }
  },
async addDepartment(data) {
  // Validation
  if (!data.name || !data.initial || !data.code || !data.headOfDepartment || !data.email) {
    return { success: false, error: 'Required fields missing: name, initial, code, headOfDepartment, email.' }
  }

  if (!/^[A-Z]{2,}$/.test(data.initial)) {
    return { success: false, error: 'Initial must be at least 2 uppercase letters.' }
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    return { success: false, error: 'Invalid email format.' }
  }

  // Add default counts
  const payload = {
    ...data,
    studentCount: 0,
    teacherCount: 0,
  }

  const docRef = await addDoc(collection(db, 'departments'), payload)
  return { success: true, data: docRef }
},
  async updateDepartment(id, data) {
    await updateDoc(doc(db, 'departments', id), data)
    return { success: true, data: { id, ...data } }
  },
  async deleteDepartment(id) {
    await deleteDoc(doc(db, 'departments', id))
    return { success: true, data: id }
  },
  async injectSampleFaculties() {
    // First, delete all existing faculties
    const facultiesCol = collection(db, 'faculties')
    const snapshot = await getDocs(facultiesCol)
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, 'faculties', docSnap.id))
    }
    // Then, insert sample faculties
    for (const faculty of sampleFaculties) {
      await addDoc(collection(db, 'faculties'), faculty)
    }
    return { success: true, count: sampleFaculties.length }
  },
  async injectSampleCourses() {
  // First, delete all existing courses (from all faculties if needed, or assume one)
  const coursesCol = collection(db,  'courses')
  const snapshot = await getDocs(coursesCol)
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, 'courses', docSnap.id))
  }
  // Then, insert sample courses
  for (const course of sampleCourses) {
    await addDoc(collection(db,  'courses'), course)
  }
  return { success: true, count: sampleCourses.length }
},
async injectSampleDepartments() {
  // First, delete all existing departments
  const departmentsCol = collection(db, 'departments')
  const snapshot = await getDocs(departmentsCol)
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, 'departments', docSnap.id))
  }

  // Then, insert sample departments with counts initialized
  for (const department of sampleDepartments) {
    const payload = {
      ...department,
      studentCount: 0,
      teacherCount: 0
    }
    await addDoc(collection(db, 'departments'), payload)
  }

  return { success: true, count: sampleDepartments.length }
}



}
