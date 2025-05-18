/**
 * Functions:
 * - createNote(title, description, links, category, tags, isPublic, sharedWith)
 * - fetchNotesByUser()
 * - fetchPublicNotes()
 * - updateNote(noteId, updatedData)
 * - deleteNote(noteId)
 * - shareNote(noteId, userIds)
 * - toggleNoteVisibility(noteId, isPublic)
 * - filterNotes({ tags, category, isPublic })
 * - searchNotes({ keyword })
 * - sortNotes(criteria) // 'dateCreated', 'dateModified', 'title'
 * - groupNotesBy(field) // 'tags' or 'category'
 * - exportNoteToFormat(noteId, format) // 'pdf', 'word', etc.
 */

import { db } from 'boot/firebase'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { useUserStore } from '../user-store'

const userStore = useUserStore()
const notesCollection = collection(db, 'notes')

export default {
  async createNote(payload) {
    const newNote = {
      ...payload,

      ownerId: userStore.currentUser.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    console.log('newNote', newNote)
    await addDoc(notesCollection, newNote)
  },

async fetchNotesByUser() {
  const q = query(
    notesCollection,
    where('ownerId', '==', userStore.currentUser.id)
  )
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  this.userNotes = data
  return data
},
  async fetchPublicNotes() {
    const q = query(notesCollection, where('isPublic', '==', true))
    const snapshot = await getDocs(q)
    const data=snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    this.publicNotes=data
    return data
  },

  async updateNote(noteId, updatedData) {
    const noteRef = doc(notesCollection, noteId)
    await updateDoc(noteRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    })
  },

  async deleteNote(noteId) {
    await deleteDoc(doc(notesCollection, noteId))
  },

  async shareNote(noteId, userIds) {
    const noteRef = doc(notesCollection, noteId)
    const noteSnap = await getDoc(noteRef)
    if (noteSnap.exists()) {
      const current = noteSnap.data().sharedWith || []
      await updateDoc(noteRef, {
        sharedWith: Array.from(new Set([...current, ...userIds])),
      })
    }
  },

  async toggleNoteVisibility(noteId, isPublic) {
    await updateDoc(doc(notesCollection, noteId), {
      isPublic,
    })
  },

  async filterNotes({ tags = [], category = '', isPublic = null }) {
    let q = query(notesCollection)

    if (tags.length > 0) {
      q = query(q, where('tags', 'array-contains-any', tags))
    }
    if (category) {
      q = query(q, where('category', '==', category))
    }
    if (isPublic !== null) {
      q = query(q, where('isPublic', '==', isPublic))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async searchNotes({ keyword }) {
    const q = query(notesCollection, where('ownerId', '==', userStore.currentUser.uid))
    const snapshot = await getDocs(q)
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((note) =>
        [note.title, note.description, ...(note.tags || []), note.category]
          .join(' ')
          .toLowerCase()
          .includes(keyword.toLowerCase()),
      )
  },

  async sortNotes(criteria = 'dateCreated') {
    const notes = await this.fetchNotesByUser()
    return notes.sort((a, b) => {
      if (criteria === 'title') {
        return a.title.localeCompare(b.title)
      }
      return b[criteria]?.seconds - a[criteria]?.seconds
    })
  },

  async groupNotesBy(field) {
    const notes = await this.fetchNotesByUser()
    const grouped = {}
    notes.forEach((note) => {
      const key = field === 'tags' ? (note.tags || []).join(', ') : note[field]
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(note)
    })
    return grouped
  },

  async exportNoteToFormat(noteId, format) {
    // Placeholder for export logic (PDF, Word, etc.)
    // You can integrate jsPDF or similar libraries depending on export needs
    const noteSnap = await getDoc(doc(notesCollection, noteId))
    if (!noteSnap.exists()) return null
    const note = noteSnap.data()

    // Simulate export structure
    return {
      format,
      content: `
        Title: ${note.title}
        Description: ${note.description}
        Links: ${note.links.join(', ')}
        Tags: ${note.tags.join(', ')}
        Category: ${note.category}
      `,
    }
  },
}
