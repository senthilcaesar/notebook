# 🔥 Firebase Setup Guide

Follow these steps to get your Flashcard app connected to Firebase Firestore (~5 minutes).

---

## Step 1 — Create a Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add project"**
3. Enter a project name (e.g. `my-notebook-flashcards`)
4. You can **disable Google Analytics** — it's not needed
5. Click **"Create project"**

---

## Step 2 — Enable Google Authentication

1. In the left sidebar, click **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in providers**, click **Google**
4. Toggle it **Enabled**
5. Set a **Project support email** (your Gmail address)
6. Click **Save**

---

## Step 3 — Create a Firestore Database

1. In the left sidebar, click **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules next)
4. Select a Firestore location closest to you (e.g. `us-central` or `asia-south1`)
5. Click **Enable**

---

## Step 4 — Set Firestore Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Each user can only read/write their own cards
    match /users/{userId}/cards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

## Step 5 — Register a Web App & Copy Config

1. In the left sidebar, click the **⚙️ gear icon → Project settings**
2. Scroll down to **"Your apps"** and click the **`</>`** (Web) icon
3. Enter an app nickname (e.g. `flashcards-web`) — no need to set up Firebase Hosting
4. Click **"Register app"**
5. You will see a code block like this — **copy all the values**:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "my-project.firebaseapp.com",
  projectId:         "my-project",
  storageBucket:     "my-project.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234567890:web:abcdef"
};
```

6. Click **"Continue to console"**

---

## Step 6 — Confirm Config in `src/lib/firebase.js`

1. Open `src/lib/firebase.js`
2. Find the Firebase config block:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

3. Replace the config values with the real values from Step 5
4. **Save the file**

---

## Step 7 — Open the App

> [!IMPORTANT]
> Because Firebase Authentication uses popup windows, the app works best when:
> - **Served over HTTP/HTTPS** (not just opened as a `file://` path), OR
> - You add `localhost` as an authorized domain in Firebase Console → Authentication → Settings → Authorized domains

### Local development with Vite:
```bash
npm install
npm run dev
```
Then open the local Vite URL shown in the terminal.

### Production preview after a build:
```bash
npm run build
npm run preview
```
Then open the local preview URL shown in the terminal.

---

## Step 8 — (Optional) Deploy to Firebase Hosting

Get a permanent public HTTPS URL for free:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # set public dir to "." when asked
firebase deploy
```

Your app will be live at `https://YOUR_PROJECT_ID.web.app`

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Yellow "configure Firebase" banner shows | `apiKey` is still `"YOUR_API_KEY"` — paste your real config |
| Popup blocked / sign-in fails | Serve the file over HTTP (see Step 7), not as `file://` |
| `Missing or insufficient permissions` | Check Firestore Security Rules (Step 4) |
| Cards not showing after sign-in | Check browser DevTools console for Firestore errors |
