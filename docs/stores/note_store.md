# Notes Management Module Summary

This module provides a comprehensive set of functions to create, retrieve, update, delete, share, filter, search, sort, group, and export notes using Firebase Firestore.

## Key Functions

- **createNote(payload)**  
  Creates a new note with metadata like owner ID, timestamps, and user-provided content.

- **fetchNotesByUser()**  
  Retrieves all notes owned by the current user.

- **fetchPublicNotes()**  
  Retrieves all notes marked as public.

- **updateNote(noteId, updatedData)**  
  Updates an existing note by its ID with new data and updates the timestamp.

- **deleteNote(noteId)**  
  Deletes a note by its ID.

- **shareNote(noteId, userIds)**  
  Shares a note with multiple users by adding their IDs to the `sharedWith` field.

- **toggleNoteVisibility(noteId, isPublic)**  
  Toggles a note’s visibility between public and private.

- **filterNotes({ tags, category, isPublic })**  
  Filters notes based on tags, category, and public/private status.

- **searchNotes({ keyword })**  
  Searches user’s notes by keyword across title, description, tags, and category.

- **sortNotes(criteria)**  
  Sorts notes by criteria: creation date, modification date, or title.

- **groupNotesBy(field)**  
  Groups notes by either tags or category.

- **exportNoteToFormat(noteId, format)**  
  Placeholder for exporting a note’s content in various formats (e.g., PDF, Word).

## Technologies Used

- Firebase Firestore for data storage and queries
- Timestamp management with Firebase
- Pinia store for user state management
