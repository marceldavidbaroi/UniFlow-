# Todo Store Functions Summary

## Functions Overview

- **createTodo({ title, description, dueDate, priority })**  
  Creates a new todo item for the authenticated user.  
  Generates a Firestore document with a unique ID under `todos/{userId}/items`.  
  Sets default fields like `isCompleted`, `createdAt`, and `updatedAt`.  
  Adds the new todo to the local `todos` array.  
  Returns a success message and the created todo data.

- **getTodos()**  
  Fetches all todos for the authenticated user from Firestore.  
  Updates the local `todos` array with fetched data.  
  Returns a success message and the list of todos.

- **updateTodo(todoId, updatedData)**  
  Updates an existing todo item by ID for the authenticated user.  
  Updates the `updatedAt` timestamp automatically.  
  Updates the local `todos` array accordingly.  
  Returns a success message and the updated todo.

- **deleteTodo(todoId)**  
  Deletes a todo item by ID for the authenticated user from Firestore.  
  Removes the todo from the local `todos` array.  
  Returns a success message and the deleted todo ID.

- **searchTodos(searchTerm)**  
  Searches todos locally by matching the `id` or `title` (case-insensitive).  
  Returns a success message and the filtered todos.

- **sortTodos(data, key = 'dueDate', direction = 'asc')**  
  Sorts an array of todos by a given key (default `dueDate`) and direction (`asc` or `desc`).  
  Handles missing keys gracefully.  
  Returns a success message and the sorted array.

- **filterTodos(data = [], filterFn)**  
  Filters an array of todos using a provided filter function.  
  Returns a success message and the filtered todos.

- **deleteAllTodos()**  
  Deletes all todos for the authenticated user from Firestore in parallel.  
  Clears the local `todos` array.  
  Returns a success message.

---

## Notes

- All Firestore documents for todos are scoped under each user's subcollection `todos/{userId}/items`.
- Authentication is checked before performing any operation; throws an error if no user is authenticated.
- Local state `todos` is kept in sync after create, update, delete, and fetch operations.
- Timestamp fields (`createdAt`, `updatedAt`) are stored as JavaScript `Date` objects.
- Sorting and filtering functions operate on passed arrays to allow flexibility.
