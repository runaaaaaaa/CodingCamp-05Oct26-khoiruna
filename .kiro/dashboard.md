# Dashboard — To-Do List Life Dashboard

A quick-reference card for the project: current status, feature checklist, file map, and deployment steps.

---

## Project Status

| Item | Detail |
|------|--------|
| **Project name** | To-Do List Life Dashboard |
| **Version** | 1.0.0 |
| **Stack** | HTML5 · CSS3 · Vanilla JavaScript (ES6+) |
| **Storage** | Browser Local Storage |
| **Hosting** | GitHub Pages (static) |

---

## Feature Checklist

### MVP Features
- [x] Live clock (HH:MM:SS) updated every second
- [x] Current date displayed below the clock
- [x] Time-based greeting (Morning / Afternoon / Evening / Night)
- [x] Focus Timer with Start / Stop / Reset controls
- [x] Default 25-minute Pomodoro session
- [x] Browser notification on timer completion
- [x] Add tasks via input + button (Enter key supported)
- [x] Mark tasks as done (checkbox + strikethrough)
- [x] Edit tasks inline
- [x] Delete tasks
- [x] Tasks saved in Local Storage
- [x] Add / remove Quick Links saved in Local Storage
- [x] Quick Link chips open in a new tab

### Challenge Features
- [x] **Challenge 1** — Light / Dark mode toggle (respects system preference on first load)
- [x] **Challenge 2** — Custom name in greeting (saved to Local Storage)
- [x] **Challenge 3** — Change Pomodoro duration (15 / 20 / 25 / 30 / 45 / 60 min)
- [x] **Challenge 4** — Prevent duplicate tasks (add & edit both guarded)
- [x] **Challenge 5** — Sort tasks (Default / A→Z / Z→A / Done last)

---

## File Map

```
mini-project/
│
├── index.html              ← Page structure and all section markup
│
├── css/
│   └── style.css           ← Design tokens, layout, components, dark mode, responsive
│
├── js/
│   └── app.js              ← Clock, timer, to-do list, quick links, theme, name editor
│
├── .kiro/
│   ├── requirements.md     ← Functional & non-functional requirements
│   ├── system-design.md    ← Architecture, component breakdown, data flow, schema
│   └── dashboard.md        ← This file — project overview and quick reference
│
└── README.md               ← Public-facing project description
```

---

## Local Storage Keys

| Key | Stores |
|-----|--------|
| `db_theme` | `"light"` or `"dark"` |
| `db_name` | User's display name (string) |
| `db_todos` | Array of `{ id, text, done }` objects |
| `db_links` | Array of `{ id, name, url }` objects |
| `db_duration` | Selected Pomodoro duration in minutes (number) |

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|-----------|-----------|
| > 860px | Desktop — two-column grid for Timer + Tasks |
| 641–860px | Tablet — two columns, tighter padding |
| ≤ 640px | Mobile — single column, larger touch targets |
| ≤ 360px | Small phone — further font size reduction |

---

## Colour Palette

### Light Mode
| Role | Value |
|------|-------|
| Background | `linear-gradient(135deg, #FFDEE9 → #B5FFFC → #85FFFC)` |
| Card | `linear-gradient(145deg, #ffffff → #fdf0ff → #e8f8ff)` |
| Clock / Timer | `#ffb3d9` |
| Primary button | `#d5b3ff` |
| Danger / Delete | `#ef4444` |

### Dark Mode (palette: #2C2C2C · #E4E4E4 · #A8DADC · #FFC1CC · #B39CD0)
| Role | Value |
|------|-------|
| Background | `linear-gradient(135deg, #1a1035 → #2d1b4e → #1a2744)` |
| Card | `linear-gradient(145deg, #2C2C2C → #332840 → #1e2e30)` |
| Main text | `#E4E4E4` |
| Muted text / accents | `#A8DADC` |
| Clock / Timer | `#FFC1CC` |
| Primary button | `#B39CD0` |
| Danger / Delete | `#FFC1CC` |

---

## Deployment — GitHub Pages

1. Push all files to the `main` branch on GitHub.
2. Go to **Settings → Pages**.
3. Under *Source*, select **Deploy from a branch** → `main` → `/ (root)`.
4. Click **Save**. The site will be live at `https://<username>.github.io/<repo-name>/` within a minute.

---

## Known Limitations
- Data is stored per-browser; switching devices or clearing browser storage loses all data.
- The Google Favicon API requires an internet connection to display link icons.
- Browser notifications require the user to grant permission; an `alert()` is used as fallback.
