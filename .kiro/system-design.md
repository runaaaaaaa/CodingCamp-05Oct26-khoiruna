# System Design — To-Do List Life Dashboard

## Architecture Overview

```
mini-project/
├── index.html          ← Single-page app shell; all sections declared here
├── css/
│   └── style.css       ← All styling: layout, themes, components, responsive rules
├── js/
│   └── app.js          ← All logic: clock, timer, todos, links, theme, name
└── .kiro/
    ├── requirements.md
    ├── system-design.md
    └── dashboard.md
```

The entire app is a **single-page static web application**.
There is no routing, no bundler, and no server-side code.

---

## Component Breakdown

### 1. Greeting & Clock (`#clock`, `#date-display`, `#greeting`)
- A `setInterval` at 1000 ms drives both the clock display and the greeting text.
- `new Date()` is called on every tick; no external time API is needed.
- The greeting salutation is derived from `Date.getHours()`.
- The custom name is read from Local Storage on every tick so it stays in sync after edits.

### 2. Name Editor (`#name-editor`, `#name-input`)
- Hidden by default (`display: none`).
- Clicking the ✏️ button reveals the inline editor and focuses the input.
- On Save or Enter key: value is written to `localStorage['db_name']` and the editor hides.
- On Cancel or Escape: the editor hides with no changes.

### 3. Focus Timer (`#timer-display`)
- State variables: `timerSec` (seconds remaining), `running` (boolean), `timerIv` (interval ID).
- **Start** — guards against double-start; calls `setInterval` every 1000 ms decrementing `timerSec`.
- **Stop** — calls `clearInterval`; does not reset `timerSec`.
- **Reset** — calls `clearInterval`; resets `timerSec` to the selected duration.
- Duration dropdown writes to `localStorage['db_duration']` and resets the display when not running.
- On completion: `clearInterval`, visual state → `.finished`, fires `Notification` API or `alert`.

### 4. To-Do List (`#task-list`)
- Data model: `Array<{ id: string, text: string, done: boolean }>` stored in `localStorage['db_todos']`.
- **Add** — validates non-empty, checks for case-insensitive duplicate, pushes new object, re-renders.
- **Toggle done** — finds item by `id`, flips `done`, saves, re-renders.
- **Edit** — replaces the `<span>` and action buttons with an `<input>` + Save/Cancel in-place;
  commits only if non-empty and not a duplicate.
- **Delete** — filters out the item by `id`, saves, re-renders.
- **Sort** — a pure function derives a sorted copy of the array based on the dropdown value;
  the original array order is never mutated (sort is view-only).
- Full re-render (`innerHTML = ''`) on every state change keeps the DOM in sync with the data.

### 5. Quick Links (`#links-grid`)
- Data model: `Array<{ id: string, name: string, url: string }>` stored in `localStorage['db_links']`.
- Auto-prepends `https://` if the user omits the scheme.
- Validates with `new URL()` constructor; shows a red border on failure.
- Favicon loaded via `https://www.google.com/s2/favicons?sz=32&domain_url=<origin>`;
  `onerror` hides the `<img>` if the favicon fails to load.
- Remove button filters out the item and re-renders.

### 6. Light / Dark Mode
- Theme is stored as `'light'` or `'dark'` in `localStorage['db_theme']`.
- On init: reads saved theme, falls back to `window.matchMedia('prefers-color-scheme: dark')`.
- Applied by setting `data-theme` attribute on `<html>`; all colors are CSS custom properties
  scoped to `:root` (light) and `[data-theme="dark"]`, so the entire UI repaints with one attribute change.

---

## Data Flow

```
User Action
    │
    ▼
app.js handler
    │
    ├── update in-memory array / variable
    │
    ├── write to localStorage (save*)
    │
    └── re-render DOM (render*)
```

There is no state management library. Each feature owns its own array/variable and
a pair of `save*` / `render*` functions.

---

## Local Storage Schema

| Key | Type | Description |
|-----|------|-------------|
| `db_theme` | `"light" \| "dark"` | Active colour theme |
| `db_name` | `string` | User's display name |
| `db_todos` | `Array<Todo>` | All to-do items |
| `db_links` | `Array<Link>` | All quick-link shortcuts |
| `db_duration` | `number` | Last selected Pomodoro duration (minutes) |

```ts
// Shapes (TypeScript-style for clarity)
type Todo = { id: string; text: string; done: boolean }
type Link = { id: string; name: string; url: string }
```

IDs are generated with `Date.now().toString(36) + Math.random().toString(36).slice(2,6)`
— collision-safe for a single-user local app.

---

## Styling System

All design tokens live as CSS custom properties in `:root` and `[data-theme="dark"]`:

| Token | Purpose |
|-------|---------|
| `--body-bg` | Full-page gradient background |
| `--card-bg` | Per-card gradient |
| `--clock-color` | Clock and timer digit colour |
| `--blue` / `--blue-h` | Primary button fill / hover |
| `--danger` / `--danger-h` | Delete button and error states |
| `--text` / `--text-muted` | Body copy and secondary copy |
| `--input-bg` / `--input-border` / `--input-focus` | Form field states |

### Responsive Breakpoints

| Range | Layout |
|-------|--------|
| > 860px (desktop) | Two-column grid (Timer + Tasks); greeting and links full-width |
| 641–860px (tablet) | Two-column grid retained; padding and font sizes reduced |
| ≤ 640px (mobile) | Single column; touch targets enlarged; inputs stack vertically |
| ≤ 360px (small mobile) | Clock and timer shrink further; button padding reduced |

---

## Security Notes
- All user-supplied strings are passed through `escapeHtml()` before being injected into `innerHTML`,
  preventing XSS via task text or link names.
- External URLs are validated with `new URL()` and opened with `rel="noopener noreferrer"`.
- No cookies, no third-party scripts, no network requests except the Google favicon API.
