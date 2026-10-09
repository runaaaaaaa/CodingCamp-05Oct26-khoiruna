# Requirements — To-Do List Life Dashboard

## Project Overview
A personal productivity dashboard that runs entirely in the browser.
No backend, no build tools, no frameworks — just HTML, CSS, and Vanilla JavaScript
with data persisted in the browser's Local Storage.

---

## Functional Requirements

### FR-1 · Greeting & Clock
- Display a live digital clock (HH:MM:SS), updated every second.
- Display the current date in a human-readable format (e.g. "Thursday, October 8, 2026").
- Show a time-based greeting: Good Morning / Good Afternoon / Good Evening / Good Night.
- Allow the user to set a custom name that appears in the greeting (e.g. "Good Morning, Runa!").
- The custom name must be saved to Local Storage and persist across page reloads.

### FR-2 · Focus Timer (Pomodoro)
- Default session length: 25 minutes.
- Controls: Start, Stop, Reset.
- User can change the session duration via a dropdown (15 / 20 / 25 / 30 / 45 / 60 minutes).
- The chosen duration is saved to Local Storage.
- The timer counts down and fires a browser notification (or alert fallback) when it reaches 00:00.
- The timer display changes color while running (green) and when finished (red/pink).

### FR-3 · To-Do List
- Add a new task via text input + Add button (also triggers on Enter key).
- Mark a task as done by checking its checkbox; done tasks show a strikethrough.
- Edit an existing task inline (pencil icon → inline input → save / cancel).
- Delete a task (Delete button per row).
- All tasks are saved to Local Storage.
- **Challenge: Prevent duplicates** — adding or editing a task to an already-existing name is blocked with a visual red-border warning.
- **Challenge: Sort tasks** — dropdown to order the list by Default / A→Z / Z→A / Done last.

### FR-4 · Quick Links
- Add a named URL shortcut (label + URL → Add Link button).
- Saved links render as clickable chips that open in a new tab.
- Each chip shows the site's favicon (via Google S2 API).
- Remove a link via the ✕ button on each chip.
- All links are saved to Local Storage.

---

## Challenge Features (3 of 5 chosen, 4 implemented)

| # | Challenge | Status |
|---|-----------|--------|
| 1 | Light / Dark mode toggle | ✅ Implemented |
| 2 | Custom name in greeting | ✅ Implemented |
| 3 | Change Pomodoro duration | ✅ Implemented |
| 4 | Prevent duplicate tasks | ✅ Implemented |
| 5 | Sort tasks | ✅ Implemented |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | **Technology** — HTML5, CSS3, Vanilla JS (ES6+). No frameworks or build steps. |
| NFR-2 | **Storage** — Browser Local Storage only. No server or database. |
| NFR-3 | **Compatibility** — Works in modern browsers: Chrome, Firefox, Edge, Safari. |
| NFR-4 | **Responsive** — Fully usable on desktop (≥ 861px), tablet (641–860px), and mobile (≤ 640px). |
| NFR-5 | **Performance** — No noticeable lag; clock and timer tick smoothly at 1-second intervals. |
| NFR-6 | **Simplicity** — Clean, minimal UI. No setup or login required. |
| NFR-7 | **Accessibility** — All interactive elements have `aria-label` or visible labels. |

---

## Constraints
- Only **1 CSS file** inside `css/`.
- Only **1 JavaScript file** inside `js/`.
- No backend server required.
- Deployable as a static site (e.g. GitHub Pages).
