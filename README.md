# UNIFLOW – Modern Interactive Class Management

A real-time collaborative learning platform for university students and educators, built with Quasar Framework and Firebase.

## Overview

UNIFLOW provides a seamless environment for managing interactive classes, creating and joining groups, organizing group-based sessions, and handling tasks and notes—all in real time. The platform is designed for students, teachers, and admins to collaborate efficiently and intuitively.

## Core Features

- **Authentication & Authorization:**
  - Secure login with Firebase Authentication (email/password, Google, etc.)
  - Role-based access: Student, Teacher, Admin
- **Interactive Class Management:**
  - Create, join, and manage class sessions
  - Group-based session creation and management
- **Group Collaboration:**
  - Create and join groups for collaborative learning
  - Group chat and shared resources
- **Task & To-Do Management:**
  - Create, assign, and submit tasks
  - Track to-dos and deadlines
  - Attachments and online code editor for submissions
- **Smart Notes:**
  - Take, organize, and share notes during sessions
- **Admin Panel:**
  - Manage users, sessions, groups, and activities
  - View system logs and change user roles

## Technology Stack

- **Frontend:**
  - [Quasar Framework](https://quasar.dev/) (Vue.js)
- **Backend:**
  - [Firebase Firestore](https://firebase.google.com/docs/firestore)

## Architecture & Design

- Component-based UI
- State management with Pinia
- Firebase Security Rules for data protection
- Responsive, user-centered design
- Robust error handling and scalable structure

## Firestore Requirement

This project requires a Firebase Firestore database to store and sync data in real time. You must create a Firestore instance in your Firebase project and configure security rules to protect your data.

## Environment Setup

Create a `.env` file at the root of your project and add your Firebase configuration using the example below:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Note: The VITE\_ prefix is required so these variables can be accessed in your Quasar application via import.meta.env.

## Getting Started

1. **Clone the repository:**
   ```powershell
   git clone [repository_url]
   cd [project_directory]
   ```
2. **Install dependencies:**
   ```powershell
   npm install
   ```
3. **Configure Firebase:**
   - Create a Firebase project and enable Firestore and Authentication.
   - Add your Firebase config to the .env file as shown above.
4. **Run the development server:**
   ```powershell
   quasar dev
   ```

## Future Enhancements

- Push notifications
- Video conferencing
- Calendar integration
- Code playback and review
- API integrations
- Accessibility improvements

## Contributing

Contributions are welcome! Please submit pull requests or open issues for bugs or feature requests.

## License

[MIT License or other license]
