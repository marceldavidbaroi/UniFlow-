# User Store Functions Summary

## Functions Overview

- **setUser(user)**  
  Sets the current user and their role in the local state.  
  Updates `currentUser` and `currentRole` properties.

- **clearUser()**  
  Clears the current user and role from local state.  
  Sets `currentUser` and `currentRole` to `null`.

- **getUserDetails(userId)**  
  Asynchronously fetches user details from Firestore by user ID.  
  Validates the `userId` parameter before querying.  
  Returns user data object including the Firestore document ID if found.  
  Returns `null` if user is not found or invalid ID is provided.  
  Logs errors and rethrows exceptions on failure.

- **getAllUsers()**  
  Asynchronously fetches all users from Firestore `users` collection.  
  Maps each document to an object with `id` and `name` (defaulting to 'Unnamed').  
  Updates local state property `allUsers` with the fetched data.  
  Returns the array of user objects.  
  Logs errors and rethrows exceptions on failure.

---

## Notes

- Firestore user documents are stored in the top-level `users` collection.
- The store maintains local state for the current user, role, and all users.
- Error handling includes console logging and throwing errors for caller awareness.
- User ID is expected as a non-empty string when fetching user details.
