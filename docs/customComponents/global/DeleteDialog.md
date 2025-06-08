# Delete Confirmation Dialog Component

A reusable Vue 3 component using Quasar Framework to show a delete confirmation dialog. It optionally requires the user to type a specific name to confirm the deletion.

---

## Features

- Dialog with customizable title and description.
- Optional input field for typing a confirmation string.
- Validation to ensure typed input matches the expected text before enabling the delete button.
- Emits events to control visibility and notify when deletion is confirmed.
- Uses Quasar UI components (`q-dialog`, `q-card`, `q-input`, `q-btn`, `q-icon`).

---

## Usage

```vue
<DeleteConfirmationDialog
  v-model="showDialog"
  :cardTitle="'Confirm Delete Item'"
  :description="'This action cannot be undone. Please confirm.'"
  :inputField="true"
  :nameToMatch="'ImportantItem123'"
  buttonLabel="Delete"
  @confirm-delete="handleDelete"
/>
```
