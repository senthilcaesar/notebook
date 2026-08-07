# My Notebook Flashcards — AGENTS.md

Canonical project doc. `CLAUDE.md` points here so the two cannot drift apart
again.

## Overview

A **React 19 + Vite 8** single-page app that stores personal notes as
notebook-style flashcards, synced to **Firebase Firestore** with **Google
Sign-In**. Deployed to GitHub Pages at
<https://senthilcaesar.github.io/notebook/>.

---

## Layout

```
index.html                 Vite entry
vite.config.js             base: '/notebook/' — required for Pages
src/
├── main.jsx               Root: MotionConfig → ErrorBoundary → App
├── App.jsx                State, filtering, card CRUD handlers
├── components/
│   ├── Header.jsx         Brand, search, sync dot, theme, account
│   ├── Sidebar.jsx        Tag filter list with counts
│   ├── Flashcard.jsx      The card (see "Card design")
│   ├── CardModal.jsx      Create / edit form
│   ├── DeleteConfirmModal.jsx
│   ├── TechStackModal.jsx
│   ├── ToastRegion.jsx
│   └── ErrorBoundary.jsx  Class component — no hook equivalent exists
├── hooks/
│   ├── useAuth.js         Google sign-in, auth state
│   ├── useCards.js        Firestore subscription + mutations
│   ├── useModalA11y.js    Escape, focus trap, focus restore, scroll lock
│   └── useLocalStorageState.js
├── lib/
│   ├── firebase.js        SDK init (config is public by design — see Security)
│   ├── cards.js           Normalise, payload, markdown parse, toSafeHref
│   ├── tags.js            Tag → colour slot, rail date
│   ├── constants.js       Priority + colour options
│   └── techStack.js
└── styles/
    ├── tokens.css         Fonts, radii, spacing, shadows
    ├── theme.css          Light/dark colour tokens + 8 tag slots
    ├── base.css           Reset, body, reduced-motion
    ├── app.css            Shell, header, sidebar, modals
    └── card.css           Flashcard only
```

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173/notebook/
npm run lint
npm run build
```

> [!IMPORTANT]
> `firebase` is pinned to an exact version, not a range. 12.11.0 shipped ESM
> entrypoints importing chunks absent from the tarball, which broke the build
> and every deploy for three months. Do not loosen the pin without building
> first.

Requires Node >= 20.19 (Vite 8).

---

## Data model

```
/users/{uid}/cards/{cardId}
  title       string
  note        string          markdown subset: # ## - * **bold** `code` [text](url)
  attachments string[]        one URL per line in the form
  tags        string[]        free-form; first tag drives the card's rail colour
  category    string          legacy mirror of tags[0], lowercased
  date        "YYYY-MM-DD"
  priority    none|low|medium|high|critical
  pinned      boolean
  color       cream|yellow|pink|blue|green|lavender
  createdAt   serverTimestamp
  updatedAt   serverTimestamp
```

`normalizeCard()` backfills `tags` from the legacy `category` field, so cards
written before tags existed still load.

---

## Card design

The card is a **margin sheet**. It deliberately carries _one_ notebook device,
not several: the margin rail holds the date and takes its colour from the first
tag. An earlier version stacked ruled lines, spiral holes, a red margin rule, a
paper tint, four always-visible buttons and two solid badges, and the note
itself ended up the quietest thing on it.

If you add to the card, take something away.

- Actions live on the footer row. They were tried in the top-right corner and
  clipped long titles on hover.
- The grid is `repeat(auto-fill, minmax(min(100%, 17.5rem), 1fr))` and derives
  columns from the board width. It has **no breakpoints** — do not add any.
  `auto-fill` not `auto-fit`, or a lone card stretches across the board.
- Tags are free-form, so colours come from `getTagColorIndex()` hashing onto
  eight themed slots. Named tags have fixed slots; a tag must never change
  colour between sessions.

---

## Conventions

- `Flashcard` is memoised. Anything passed to it must be `useCallback`-stable —
  `useCards`' mutators and `App`'s handlers already are. Breaking this silently
  re-renders and re-parses every visible card on each search keystroke.
- Every modal uses `useModalA11y`. New modals need `role="dialog"` (or
  `alertdialog`), `aria-modal`, `aria-labelledby`, and a ref on the panel.
- Never render a user-supplied URL directly into `href`. Use `toSafeHref()`.
- Card styles go in `card.css`, everything else in `app.css`.
- Colours come from tokens in `theme.css` so dark mode works for free. Avoid
  hardcoded `rgba()` in component styles.

---

## Security

The `firebaseConfig` in `src/lib/firebase.js` is **public by design** — every
Firebase web app ships its config to the browser. Access control comes from
Firestore rules, not from hiding the key:

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

## CI

- `.github/workflows/ci.yml` — lint + build on every PR and push to `main`.
- `.github/workflows/deploy.yml` — builds and publishes to Pages on push to
  `main`. The Pages deploy step occasionally times out waiting on GitHub's
  queue; re-running the failed job with the same artifact is the fix.

---

## Keyboard

| Shortcut               | Action                       |
| ---------------------- | ---------------------------- |
| `Ctrl`/`Cmd` + `Enter` | Save card (modal open)       |
| `Escape`               | Close any modal              |
| `Tab`                  | Trapped inside an open modal |
