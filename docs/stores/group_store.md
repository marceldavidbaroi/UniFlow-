# Group Management Module

This module provides various functions to manage groups, members, and group-related items such as resources, tasks, announcements, and polls using Firebase Firestore.

---

## Functions Overview

### Group Operations

- **createGroup(payload)**  
  Creates a new group with validations on required fields and password confirmation.

- **fetchAllGroups()**  
  Fetches all groups owned by the current user, including total members count.

- **addMemberToGroup(groupId, password)**  
  Adds the current user as a member to the specified group after password validation.

- **searchGroupById(groupId)**  
  Retrieves group details by its ID.

- **fetchGroupsByStudent()**  
  Fetches groups where the current user is a member.

- **deleteGroup(groupId)**  
  Deletes a group if the current user is the owner.

- **removeMemberFromGroup(groupId, memberId)**  
  Removes a member from the group, ensuring the owner cannot be removed.

- **editGroup(groupId, updatedData)**  
  Updates group details; only the owner can perform edits.

- **filterGroups(filters)**  
  Filters groups based on multiple criteria such as groupName, batch, semester, year, courseName, and labGroup.

- **searchGroupByGroupNameForSearchAction(groupName)**  
  Searches groups by partial groupName match.

- **getAllGroupsForCurrentUser()**  
  Fetches all groups for the current user depending on their role (teacher or student).

---

### Group Items Management

Group items include resources, tasks, announcements, and polls.

- **addGroupItem(groupId, type, data)**  
  Adds an item of the specified type to the group. Validates required fields and ownership.

- **editGroupItem(groupId, type, itemId, updatedData)**  
  Edits an existing group item; restricted to group owner.

- **deleteGroupItem(groupId, type, itemId)**  
  Deletes a group item; restricted to group owner.

- **getGroupItems(groupId, type = null)**  
  Fetches all items or items of a specific type within a group.

---

## Data Structures and Types

- **Group**  
  Contains fields like `groupName`, `batch`, `semester`, `year`, `courseName`, `description`, `groupRules`, `password`, `maxMembers`, `labGroup`, `createdAt`, `owner`, and `members`.

- **Group Items**  
  Types supported: `resource`, `task`, `announcement`, `poll`.  
  Each type has its own collection and required fields.

---

## Notes

- Passwords are currently stored as plain text; optional password hashing is mentioned but commented out.
- Only the group owner can add/edit/delete groups and group items.
- The module uses Firestore queries and updates with real-time timestamping.
- Membership management ensures no duplication and respects max member limits.
- Polls require at least 2 options on creation.

---

## Dependencies

- Firebase Firestore functions: `collection`, `addDoc`, `getDocs`, `where`, `query`, `doc`, `updateDoc`, `arrayUnion`, `getDoc`, `deleteDoc`, `serverTimestamp`.
- User store for current user and role management.

---
