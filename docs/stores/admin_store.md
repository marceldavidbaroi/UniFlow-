# Admin Store Actions

## User CRUD

- `fetchUsers(search)`: Fetch all users, optionally filtered by `search` criteria.
- `getUserById(id)`: Get a user by ID.
- `addUser(data)`: Add a new user.
- `updateUser(id, data)`: Update a user by ID.
- `deleteUser(id)`: Delete a user by ID.

## Group CRUD

- `fetchGroups(search)`: Fetch all groups, optionally filtered by `search`.
- `getGroupById(id)`: Get a group by ID.
- `addGroup(data)`: Add a new group.
- `updateGroup(id, data)`: Update a group by ID.
- `deleteGroup(id)`: Delete a group by ID.

## Session CRUD

- `fetchSessions(search)`: Fetch all sessions, optionally filtered.
- `getSessionById(id)`: Get a session by ID.
- `addSession(data)`: Add a new session.
- `updateSession(id, data)`: Update a session by ID.
- `deleteSession(id)`: Delete a session by ID.

## Task CRUD

- `fetchTasks(search)`: Fetch all tasks, optionally filtered.
- `getTaskById(id)`: Get a task by ID.
- `addTask(data)`: Add a new task.
- `updateTask(id, data)`: Update a task by ID.
- `deleteTask(id)`: Delete a task by ID.

## Todo CRUD

- `fetchTodos(search)`: Fetch all todos, optionally filtered.
- `getTodoById(id)`: Get a todo by ID.
- `addTodo(data)`: Add a new todo.
- `updateTodo(id, data)`: Update a todo by ID.
- `deleteTodo(id)`: Delete a todo by ID.

## Note CRUD

- `fetchNotes(search)`: Fetch all notes, optionally filtered.
- `getNoteById(id)`: Get a note by ID.
- `addNote(data)`: Add a new note.
- `updateNote(id, data)`: Update a note by ID.
- `deleteNote(id)`: Delete a note by ID.

## Subject CRUD

- `fetchSubjects(search)`: Fetch all subjects, optionally filtered.
- `getSubjectById(id)`: Get a subject by ID.
- `addSubject(data)`: Add a new subject.
- `updateSubject(id, data)`: Update a subject by ID.
- `deleteSubject(id)`: Delete a subject by ID.

## Log CRUD

- `fetchLogs(search)`: Fetch all logs, optionally filtered.
- `getLogById(id)`: Get a log by ID.
- `addLog(data)`: Add a new log.
- `updateLog(id, data)`: Update a log by ID.
- `deleteLog(id)`: Delete a log by ID.

## Faculty CRUD

- `fetchFaculties(search)`: Fetch all faculties, optionally filtered.
- `getFacultyById(id)`: Get a faculty by ID.
- `addFaculty(data)`: Add a new faculty.
- `updateFaculty(id, data)`: Update a faculty by ID.
- `deleteFaculty(id)`: Delete a faculty by ID.

## Course CRUD

- `fetchCourses(search)`: Fetch all courses, optionally filtered.
- `getCourseById(id)`: Get a course by ID.
- `addCourse(data)`: Add a new course.
- `updateCourse(id, data)`: Update a course by ID.
- `deleteCourse(id)`: Delete a course by ID.

## Department CRUD

- `fetchDepartments(search)`: Fetch all departments, optionally filtered.
- `getDepartmentById(id)`: Get a department by ID.
- `addDepartment(data)`: Add a new department.
- `updateDepartment(id, data)`: Update a department by ID.
- `deleteDepartment(id)`: Delete a department by ID.

## Department Sample Injection

- `injectSampleDepartments()`: Replace all departments with sample data.

---

> **Note:**  
> Each `fetch` method supports an optional search object for filtering results based on key-value matches (case insensitive).  
> Some `add` methods include validation checks for required fields and formatting (e.g., email format, uppercase initials).
