# Entity: Faculty

| Attribute        | Type   | Description                   |
| ---------------- | ------ | ----------------------------- |
| `code`           | string | Unique code for faculty       |
| `name`           | string | Name of the faculty           |
| `initial`        | string | Initials of the faculty       |
| `description`    | string | Description about the faculty |
| `headOfFaculty`  | string | Name of the head of faculty   |
| `email`          | string | Contact email                 |
| `phone`          | string | Contact phone number          |
| `officeLocation` | string | Location of faculty office    |
| `website`        | string | Faculty website URL           |

# Entity: Department

| Attribute          | Type   | Description                    |
| ------------------ | ------ | ------------------------------ |
| `code`             | string | Unique code for the department |
| `name`             | string | Name of the department         |
| `initial`          | string | Initials of the department     |
| `facultyInitial`   | string | Initial of the related faculty |
| `description`      | string | Description of the department  |
| `headOfDepartment` | string | Name of the head of department |
| `email`            | string | Contact email                  |
| `phone`            | string | Contact phone number           |
| `officeLocation`   | string | Office location                |
| `website`          | string | Department website URL         |
| `studentCount`     | number | Number of students             |
| `teacherCount`     | number | Number of teachers             |

# Entity: Course

| Attribute           | Type   | Description                       |
| ------------------- | ------ | --------------------------------- |
| `code`              | string | Unique code for the course        |
| `name`              | string | Name of the course                |
| `description`       | string | Description of the course         |
| `credits`           | number | Number of credits                 |
| `departmentInitial` | string | Initial of the related department |
| `facultyInitial`    | string | Initial of the related faculty    |

# Entity: Group

| Attribute        | Type                      | Description                      |
| ---------------- | ------------------------- | -------------------------------- |
| `groupName`      | string                    | Name of the group                |
| `course`         | Course (embedded)         | Embedded Course entity           |
| `department`     | Department (embedded)     | Embedded Department entity       |
| `facultyInitial` | string                    | Initial of the related faculty   |
| `labGroup`       | boolean                   | Whether the group is a lab group |
| `maxMembers`     | number                    | Maximum number of group members  |
| `members`        | array of Users (embedded) | List of group members            |
| `owner`          | User (embedded)           | Owner of the group               |
| `semester`       | string                    | Semester identifier              |
| `year`           | number                    | Year of the group                |
| `groupRules`     | string                    | Rules governing the group        |
| `batch`          | string                    | Batch identifier                 |
| `createdAt`      | timestamp                 | Creation timestamp               |

# Entity: Resource

| Attribute     | Type      | Description                                  |
| ------------- | --------- | -------------------------------------------- |
| `title`       | string    | Title of the resource                        |
| `description` | string    | Description of the resource                  |
| `link`        | string    | URL or link to the resource                  |
| `addedBy`     | string    | User ID of the person who added the resource |
| `createdAt`   | timestamp | Timestamp when the resource was created      |

> **Note:** Resources belong to a **Group** entity as a subcollection.

# Entity: User

| Attribute    | Type      | Description                       |
| ------------ | --------- | --------------------------------- |
| `personId`   | string    | Unique identifier for user        |
| `name`       | string    | Full name of the user             |
| `email`      | string    | User's email address              |
| `password`   | string    | Hashed password                   |
| `role`       | string    | User role: "teacher" or "student" |
| `department` | object    | Department details                |
| ├─ `label`   | string    | Department label                  |
| ├─ `value`   | string    | Department value                  |
| └─ `email`   | string    | Department contact email          |
| `faculty`    | object    | Faculty details                   |
| ├─ `label`   | string    | Faculty label                     |
| └─ `value`   | string    | Faculty value                     |
| `createdAt`  | timestamp | Timestamp when user created       |

# Entity: Metadata

| Attribute      | Type   | Description        |
| -------------- | ------ | ------------------ |
| `sessionCount` | number | Number of sessions |
| `taskCount`    | number | Number of tasks    |

---

# Entity: Note

| Attribute      | Type                         | Description                     |
| -------------- | ---------------------------- | ------------------------------- |
| `title`        | string                       | Title of the note               |
| `description`  | string                       | Description content             |
| `category`     | array of objects             | Categories assigned to the note |
| ├─ `color`     | string                       | Category color                  |
| ├─ `label`     | string                       | Category label                  |
| ├─ `textColor` | string                       | Text color for the category     |
| └─ `value`     | string                       | Category value                  |
| `tags`         | array of strings or objects  | Tags related to the note        |
| `links`        | array of strings             | URLs or IDs linked to the note  |
| `isPublic`     | boolean                      | Whether the note is public      |
| `ownerId`      | string                       | User ID of the owner            |
| `sharedWith`   | array of user IDs or objects | Users with whom note is shared  |
| `createdAt`    | timestamp                    | Creation timestamp              |
| `updatedAt`    | timestamp                    | Last updated timestamp          |

# Entity: Session

| Attribute             | Type             | Description                              |
| --------------------- | ---------------- | ---------------------------------------- |
| `sessionID`           | number           | Unique session identifier                |
| `sessionName`         | string           | Name of the session                      |
| `sessionDescription`  | string           | Description of the session               |
| `sessionDate`         | string           | Date of the session (consider timestamp) |
| `sessionLength`       | string           | Duration of the session                  |
| `createdAt`           | timestamp        | Creation timestamp                       |
| `createdBy`           | string           | User ID of creator                       |
| `isActive`            | boolean          | Whether session is active                |
| `isEnded`             | boolean          | Whether session has ended                |
| `discussionOption`    | boolean          | Whether discussion is enabled            |
| `selectedGroup`       | string or null   | Group ID or null                         |
| `participants`        | array of strings | List of user IDs participating           |
| `playgroundLink`      | string           | Link to coding playground                |
| `codingPlatformLinks` | array of strings | URLs for coding platforms                |
| `materialLinks`       | array of strings | URLs for materials                       |
| `videoLink`           | array of strings | URLs for videos                          |
| `questions`           | array of objects | List of questions                        |
| ├─ `qno`              | number           | Question number                          |
| ├─ `marks`            | number           | Marks assigned                           |
| └─ `text`             | string           | Question text                            |
| `tasks`               | array of objects | List of tasks                            |
| └─ `description`      | string           | Task description                         |

# Entity: Task (Announcement)

| Attribute        | Type      | Description                    |
| ---------------- | --------- | ------------------------------ |
| `announcementId` | number    | Unique announcement identifier |
| `authorId`       | string    | User ID of the author          |
| `content`        | string    | Content of the announcement    |
| `createdAt`      | timestamp | Creation timestamp             |
| `title`          | string    | Title of the task/announcement |
| `category`       | string    | Category of the task           |
| `deadline`       | timestamp | Deadline for submission        |
| `description`    | string    | Description of the task        |
| `state`          | string    | Current state/status           |
| `subject`        | string    | Subject related to the task    |
| `taskID`         | number    | Unique task identifier         |
| `totalMarks`     | string    | Total marks assigned           |
| `updatedAt`      | timestamp | Last update timestamp          |

---

## Relationships

### GradingRubric (Composite)

- Task **has one** GradingRubric

### Criteria

- GradingRubric **has many** Criteria

| Attribute     | Type   | Description                       |
| ------------- | ------ | --------------------------------- |
| `criterionId` | number | Criterion identifier              |
| `description` | string | Description of the criterion      |
| `maxPoints`   | string | Maximum points for this criterion |
| `notes`       | string | Additional notes                  |

---

### GroupID

- Task **has many** GroupID

| Attribute | Type   | Description        |
| --------- | ------ | ------------------ |
| `id`      | string | Group identifier   |
| `ownerId` | string | Owner of the group |

---

### ParticipantList

- Task **has many** Participants (array of user IDs)

---

### Resources

- Task **has many** Resources

| Attribute    | Type   | Description                   |
| ------------ | ------ | ----------------------------- |
| `resourceId` | number | Resource identifier           |
| `title`      | string | Resource title                |
| `type`       | string | Type of resource              |
| `url`        | string | URL to the resource           |
| `sessionId`  | string | Associated session identifier |

---

### Settings

- Task **has one** Settings

| Attribute               | Type    | Description                      |
| ----------------------- | ------- | -------------------------------- |
| `allowLateSubmissions`  | boolean | Whether late submissions allowed |
| `gradingScheme`         | string  | Grading scheme                   |
| `lateSubmissionPenalty` | string  | Penalty for late submission      |

---

### ReviewSettings

- Task **has one** ReviewSettings

| Attribute          | Type    | Description               |
| ------------------ | ------- | ------------------------- |
| `instructorReview` | boolean | Instructor review enabled |
| `peerReview`       | boolean | Peer review enabled       |
| `submissionType`   | string  | Type of submission        |

---

### Tags

- Task **has many** Tags (array of strings)

---

### Sub-Tasks (Tasks)

- Task **has many** Tasks (subtasks)

| Attribute            | Type   | Description                   |
| -------------------- | ------ | ----------------------------- |
| `taskId`             | number | Sub-task identifier           |
| `dependencies`       | string | Dependencies for the sub-task |
| `learningObjectives` | string | Learning objectives           |
| `membersProgress`    | array  | Progress of members           |
| `question`           | string | Question related to the task  |

---

### TaskDetails

- Sub-Task **has one** TaskDetails

| Attribute     | Type   | Description             |
| ------------- | ------ | ----------------------- |
| `attachments` | array  | Attached files or links |
| `description` | string | Detailed description    |
| `difficulty`  | string | Difficulty level        |
| `points`      | string | Points assigned         |
| `timeLimit`   | string | Time limit for task     |
| `type`        | string | Type of task            |

# Entity: Todo

| Attribute | Type   | Description              |
| --------- | ------ | ------------------------ |
| `todoId`  | string | Primary key (PK)         |
| `userId`  | string | Foreign key (FK) to User |

---

# Entity: Item

| Attribute     | Type      | Description              |
| ------------- | --------- | ------------------------ |
| `id`          | string    | Primary key (PK)         |
| `title`       | string    | Title of the item        |
| `description` | string    | Description              |
| `createdAt`   | timestamp | Creation timestamp       |
| `updatedAt`   | timestamp | Last updated timestamp   |
| `dueDate`     | string    | Due date                 |
| `isCompleted` | boolean   | Completion status        |
| `priority`    | string    | Priority level           |
| `userId`      | string    | Foreign key (FK) to User |
| `todoId`      | string    | Foreign key (FK) to Todo |

---

# Relationship:

- One **Todo** has many **Items**
- Each **Item** belongs to one **Todo**

---

### ER Diagram (Text)
