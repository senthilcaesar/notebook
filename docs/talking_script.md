# 🎤 Talking Script — Build Your Personal Notebook Web App
### Speaker Notes for Workshop Facilitator
*Short sentences. Plain English. Pause after each instruction.*

---

## OPENING (Before you begin)

---

> "Welcome everyone. Thank you for joining today's session."

> "Today, we are going to build a real web app together — a **personal notebook app**. You will publish it on the internet. At the end, you will have **your own website** — something like *your-name.github.io/flashcards* — that is live on the internet. It will be your personal space for storing and accessing your notes from any device, anytime."

> "And here is the exciting part — **we are going to use AI to create this app.** You will not write a single line of code yourself. You will simply describe what you want in plain English, and the AI will build it for you."

> "To build and launch this app, we will use three tools. All of them are **free**. Let me quickly walk you through what each one does."

> "**GitHub & GitHub Pages** — this is where we store the code and publish it as a live website. Think of it like Google Drive for code — except it also gives you a real URL on the internet." 

> "**Antigravity** — this is an AI coding tool built for software development. It comes with a powerful AI model inside. We will use it by simply typing our instructions in plain English — no coding knowledge needed — and the model will build the app for us."

> "**Firebase** — this is Google's cloud service. It stores your notes securely in the cloud and handles the login with your Google account."


> "That is it. Three tools. Let's see what we are building."

> "Let me show you a quick preview of the app I built using this process."

*(Show the app preview on screen)*

> "The app is a digital notebook. You can easily add a new card, write your notes, add a date, and tag them however you like — with your own custom tags. Each card also has **edit**, **copy**, and **delete** buttons, so you have full control over your notes. And because everything is saved to the cloud, you can open the app on your phone, your laptop, any device — and see the same notes everywhere."

> "Now — **your app may not look exactly like this.** The AI can produce different designs depending on the exact words in your prompt and the model you choose. That is completely fine — and actually one of the interesting things about working with AI. The core features will be there: the flashcards, the categories, the search, the cloud sync. The visual style may vary."

> "Also — everything we use today is **completely free.** No credit card. No subscription. Google gives us one gigabyte of free cloud storage with Firebase — that is enough to store tens of thousands of notes."

> "Before we move to the next step — which is creating a GitHub account — we need to make sure Git is installed on your Mac."

> "Let me quickly explain what Git is and why we need it."

> "**Git** is a helper tool that lives on your System. Its job is simple — it helps you upload and host your app's code to your GitHub account, so it can be published as a live website on the internet."

> "We will use a few simple Git commands to host our code online in your GitHub account. I will give you each command to copy and paste — you do not need to memorise anything."

> "I have already installed Git on my system. Now I need you to do the same on yours."

> "Open Terminal and type `git --version`. Press Enter. You should see a version number on the screen."

*(Wait for everyone to check)*

> "If you see a version number — great, you are ready. If you see 'command not found', you need to install Git first. Here is how:"

> "Go to **git-scm.com/download** in Chrome. You will see options for different operating systems — Windows, Mac, and Linux. Choose the one that matches your system. The download will start automatically. Open the downloaded file and follow the installer steps — just click through and accept the defaults."

> "Once it is installed, close Terminal, open it again, and type `git --version`. You should now see a version number."

> "**Important — please do not move to the next step until Git is installed and working on your system.** Take your time. Raise your hand if you need help and I will come to you."

*(Wait and help anyone with issues)*

> "Good. Everyone has Git. Now we are ready to move to Phase 1 — setting up your GitHub account."

---
---

## PHASE 1 — Set Up GitHub (30 minutes)

---

### Step 1.1 — Create a GitHub Account

> "First, we need to create a GitHub account. Think of GitHub as a cloud folder for code files — similar to Google Drive, but for developers."

> "Open Google Chrome. Go to **github.com**."

*(Wait for everyone)*

> "Click the green button that says **Sign up**."

> "Enter your email address. Create a password. Then choose a username."

> "**Pay attention to the username.** This is important. Your username will appear in your app's URL. So if your username is 'john-smith', your app URL will be 'john-smith.github.io/flashcards'. Keep it simple, professional — use your name or initials."

> "After you enter your details, GitHub will send a verification email. Open your email and click the link."

*(Wait for everyone to verify)*

> "Once you are inside GitHub, you can skip any welcome questions. Just click 'Skip personalization' if you see it."

> "Take a moment — everyone should now be on the GitHub home page."

---

### Step 1.2 — Create a New Repository

> "Now we create a repository. A repository is like a project folder on GitHub. Every project has its own repository."

> "Look at the top-right corner of GitHub. You will see a **plus sign**. Click it."

> "Click **New repository**."

> "For the name, type exactly: **flashcards** — all lowercase, no spaces."

> "For description, type: *My personal notebook flashcard app*."

> "Make sure **Public** is selected. This is important — GitHub Pages only works with public repositories on the free plan."

> "Leave everything else as it is. Scroll down and click **Create repository**."

> "You will see an empty page with some text and code. That is normal — the folder is empty right now. Leave this tab open. We will come back to it."

---

### Step 1.3 — Open Terminal

> "Now we need to open the Terminal. The Terminal is a tool on your Mac that lets you give text commands to your computer. It looks a bit like a black window with white text."

> "Do not worry — we will only use it for a few simple commands today. You can copy and paste every command I give you."

> "To open Terminal: press **Command and Space** together. This opens Spotlight Search. Type the word **Terminal**. Press Enter."

> "A window opens with a blinking cursor. That is your Terminal."

*(Wait for everyone)*

---

### Step 1.4 — Set Up Git

> "Before we use Git, we need to tell it your name and email. Git uses this to track who made changes. We do this only once."

> "In Terminal, type this command — but use **your own name**, not mine:"

> `git config --global user.name "Your Full Name"`

> "Press Enter. Now type this — using your own email address:"

> `git config --global user.email "youremail@gmail.com"`

> "Press Enter."

> "Nothing will happen. That is fine — Terminal is silent when a command works correctly. If you see an error message, raise your hand."

---
---

## PHASE 2 — Generate the App with Antigravity AI (30 minutes)

---

### Step 2.0 — Download and Install Antigravity

> "Before we open Antigravity, we need to download and install it on your computer. This is a one-time setup."

> "Open Chrome and go to the **Antigravity download page**. You will see a big download button — click it."

> "Once the download finishes, open your **Downloads folder** and double-click the Antigravity installer."

> "Follow the on-screen instructions: click **Continue**, then **Install**, then enter your Mac password if asked. Click **Install Software**."

> "When the installer says 'Installation was successful', click **Close**."

> "Antigravity is now installed on your Mac. You can find it in your **Applications folder** — or just use Spotlight: press **Command + Space**, type **Antigravity**, press Enter."

*(Wait for everyone to finish installing)*

> "Raise your hand if you see an error during installation."

*(Help anyone with issues)*

---

### Step 2.1 — Open Antigravity

> "Now the fun part. Open Antigravity from your Applications folder — or from Spotlight."

> "Start a new conversation. You will see a text box where you can type a message — just like WhatsApp or email."

---

### Step 2.2 — Enter the Prompt

> "I am going to give you a message to send to the AI. This message is called a **prompt**. The prompt is your instruction to the AI — in plain English."

> "I want you to copy this prompt **exactly as it is written**. Do not change any words. The exact wording helps the AI understand what we want."

*(Read the prompt slowly, then tell them to copy-paste it)*

> "Here is the prompt. I will put it on the screen now. Please copy and paste it into Antigravity:"

---

**[DISPLAY ON SCREEN:]**
> *"Build me a personal notes web app as a single HTML file. I want to save my notes as flashcards that look like handwritten notebook pages — styled to resemble a student's ruled paper with a pencil feel. Each flashcard should have: a title, a date, a note body, a copy button, an edit button, and a delete button. Each flashcard should also support multiple free-form tags — the user can type and add as many tags as they like (for example: 'python', 'meeting notes', 'ideas'). Tags should be displayed as small badge labels on the card. For now, save notes in the browser's local storage. After building the app, also create a CLAUDE.md file that explains what was built."*

---

> "Everyone paste that prompt and press **Send**."

> "Now we wait. The AI is reading your instructions and writing the entire app. This takes about 30 to 60 seconds."

*(Wait)*

> "Look at what is happening. The AI is writing hundreds of lines of code — HTML, CSS, JavaScript — by itself. We just told it what we wanted in plain English. This is the power of AI-assisted development."

---

### Step 2.3 — Understand What Was Created

> "Antigravity has created two files for you."

> "The first one is called **index.html** — this is your entire web app. Everything is inside this one file."

> "The second one is **CLAUDE.md** — this is a documentation file. Think of it as a summary of what the AI built. You can use it later as a reference."

> "In the chat, Antigravity will tell you exactly where the files are saved on your Mac."

---

### Step 2.4 — Preview the App

> "Let's take a quick look at what we built before we do anything else."

> "Go back to Terminal. We need to navigate to the folder where your file is saved."

> "Type **cd** — that stands for 'change directory'. Then type a space. Then drag your project folder from Finder into the Terminal window. It will automatically write the path for you. Press Enter."

> "Now type this command:"

> `npx serve .`

> "Press Enter. This starts a small local web server on your computer."

> "Open a new tab in Chrome. Go to:"

> `http://localhost:3000/index.html`

> "You should see your notebook app. There are some example flashcards already loaded. Click the filter buttons at the top. Try searching for a word. Click 'New Card' and add a note."

> "This is your app — running on your Mac right now."

> "But there is one problem. If you close this browser tab and open it again, your cards will still be there — but only in **this browser on this computer**. They are not in the cloud yet. That is what we do next."

> "Press **Control + C** in Terminal to stop the local server."

---
---

## PHASE 3 — Set Up Firebase (45 minutes)

---

> "Firebase is a Google product. It gives us two things for free: a cloud database to store your cards, and Google Sign-In so your data is private."

> "Let me say that again. With Firebase: your cards are stored on Google's servers — not on your laptop. You can open your app on your phone, your office computer, anywhere — and see the same cards."

---

### Step 3.1 — Create a Firebase Project

> "In Chrome, open a new tab and go to: **console.firebase.google.com**"

> "Sign in with your **personal Google account**. The same Gmail you use every day."

> "Click **Add project**."

> "Give it a name. You can use: **my-notebook-flashcards**. Or use your own name."

> "On the next screen, it asks about Google Analytics. We do not need this. **Toggle it off.** Then click **Create project**."

> "Wait about 20 seconds. Firebase is setting up your project. When it says 'Your new project is ready', click **Continue**."

---

### Step 3.2 — Enable Google Sign-In

> "Now we turn on the ability to sign in with Google."

> "Look at the left sidebar. Click **Build**. Then click **Authentication**."

> "Click the button that says **Get started**."

> "You will see a list of sign-in methods. Click on **Google**."

> "Toggle the switch to turn it **Enabled**. It will turn blue."

> "Below that, choose your Gmail address as the support email."

> "Click **Save**."

> "That's it. Google Sign-In is now ready."

---

### Step 3.3 — Create a Firestore Database

> "Now we create the database. The database is where your flashcard notes will actually be stored."

> "In the left sidebar: click **Build**, then click **Firestore Database**."

> "Click **Create database**."

> "It asks you about security mode. Choose **Start in production mode**. Click **Next**."

> "Now it asks you to choose a location. Choose the one closest to where you are:"
> - "If you are in India: choose **asia-south1**"
> - "If you are in the US: choose **us-central1**"
> - "If you are in Europe: choose **europe-west1**"

> "Click **Enable**. Wait about 15 seconds."

> "Your database is now ready. It is empty — but we will fill it with your notes soon."

---

### Step 3.4 — Set Security Rules

> "This is an important step. We need to set rules to make sure only **you** can read and write **your** cards. Nobody else can access your data."

> "Click the **Rules** tab at the top of the Firestore page."

> "You will see some text in the editor. **Select all of it and delete it.**"

> "Now paste this — I will put it on the screen:"

**[DISPLAY ON SCREEN:]**
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

> "Click **Publish**."

> "What did we just do? We told Firebase: 'Only let someone read their own cards, and only if they are signed in.' Firebase will automatically enforce this — you do not have to do anything else."

---

### Step 3.5 — Get Your Firebase Config

> "Now we need to get a special key that connects your app to your Firebase project. Think of it like a password — it tells the app which Firebase project to talk to."

> "Click the **gear icon** at the top-left of Firebase Console. Select **Project settings**."

> "Scroll down until you see a section called **Your apps**. It might be empty."

> "Click the icon that looks like this: **</>** — that is the web app icon."

> "For the nickname, type: **flashcards-web**."

> "Do **not** tick the box that says 'Also set up Firebase Hosting'. We are using GitHub Pages instead."

> "Click **Register app**."

> "You will now see a block of code with your unique keys. It looks like this:"

**[DISPLAY ON SCREEN — example only]**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-notebook.firebaseapp.com",
  ...
};
```

> "**Copy this entire block of code.** All of it — from the first curly brace to the last."

> "Paste it somewhere safe — a Notes app, a Word document, anywhere. Do not share it in a chat message."

> "Click **Continue to console**."

> "Pause here. Raise your hand if you could not find or copy the config block."

*(Help anyone who is stuck)*

> "Now — before we move on, I want to address something. You may have noticed that this config block has something called an **API key** in it. And you might be thinking: we are going to put this on a public GitHub page. Is that safe?"

> "The answer is yes — and here is why."

> "A Firebase API key is not like a bank PIN. It does not give anyone access to your data. It simply tells Firebase: 'Hey, I am connecting to *this* project.' Like a public office address — anyone can know it, but that does not mean they can walk into your files."

> "The actual protection is those security rules we set up a few minutes ago. Those rules say: only a signed-in user can see their own cards. Even if someone copied your API key and tried to read your notes, Firebase would block them completely."

> "So do not worry about it. This is by design. Every Firebase web app in the world works this way."

> "If you want extra peace of mind after today, there is one optional step: you can go into Google Cloud Console and restrict the API key so it only works from your GitHub Pages URL. Your tutorial document has the exact steps. But it is not required for the app to work safely."

*(Pause — check if anyone has questions before moving on)*

## PHASE 4 — Connect Firebase and Deploy (30 minutes)

---

### Step 4.1 — Send the Second Prompt to Add Firebase

> "Now that we have tested the app locally and seen it working, we are going to upgrade it. We will add cloud storage using Firebase — so your notes are saved on the internet, not just on your laptop."

> "Go back to Antigravity. We will send a **second prompt** in the **same conversation**. This tells the AI to upgrade the app it already built."

> "Here is the second prompt. Copy and paste it:"

**[DISPLAY ON SCREEN:]**
> *"Great — the app looks good. Now please upgrade it to use Firebase for cloud storage and Google Sign-In for login. Each user's notes should be private and automatically synced across all their devices. Keep the same design and features — just add the Firebase and Google Sign-In functionality on top."*

> "Send it."

> "The AI will now rewrite your app to include Firebase. This takes about 30 to 60 seconds. Wait for it to finish."

---

### Step 4.2 — Paste Your Firebase Config

> "Antigravity has updated your `index.html` file. But there is one thing we need to do manually — paste in the Firebase keys that are unique to your project."

> "Find your `index.html` file. Right-click it. Choose **Open With**. Choose **TextEdit**."

> "On your keyboard, press **Command + F**. This opens a search box. Type: `YOUR_API_KEY`."

> "You will see a block of placeholder text. This is where your real Firebase config needs to go."

> "Select the entire placeholder block. Delete it. Paste in the real config you copied in Step 3.5."

> "Press **Command + S** to save the file."

> "Close TextEdit."

---

### Step 4.3 — Push to GitHub

> "Now we send your file to GitHub. This is where you use those Terminal commands."

> "Open Terminal. Navigate to your project folder using the cd command — same as before."

> "I will give you the commands one by one. Type each one and press Enter. Wait for it to finish before typing the next one."

> "**Command 1:** Initialize a Git repository in your folder:"
> `git init`

> "**Command 2:** Tell Git to include your HTML file:"
> `git add index.html`

> "**Command 3:** Save a snapshot. This is called a commit:"
> `git commit -m "Initial flashcard app with Firebase"`

> "**Command 4:** Connect your folder to GitHub. Replace YOUR-USERNAME with your actual GitHub username:"
> `git remote add origin https://github.com/YOUR-USERNAME/flashcards.git`

> "**Command 5 and 6:** Send the file to GitHub:"
> `git branch -M main`
> `git push -u origin main`

> "After you press Enter on the last command, Terminal will ask for your GitHub username and password."

> "**Important** — do not enter your GitHub password here. GitHub no longer accepts passwords. Instead, you need something called a **Personal Access Token**."

> "Here is how to create a token — I will do this together with you:"

> "Go to GitHub in Chrome. Click your **profile picture** at the top-right. Click **Settings**."

> "Scroll all the way to the bottom of the left sidebar. Click **Developer settings**."

> "Click **Personal access tokens**. Click **Tokens (classic)**. Click **Generate new token (classic)**."

> "Set the expiration to **90 days**. Under 'Select scopes', tick the box next to **repo**."

> "Scroll down and click **Generate token**."

> "A green token appears — a long string of letters and numbers. **Copy it now.** You will not see it again."

> "Go back to Terminal. When it asks for Password, paste your token. Note: you will not see the characters appear — that is normal for security reasons. Press Enter."

> "If you see a message like 'Branch main set up to track origin main' — it worked!"

---

### Step 4.4 — Enable GitHub Pages

> "Your code is now on GitHub. Let's turn it into a live website."

> "Go to your GitHub repository in Chrome: **github.com/YOUR-USERNAME/flashcards**."

> "Click the **Settings** tab at the top."

> "In the left sidebar, click **Pages**."

> "Under 'Branch', click the dropdown that says 'None'. Select **main**. Click **Save**."

> "Wait about one minute. Then refresh the page."

> "You should see a green box that says: **Your site is live at https://YOUR-USERNAME.github.io/flashcards/**"

> "**That is your public URL. That is your app on the internet.**"

> "Write it down. 🎉"

---

### Step 4.5 — Add Your Domain to Firebase

> "One last step before sign-in will work. Firebase needs to know that your GitHub Pages URL is trusted."

> "Go back to **Firebase Console**. Click **Build → Authentication**. Click the **Settings** tab."

> "Scroll down to **Authorized domains**. Click **Add domain**."

> "Type your GitHub Pages domain — just the domain, nothing else:"
> `YOUR-USERNAME.github.io`

> "Click **Add**."

> "That is it. Firebase will now allow sign-in from your live URL."

---
---

## PHASE 5 — Test Your Live App (15 minutes)

---

### Step 5.1 — Open Your Live URL

> "Open a new tab in Chrome. Type your URL:"
> `https://YOUR-USERNAME.github.io/flashcards/index.html`

> "You should see the notebook app with a green background and a 'Sign in with Google' button."

> "If you still see the yellow warning banner — the Firebase config was not saved correctly. Check Step 4.2. Raise your hand if you see the banner."

---

### Step 5.2 — Sign In and Add a Card

> "Click **Sign in with Google**. A popup will open. Select your Google account."

> "You are now signed in. Your name or photo may appear in the top-right corner."

> "Click **New Card**. Add a note from today's session:"
> - "Title: something you learned today"
> - "Category: General"
> - "Note: write something you want to remember"

> "Click **Save Card**."

> "Your card is now in the cloud. It is saved in Firebase under your Google account. No one else can see it."

---

### Step 5.3 — Test on Another Device

> "Open this URL on your phone. Sign in with the same Google account."

> "Do you see the card you just added?"

> "That is the cloud sync working. Same notes. Any device. Anywhere."

---

### Step 5.4 — Look at Your Data in Firebase

> "Let's visit Firebase one more time to see your data."

> "Go to **Firebase Console → Firestore Database**."

> "Click on the first collection called **users**. Then click on your unique ID. Then click on **cards**."

> "You will see your flashcard as a document. Click on it to see all the fields — title, note, category, date."

> "This is your data. It lives on Google's servers. Firebase keeps it safe."

---
---

## CLOSING — Extend Your App

---

> "You have done it. You built and deployed a real web app today using AI."

> "Before we finish, I want to show you that this is just the beginning. You can extend this app yourself."

> "You can **change the categories**. If you are in finance, change 'Coding' to 'Finance', 'Research' to 'Strategy'. Open the file in TextEdit, find the `CATEGORY_META` section, and change the words."

> "You can **change the colour**. Find `--accent-desk` in the CSS and change the colour code. Use any hex colour you like."

> "And you can **ask Antigravity to add more features**. Go back and say things like:"
> - *"Add a favourites feature"*
> - *"Add dark mode"*
> - *"Let me export my cards as a PDF"*

> "The AI will understand you. It will update the code. You push to GitHub. Done."

> "This is the new way to build tools — describe what you want in plain English, let AI write it, deploy it in minutes."

> "**Your app URL is your takeaway from today.** Share it. Use it. Build on it."

> "Thank you. Any questions?"

---

*End of talking script.*  
*Total session: ~2.5 hours with pauses and Q&A.*
