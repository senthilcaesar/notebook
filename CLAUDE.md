# My Notebook Flashcards — CLAUDE.md

## Overview

A **single-file static HTML app** (`flashcards.html`) that stores personal notes as ruled-notebook-style flashcards, synced to **Firebase Firestore** (cloud) with **Google Sign-In**.

---

## Features

| Feature | Details |
|---|---|
| **Flashcard UI** | Ruled notebook page with red margin line and spiral binding holes |
| **Fields** | Title, Note body, Category, Date |
| **Category filter** | Pill buttons: All · Coding · General · Research · Other |
| **Search** | Real-time keyword search across title, note, and category |
| **Copy button** | Copies full card text to clipboard |
| **Add / Edit / Delete** | Modal form; `Ctrl/Cmd+Enter` to save |
| **Cloud sync** | Firebase Firestore — real-time sync across all devices/tabs |
| **Auth** | Google Sign-In — cards are private per user |
| **Sync indicator** | Green/yellow/red dot in header shows live sync state |

---

## File Structure

```
prompts/
├── flashcards.html      ← The entire app (HTML + CSS + JS + Firebase)
├── firebase-setup.md    ← Step-by-step Firebase project setup guide
└── CLAUDE.md            ← This documentation file
```

---

## Getting Started

> [!IMPORTANT]
> The app requires a Firebase project. Follow [firebase-setup.md](firebase-setup.md) to set one up (~5 min).

1. **Complete Firebase setup** (see `firebase-setup.md`)
2. **Paste your `firebaseConfig`** into the marked block in `flashcards.html`
3. **Serve locally** (required for Google Sign-In popup to work):
   ```bash
   npx serve .
   # then open http://localhost:3000/flashcards.html
   ```
4. **Sign in with Google** → your cards load and sync in real-time

---

## Tech Stack

| Layer | Choice |
|---|---|
| Structure | HTML5 (single file) |
| Styling | Vanilla CSS + CSS custom properties |
| Typography | Caveat (handwriting) + Inter (UI) via Google Fonts |
| Icons | Font Awesome 6 via CDN |
| Auth | Firebase Authentication (Google provider) |
| Database | Firebase Firestore (real-time NoSQL) |
| SDK | Firebase v10 compat shims (no build step) |

---

## Firestore Data Model

```
/users/{uid}/cards/{cardId}
  - title:      string
  - note:       string
  - category:   "coding" | "general" | "research" | "other"
  - date:       "YYYY-MM-DD"
  - createdAt:  Firestore Timestamp (server-side)
```

Each user's cards are stored under their own UID — fully isolated.

---

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/cards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Categories

| Key | Display | Color |
|---|---|---|
| `coding` | 💻 Coding | Blue (#3b82f6) |
| `general` | 📌 General | Indigo (#6366f1) |
| `research` | 🔬 Research | Pink (#ec4899) |
| `other` | 🗂 Other | Orange (#f97316) |

To add a new category, update:
1. `<select id="inputCategory">` options in the modal
2. `CATEGORY_META` object in the JS section
3. A `.badge-<name>` CSS class

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl / Cmd + Enter` | Save card (modal open) |
| `Escape` | Close modal |

---

## Customization Tips

- **Desk color**: Change `--accent-desk` in `:root`
- **Line spacing**: Adjust `28px` in `repeating-linear-gradient`
- **Card width**: Change `minmax(300px, 1fr)` in `.cards-grid`
- **Export cards**: Firebase Console → Firestore → select collection → Export
