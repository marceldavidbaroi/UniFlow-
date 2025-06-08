# Session Management Module Summary

This module provides functions to create, join, update, end, fetch, search, sort sessions, and handle question responses, using Firebase Firestore.

## Key Functions

- **createSession(userId, payload)**  
  Creates a new session with a unique session number, sets creator, timestamps, and initial participants.

- **joinSession(sessionId, userId)**  
  Allows a user to join an active session if not already a participant and session is not ended.

- **endSession(sessionId)**  
  Ends the session by updating its state, timestamps, and disabling discussion.

- **fetchCreatedSessions()**  
  Fetches sessions created by the current user, sorted by creation date (newest first).

- **fetchParticipatingSessions()**  
  Fetches sessions where the current user is a participant, sorted by creation date.

- **updateSessionData(sessionId, newData)**  
  Updates specified fields of a session document.

- **searchSessionById(sessionId)**  
  Retrieves session details by document ID.

- **searchSessionByIdForSearchAction(sessionId)**  
  Searches session by numeric sessionID field, returns success status and session data.

- **sortSessionsBy(field, order)**  
  Sorts the cached session list by a given field in ascending or descending order.

- **addQuestionResponse(sessionId, responseText)**  
  Adds a question response from the current user to a session if not already responded.

- **getParticipantsResponded(sessionId)**  
  Retrieves the list or status of participants who responded in a session.

- **getAllSessionsForCurrentUser()**  
  Returns all sessions for the current user, fetching created sessions if a teacher, or participating sessions if a student.

## Technologies Used

- Firebase Firestore for data storage and querying
- Firestore Timestamps and atomic updates
- Pinia store for user and role management
- Array operations like arrayUnion to manage participant lists and responses
