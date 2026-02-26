# 📓 Build Your Personal Notebook Web App
### A Half-Day Tutorial for Business Professionals
**Tools:** Antigravity AI · Firebase · GitHub Pages  
**Prerequisite:** Git installed on your Mac · A Google account

---

## 🎯 What We're Building

By the end of this session, you will have a **live, personal notebook web app** — deployed on the internet with your own public URL you can share with anyone.

The app lets you:
- Store notes as beautiful flashcards that look like ruled notebook pages
- Organise notes by category (Coding, General, Research, and more)
- Search and filter your cards instantly
- Access your notes from **any device, anywhere** — synced to the cloud

**Zero coding experience required.** We will use an AI assistant to write all the code for us. Your job is to understand what's happening and give the AI the right instructions.

---

## 💰 Cost — It's Completely Free

Everything we use today costs **nothing**:

| Tool | Free Plan |
|---|---|
| **Antigravity AI** | Free to use |
| **Firebase (Google)** | Free Spark plan — **1 GB storage**, 50,000 reads/day, 20,000 writes/day |
| **GitHub Pages** | Free static website hosting |
| **Google Account** | You already have one |

Firebase's free tier is more than enough for a personal notebook — even if you add 1,000 cards per day for years, you'll stay well within the limit.

---

## 🗓️ Session Overview

| Phase | Time | What Happens |
|---|---|---|
| Phase 1 | 30 min | Understand the plan; set up GitHub account & repository |
| Phase 2 | 30 min | Use Antigravity AI to generate the app |
| Phase 3 | 45 min | Set up Firebase (database + sign-in) |
| Phase 4 | 30 min | Connect Firebase to the app & deploy to GitHub Pages |
| Phase 5 | 15 min | Test your live URL & explore how to extend the app |

---

## ✅ Before We Start — Checklist

Make sure you have the following **before the session begins**:

- [ ] **Git installed** on your Mac  
  → Verify: Open Terminal, type `git --version`, press Enter. You should see a version number.
- [ ] **A Google account** (your personal Gmail)
- [ ] **Google Chrome** browser open and ready
- [ ] **Antigravity** — downloaded and installed on your Mac (see Step 2.0 below for instructions)

---

---

# Phase 1 — Set Up GitHub (30 min)

GitHub is a free platform where developers store and share code. We'll use it to host your web app as a public URL.

## Step 1.1 — Create a GitHub Account

1. Open Chrome and go to **[github.com](https://github.com)**
2. Click **"Sign up"**
3. Enter your email address and create a password
4. Choose a username — this will appear in your app's URL (e.g. `john-smith` → `john-smith.github.io/flashcards`)
5. Complete email verification
6. On the welcome screen, you can skip all optional steps — click **"Skip personalization"**

> **Tip:** Choose your username carefully — keep it professional. You can use your name or initials. It will be part of your public URL.

## Step 1.2 — Create a New Repository

A "repository" (or "repo") is like a folder on GitHub that holds your project files.

1. Once logged in, click the **"+"** icon in the top-right corner
2. Click **"New repository"**
3. Fill in the details:
   - **Repository name:** `flashcards` *(all lowercase, no spaces)*
   - **Description:** `My personal notebook flashcard app`
   - **Visibility:** ✅ **Public** *(required for free GitHub Pages hosting)*
   - Leave everything else as-is
4. Click **"Create repository"**

You now have an empty repository. Leave this tab open.

## Step 1.3 — Open Terminal on Your Mac

Terminal is your Mac's text-based command tool. Think of it like Excel's formula bar — you type commands and it executes them.

1. Press **⌘ Command + Space** to open Spotlight Search
2. Type `Terminal` and press Enter
3. A window with a command prompt appears — this is where we'll type Git commands

> **Don't be intimidated by Terminal.** We'll use only 6–7 simple commands today, and you can copy-paste every one of them.

## Step 1.4 — Set Up Git (first-time only)

In Terminal, run these two commands. Use the **email address and username you used when creating your GitHub account**:

```bash
git config --global user.name "Your GitHub Username"
git config --global user.email "youremail@gmail.com"
```

*Press Enter after each line.*

> **Important:** Enter the exact email address and username you registered with on GitHub. This ensures Git can correctly link your commits to your GitHub account.

---

---

# Phase 2 — Generate the App with Antigravity AI (30 min)

This is the magic moment. One prompt. One click. A fully working web app.

## Step 2.0 — Download and Install Antigravity

Before using Antigravity, you need to download and install it on your Mac. This is a one-time setup.

1. Open Chrome and go to **[antigravity.google](https://antigravity.google)**
2. Click the **Download** button to download the installer
3. Open your **Downloads folder** and double-click the Antigravity installer
4. Follow the on-screen prompts:
   - Click **Continue** → **Install**
   - Enter your Mac password if prompted
   - Click **Install Software**
5. When you see **"Installation was successful"**, click **Close**

Antigravity is now installed on your Mac. You can launch it from your **Applications folder** or via **Spotlight** (⌘ Command + Space → type `Antigravity` → press Enter).

> **Note:** If you already have Antigravity installed, skip this step.

## Step 2.1 — Create a Project Folder

Before opening Antigravity, create a dedicated folder on your Mac where the app files will be saved.

1. Open **Finder**
2. Navigate to a location you'll remember (e.g. your **Desktop** or **Documents**)
3. Right-click in the empty space → **New Folder**
4. Name the folder exactly: `flashcards` *(all lowercase, no spaces)*
5. Leave this Finder window open — you'll need it shortly

> **Why create this folder first?** Antigravity saves files to whatever folder you have open as your workspace. Creating the folder now ensures your app files land in one organised place, ready to push to GitHub.

## Step 2.2 — Open Antigravity

Launch Antigravity from your Applications folder (or Spotlight) and open your `flashcards` folder as the workspace, then start a new conversation.

## Step 2.3 — Enter the Prompt

Copy and paste the following prompt **exactly as written** into Antigravity and press Send:

---

> **📋 The Prompt (copy this exactly):**
>
> *"Build me a personal notes web app as a single HTML file. I want to save my notes as flashcards that look like handwritten notebook pages — styled to resemble a student's ruled paper with a pencil feel. Each flashcard should have: a title, a date, a note body, a copy button, an edit button, and a delete button. Each flashcard should also support multiple free-form tags — the user can type and add as many tags as they like (for example: 'python', 'meeting notes', 'ideas'). Tags should be displayed as small badge labels on the card. For now, save notes in the browser's local storage. After building the app, also create a CLAUDE.md file that explains what was built."*

---

> **⏱️ Wait ~30–60 seconds.** Antigravity (powered by Claude Sonnet) will write the entire app — several hundred lines of HTML, CSS, and JavaScript — in one shot. No iteration needed.

## Step 2.4 — Locate the Generated Files

Antigravity will create two files in your workspace:
- `index.html` — the complete app
- `CLAUDE.md` — documentation of what was built

> **What just happened?** The AI read your plain-English description and translated it into a complete web application. The "UI framework" it chose uses Google Fonts (Caveat for handwriting, Inter for interface text) and Font Awesome icons — all loaded from CDN (the internet), so no installation is needed.

## Step 2.5 — Preview the App Locally

In Terminal, navigate to the folder containing your `index.html` file:

```bash
cd /path/to/your/folder
```

*(Replace the path with wherever Antigravity saved the file — the chat will tell you)*

Then run:

```bash
npx serve .
```

This starts a local web server. Open Chrome and go to:
```
http://localhost:3000/index.html
```

You should see your notebook app with 5 pre-loaded demo flashcards! ✨

> **Note:** At this point, cards are saved only in your browser's local storage. They won't carry over to other devices. We fix that in the next phase.

---

---

# Phase 3 — Set Up Firebase (45 min)

Firebase is Google's free cloud database platform. We'll use it to give your app two superpowers:
1. **☁️ Cloud storage** — cards save to the internet, not just your browser
2. **🔐 Google Sign-In** — your data is private, tied to your Google account

## Step 3.1 — Create a Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Sign in with your **personal Google account**
3. Click **"Add project"**
4. **Project name:** `my-notebook-flashcards` *(or any name you like)*
5. On the next screen: **disable Google Analytics** (we don't need it) → toggle it off
6. Click **"Create project"**
7. Wait ~20 seconds for it to provision → Click **"Continue"**

## Step 3.2 — Enable Google Sign-In

1. In the left sidebar: **Build → Authentication**
2. Click **"Get started"**
3. Under **"Sign-in providers"**, click **Google**
4. Toggle **Enable** to ON
5. **Project support email:** select your Gmail from the dropdown
6. Click **Save**

✅ Google Sign-In is now active.

## Step 3.3 — Create a Firestore Database

Firestore is the actual database where your flashcard notes will be stored.

1. In the left sidebar: **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** → click Next
4. **Choose your location:** pick the region closest to you
   - India: `asia-south1`
   - US: `us-central1`
   - Europe: `europe-west1`
5. Click **Enable**

Wait ~15 seconds for the database to be created.

## Step 3.4 — Set Security Rules

Security rules control who can read/write your data. We'll set it so only *you* (when signed in) can access *your* cards.

1. In Firestore, click the **"Rules"** tab at the top
2. Delete everything in the rules editor and paste this:

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

3. Click **"Publish"**

> **What does this mean?** Each signed-in user can only see their own cards — nobody else's. If someone tried to access your data directly, Firebase would block them automatically.

## Step 3.5 — Register Your Web App & Get Your Config

This step gives you a "key" to connect your HTML app to Firebase.

1. Click the **⚙️ gear icon** (top-left) → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **`</>`** icon (Web app)
4. **App nickname:** `flashcards-web`
5. **Do NOT tick** "Also set up Firebase Hosting" — we're using GitHub Pages instead
6. Click **"Register app"**
7. You'll see a block of code like this:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "my-notebook-abc.firebaseapp.com",
  projectId:         "my-notebook-abc",
  storageBucket:     "my-notebook-abc.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};
```

8. **Copy this entire block** — you'll need it in the next phase
9. Click **"Continue to console"**

> **A note on the API key:** This config will be visible in your public GitHub file. That is completely normal and safe for Firebase — see the box below.

> [!NOTE]
> **🔐 Is my API key safe to put on GitHub?**
>
> Yes — and here is why. A Firebase web API key is not like a bank password. It simply tells Firebase *which project* you are connecting to, like a public address. **The actual security comes from the rules we set in Step 3.4** — those rules mean nobody can read or write your cards unless they are signed in with *their own* Google account.
>
> Even if someone copies your API key, they cannot see your notes. Firebase will block them.
>
> **Optional extra step — restrict the key to your domain only:**
> 1. Go to [console.cloud.google.com](https://console.cloud.google.com) → select your project
> 2. **APIs & Services → Credentials** → click your Browser API key
> 3. Under **Application restrictions** → choose **HTTP referrers**
> 4. Add `https://YOUR-USERNAME.github.io/*` and `http://localhost:*`
> 5. Click **Save**
>
> Now the key only works from your URL. Anyone who copies it cannot use it anywhere else.

---

---

# Phase 4 — Add Firebase to the App & Deploy (30 min)

Now we'll upgrade the app to use Firebase and push it live to GitHub Pages.

## Step 4.1 — Send the Second Prompt to Add Firebase

Now that you've tested the app locally, it's time to upgrade it with cloud storage. Go back to Antigravity and send this **second prompt** in the **same conversation**:

---

> **📋 Second Prompt (copy this exactly):**
>
> *"Great — the app looks good. Now please upgrade it to use Firebase for cloud storage and Google Sign-In for login. Each user's notes should be private and automatically synced across all their devices. Keep the same design and features — just add the Firebase and Google Sign-In functionality on top."*

---

Antigravity will rewrite `index.html` to include:
- Firebase SDK
- Google Sign-In button
- Firestore database reads and writes
- A real-time sync indicator
- A friendly setup banner (until you paste in your Firebase config)

## Step 4.2 — Paste Your Firebase Config

1. Open `index.html` in a text editor  
   → Right-click the file → **Open With → TextEdit** (or any text editor)
2. Use **⌘ Cmd + F** to find the text: `YOUR_API_KEY`
3. You'll see the placeholder config block:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  ...
};
```

4. **Replace the entire block** with the real config you copied from Firebase Console in Step 3.5
5. **Save the file** (⌘ Cmd + S)

## Step 4.3 — Push to GitHub

Now we'll upload the file to GitHub. In Terminal:

**Navigate to your project folder:**
```bash
cd /path/to/your/folder
```

**Initialize a Git repository:**
```bash
git init
```

**Add your file:**
```bash
git add index.html
```

**Save a snapshot (called a "commit"):**
```bash
git commit -m "Initial flashcard app with Firebase"
```

**Connect to your GitHub repository** *(replace YOUR-USERNAME with your GitHub username)*:
```bash
git remote add origin https://github.com/YOUR-USERNAME/flashcards.git
```

**Push your file to GitHub:**
```bash
git branch -M main
git push -u origin main
```

> **When prompted:** Enter your GitHub username. For the password, use a **Personal Access Token** (not your GitHub password — GitHub stopped accepting passwords in 2021).
>
> **To generate a token:**
> 1. GitHub → top-right avatar → **Settings**
> 2. Scroll to bottom: **"Developer settings"**
> 3. **Personal access tokens → Tokens (classic) → Generate new token**
> 4. Set expiration to **90 days**, tick **"repo"** scope → **Generate token**
> 5. **Copy the token immediately** (you won't see it again) and paste it as your password

## Step 4.4 — Enable GitHub Pages

1. In Chrome, go to your GitHub repository: `github.com/YOUR-USERNAME/flashcards`
2. Click **"Settings"** tab (top of the repo)
3. In the left sidebar: **"Pages"**
4. Under **"Branch"**, select **`main`** from the dropdown → click **Save**
5. Wait ~60 seconds

Refresh the page. You'll see:
> **"Your site is live at https://YOUR-USERNAME.github.io/flashcards/"**

🎉 **That's your public URL!**

## Step 4.5 — Add GitHub Pages as an Authorized Domain in Firebase

> **This is a critical step that's easy to miss.** Firebase blocks sign-ins from unknown domains for security. You need to tell Firebase that your GitHub Pages domain is trusted.

1. Go back to **[Firebase Console](https://console.firebase.google.com)**
2. **Build → Authentication → Settings tab**
3. Scroll to **"Authorized domains"**
4. Click **"Add domain"**
5. Enter your GitHub Pages domain:
   ```
   YOUR-USERNAME.github.io
   ```
   *(no `https://`, no path — just the domain)*
6. Click **Add**

✅ Done. Sign-in will now work on your live URL.

---

---

# Phase 5 — Test & Explore (15 min)

## Step 5.1 — Open Your Live App

Go to:
```
https://YOUR-USERNAME.github.io/flashcards/index.html
```

You should see:
- Your notebook app with a **"Sign in with Google"** button
- A green desk background with the notebook logo

## Step 5.2 — Sign In & Add Your First Card

1. Click **"Sign in with Google"** → select your Google account
2. You're in! The app loads with an empty card grid (your personal, private view)
3. Click **"+ New Card"**
4. Add your first real note:
   - **Title:** Something from today's session
   - **Category:** General
   - **Note:** What you learned
5. Click **Save Card**

Your card is now stored in Firebase Firestore — visible from any device when you sign in.

## Step 5.3 — Test Real-Time Sync

1. **Open the same URL in a second browser tab**
2. Sign in again
3. Add a card in Tab 1
4. Watch it appear automatically in Tab 2 — no refresh needed!

This is Firebase Firestore's real-time sync in action.

## Step 5.4 — Verify in Firebase Console

1. Go to **Firebase Console → Firestore Database**
2. Click through the structure: `users → [your-uid] → cards`
3. You'll see each card stored as a document — this is your data in the cloud

---

---

# 🛠️ Troubleshooting Guide

| Problem | Solution |
|---|---|
| **"Firebase not configured" yellow banner** | Your `firebaseConfig` still has `"YOUR_API_KEY"` — paste your real config and save |
| **"Sign-in failed: unauthorized-domain"** | You haven't added your domain to Firebase → go to Auth → Settings → Authorized domains |
| **Sign-in popup doesn't open / is blocked** | Enable popups for your site in Chrome → address bar → click lock icon → Site settings → Allow popups |
| **`git push` asks for password, then fails** | Use a Personal Access Token (not your GitHub password) — see Step 4.3 |
| **`git: command not found`** | Git is not installed — install from [git-scm.com](https://git-scm.com) |
| **Cards not saving** | Check Firestore security rules are published correctly (Step 3.4) |
| **App shows old version after push** | GitHub Pages can take 1–2 minutes to update — wait and hard-refresh (⌘ Shift + R) |

---

---

# 🚀 What's Next — Extend Your App

Your app is live and working — but it's just the beginning. Here are things you can customise yourself:

## Change the Categories

Open `index.html` in a text editor and find the `CATEGORY_META` section in the JavaScript:

```javascript
const CATEGORY_META = {
  coding:   { label: '💻 Coding',   cls: 'badge-coding'   },
  general:  { label: '📌 General',  cls: 'badge-general'  },
  research: { label: '🔬 Research', cls: 'badge-research' },
  other:    { label: '🗂 Other',    cls: 'badge-other'    },
};
```

Replace these with categories relevant to your work, for example:

```javascript
const CATEGORY_META = {
  strategy:    { label: '♟️ Strategy',    cls: 'badge-coding'   },
  finance:     { label: '💰 Finance',     cls: 'badge-general'  },
  operations:  { label: '⚙️ Operations',  cls: 'badge-research' },
  networking:  { label: '🤝 Networking',  cls: 'badge-other'    },
};
```

Also update the dropdown in the modal (`<select id="inputCategory">`) to match.

## Change the Colour Scheme

Find `--accent-desk` in the CSS `:root` block:
```css
--accent-desk: #4a7c59;   /* dark green desk */
```
Change it to any hex colour — `#1e3a5f` for navy, `#5c2d91` for purple, etc.

## Ask Antigravity to Extend It

You can continue the conversation with Antigravity to add new features:
- *"Add a tags field to each card"*
- *"Add the ability to mark a card as a favourite"*
- *"Add a dark mode toggle"*
- *"Export all my cards as a PDF"*

Each enhancement follows the same workflow: describe it in plain English → Antigravity writes the code → you update the file and push to GitHub.

---

---

# 📊 What You Built — Architecture Summary

For the curious: here's what's happening under the hood (explained simply):

```
Your Browser (HTML File on GitHub Pages)
       │
       │  Google Sign-In (OAuth)
       ▼
Firebase Authentication ──────────────────────────┐
       │                                           │
       │  Read/Write cards                         │ Verifies identity
       ▼                                           │
Firebase Firestore (Cloud Database) ◄─────────────┘
 └── users/
      └── your-unique-id/
           └── cards/
                ├── card-001 { title, note, category, date }
                ├── card-002 { ... }
                └── ...
```

- **GitHub Pages** hosts your HTML file (static delivery — free, fast)
- **Firebase Auth** handles "who are you?" — uses Google's secure login
- **Firestore** stores your cards — NoSQL document database, real-time sync
- **No server needed** — everything runs in the browser or on Google's infrastructure

---

# 🏁 Congratulations!

You've built and deployed a full-stack web application using AI — without writing a single line of code manually.

**Your app URL:**  
`https://YOUR-USERNAME.github.io/flashcards/index.html`

Share it. Use it. Make it your own.

---

*Tutorial prepared for the "Build with AI" workshop session.*  
*Tools used: Antigravity (Claude Sonnet), Firebase, GitHub Pages.*
