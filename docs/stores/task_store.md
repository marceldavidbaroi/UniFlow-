# Task Store Actions Summary

## Task CRUD

- **createTask(taskData)**  
  Create a new task in Firestore for the current user.  
  Generates a unique sequential `taskID` using a centralized counter in `metadata/counters`.  
  Returns the created task object with its Firestore document ID.

- **getTasks()**  
  Fetch all tasks from Firestore.  
  Returns an array of all task objects.

- **getTaskById(taskId)**  
  Fetch a single task by its Firestore document ID.  
  Returns the task object or throws an error if not found.

- **getTasksByOwnerId(ownerId)**  
  Fetch all tasks owned by a specific user (`ownerId`).  
  Returns an array of tasks owned by the user.

- **updateTask(taskId, updatedData)**  
  Update specific fields of a task by Firestore ID.  
  Updates the `updatedAt` timestamp automatically.

- **deleteTask(taskId)**  
  Delete a task by Firestore ID.  
  Removes the task from Firestore and also updates the local task list.

- **sortTasks(key, direction)**  
  Sort tasks by a given key (e.g., `dueDate`) and direction (`asc` or `desc`).  
  Returns the sorted array of tasks.

- **getTasksByGroupIds(groupIDs)**  
  Fetch all tasks associated with any of the given group IDs.  
  Supports tasks with `groupID` as a single value or array.  
  Returns matching tasks.

- **getTasksBySessionIds(sessionIDs)**  
  Fetch all tasks associated with any of the given session IDs.  
  Supports tasks with `sessionId` as a single value or array.  
  Returns matching tasks.

---

## Submission CRUD

- **createSubmission(submissionData)**  
  Create a new submission for a task by a user.  
  Document ID is `{taskId}_{userId}` to ensure one submission per user per task.  
  Initializes submission with status, timestamps, and empty grade/feedback.

- **getSubmission(taskId, userId)**  
  Get a specific submission by `taskId` and `userId`.  
  Returns the submission object or `null` if not found.

- **getSubmissionsByTask(taskId)**  
  Fetch all submissions for a specific task.  
  Returns an array of submissions.

- **getSubmissionsByUser(userId)**  
  Fetch all submissions made by a specific user.  
  Returns an array of submissions.

- **updateSubmission(taskId, userId, updateData)**  
  Update a submission's data (grade, feedback, status, etc.) with automatic timestamp update.

- **deleteSubmission(taskId, userId)**  
  Delete a submission by `taskId` and `userId`.

---

## Notes

- All timestamps are stored as ISO strings (`new Date().toISOString()`).
- Task and submission IDs are Firestore document IDs except where combined keys are used for submissions.
- Local state lists (`taskList`) are updated accordingly after deletions or fetches.
