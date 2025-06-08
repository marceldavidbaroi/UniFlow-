# User Authentication Service

This module provides functions for user registration, login, password verification, and logout using Firebase Firestore and bcrypt for password hashing.

## Functions

### `registerUser(payload)`

- Registers a new user.
- Validates if the email is already registered.
- For users with the role `teacher`, requires a correct `adminAccessPassword`.
- Hashes the password before saving to Firestore.
- Returns success status and user ID on success.

### `loginUser(email, password)`

- Logs in a user by email and password.
- Fetches the user from Firestore.
- Compares hashed passwords using bcrypt.
- Updates the user state in the store on success.
- Returns success status and user data.

### `verifyUserPassword(password)`

- Verifies the provided password against the current authenticated user's password.
- Returns success or failure message accordingly.

### `logoutUser()`

- Logs out the current user.
- Clears the user state in the store.
- Returns success or failure message.

## Dependencies

- Firebase Firestore for user data storage.
- bcryptjs for password hashing and verification.
- Pinia store (`useUserStore`) for managing user state.

## Notes

- Admin access password for teachers is hardcoded as `'123123'` (can be improved for production).
- Passwords are stored hashed for security.
