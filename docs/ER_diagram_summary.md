# ER Diagram Summary

## Entities and Relationships

### Faculty

- `code` (PK)
- `initial` (unique)
- `name`, `description`, `headOfFaculty`, `email`, `phone`, `officeLocation`, `website`

### Department

- `code` (PK)
- `facultyInitial` (FK to Faculty.initial)
- `initial` (unique)
- Other fields: `name`, `description`, `headOfDepartment`, `email`, `phone`, `officeLocation`, `website`, `studentCount`, `teacherCount`

### Course

- `code` (PK)
- `departmentInitial` (FK to Department.initial)
- `facultyInitial` (FK to Faculty.initial)
- `name`, `description`, `credits`

### Group

- Embeds `Course`, `Department`, `Owner (User)`, and `Members (Users)`
- Other fields: `groupName`, `facultyInitial`, `labGroup`, `maxMembers`, `semester`, `year`, `groupRules`, `batch`, `createdAt`

### Resource

- Belongs to a Group (subcollection)
- `title`, `description`, `link`, `addedBy` (userId), `createdAt`

### User

- `personId` (PK)
- `name`, `email`, `password` (hashed), `role` ("teacher" | "student")
- `department` (label, value, email)
- `faculty` (label, value)
- `createdAt`

### Todo

- `todoId` (PK)
- `userId` (FK to User.personId)

### Item

- `id` (PK)
- `todoId` (FK to Todo.todoId)
- `userId` (FK to User.personId)
- `title`, `description`, `createdAt`, `updatedAt`, `dueDate`, `isCompleted`, `priority`

### Session

- `sessionID` (PK)
- `createdBy` (FK to User.personId)
- Other fields: `sessionName`, `sessionDescription`, `sessionDate`, `sessionLength`, `isActive`, `isEnded`, `discussionOption`, `selectedGroup`, `participants`, `playgroundLink`, `codingPlatformLinks`, `materialLinks`, `videoLink`, `questions`, `tasks`

### Task

- `announcementId` (PK)
- `authorId` (FK to User.personId)
- Other fields: `content`, `createdAt`, `title`, `category`, `deadline`, `description`, `state`, `subject`, `taskID`, `totalMarks`, `updatedAt`
- Has one **GradingRubric**
- GradingRubric has many **Criteria**
- Has many **Groups**, **Participants**, **Resources**, **Tags**, **Subtasks**
- Has one **Settings**, one **ReviewSettings**

---

## Relationships Summary

- **Faculty** 1 --- \* **Department**
- **Department** 1 --- \* **Course**
- **Group** 1 --- \* **Resource**
- **User** 1 --- \* **Todo**
- **Todo** 1 --- \* **Item**
- **Task** 1 --- 1 **GradingRubric**
- **GradingRubric** 1 --- \* **Criteria**
- **Task** 1 --- \* **Groups**, **Participants**, **Resources**, **Tags**, **Subtasks**
- **Subtask** 1 --- 1 **TaskDetails**
- **Session** 1 --- \* **Participants**, **Tasks**, **Questions**
