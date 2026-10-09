/* ==========================================================
   app.js — Personal Dashboard
   Features : Greeting, Focus Timer, To-Do List, Quick Links
   Challenges: 1) Light/Dark Mode  2) Custom Name  3) Change Pomodoro
               4) Prevent Duplicates  5) Sort Tasks
   ========================================================== */
'use strict';

/* ── helpers ── */
const KEYS = {
  THEME:    'db_theme',
  NAME:     'db_name',
  TODOS:    'db_todos',
  LINKS:    'db_links',
  DURATION: 'db_duration',
};

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, fb = null) => {
  try { const r = localStorage.getItem(k); return r !== null ? JSON.parse(r) : fb; }
  catch { return fb; }
};
const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const esc  = s => s
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

/* ════════════════════════════════════════════════
   1. GREETING / CLOCK / DATE
   ════════════════════════════════════════════════ */
const clockEl     = document.getElementById('clock');
const dateEl      = document.getElementById('date-display');
const greetingEl  = document.getElementById('greeting');
const editNameBtn = document.getElementById('edit-name-btn');
const nameEditor  = document.getElementById('name-editor');
const nameInput   = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');
const cancelName  = document.getElementById('cancel-name-btn');

function getGreeting(h) {
  if (h >= 5  && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  if (h >= 17 && h < 21) return 'Good Evening';
  return 'Good Night';
}

function tick() {
  const now  = new Date();
  const h    = now.getHours();
  const name = load(KEYS.NAME, '');

  // Clock  HH:MM:SS
  clockEl.textContent = now.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  // Date  e.g. "Tuesday, January 27, 2026"
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Greeting
  const base = getGreeting(h);
  greetingEl.textContent = name ? `${base}, ${name}!` : base;
}

tick();
setInterval(tick, 1000);

// ── Name editor (Challenge 2) ──
editNameBtn.addEventListener('click', () => {
  nameInput.value = load(KEYS.NAME, '');
  nameEditor.classList.remove('hidden');
  nameInput.focus();
});

function doSaveName() {
  save(KEYS.NAME, nameInput.value.trim());
  nameEditor.classList.add('hidden');
  tick();
}

saveNameBtn.addEventListener('click', doSaveName);
nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter')  doSaveName();
  if (e.key === 'Escape') nameEditor.classList.add('hidden');
});
cancelName.addEventListener('click', () => nameEditor.classList.add('hidden'));

/* ════════════════════════════════════════════════
   2. LIGHT / DARK MODE  (Challenge 1)
   ════════════════════════════════════════════════ */
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  themeBtn.title       = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

(function initTheme() {
  const saved = load(KEYS.THEME);
  applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
})();

themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  save(KEYS.THEME, next);
});

/* ════════════════════════════════════════════════
   3. FOCUS TIMER  (Challenge 3 — custom duration)
   ════════════════════════════════════════════════ */
const timerDisplay = document.getElementById('timer-display');
const timerStart   = document.getElementById('timer-start');
const timerStop    = document.getElementById('timer-stop');
const timerReset   = document.getElementById('timer-reset');
const durSelect    = document.getElementById('pomodoro-duration');

let timerIv  = null;
let timerSec = 0;
let running  = false;

const fmt = t => `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
const getDur = () => parseInt(durSelect.value, 10) * 60;

// Init from saved duration
(function initTimer() {
  const saved = load(KEYS.DURATION, 25);
  durSelect.value  = saved;
  timerSec         = saved * 60;
  timerDisplay.textContent = fmt(timerSec);
})();

function setRunning(state) {
  running = state;
  timerStart.disabled   = state;
  timerStop.disabled    = !state;
  durSelect.disabled    = state;
  timerDisplay.classList.toggle('running', state);
  timerDisplay.classList.remove('finished');
}

timerStart.addEventListener('click', () => {
  if (running) return;
  if (timerSec <= 0) timerSec = getDur();
  setRunning(true);
  timerIv = setInterval(() => {
    timerSec--;
    timerDisplay.textContent = fmt(timerSec);
    if (timerSec <= 0) {
      clearInterval(timerIv); timerIv = null;
      setRunning(false);
      timerDisplay.classList.add('finished');
      timerDisplay.textContent = '00:00';
      if (Notification.permission === 'granted') {
        new Notification('🍅 Focus session complete!', { body: 'Time for a break!' });
      } else {
        alert('🍅 Focus session complete! Time for a break!');
      }
    }
  }, 1000);
});

timerStop.addEventListener('click', () => {
  clearInterval(timerIv); timerIv = null;
  setRunning(false);
});

timerReset.addEventListener('click', () => {
  clearInterval(timerIv); timerIv = null;
  setRunning(false);
  timerSec = getDur();
  timerDisplay.textContent = fmt(timerSec);
  timerDisplay.classList.remove('finished');
});

durSelect.addEventListener('change', () => {
  save(KEYS.DURATION, parseInt(durSelect.value, 10));
  if (!running) {
    timerSec = getDur();
    timerDisplay.textContent = fmt(timerSec);
    timerDisplay.classList.remove('finished');
  }
});

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

/* ════════════════════════════════════════════════
   4. TO-DO LIST  (Challenges 4 & 5)
   ════════════════════════════════════════════════ */
const taskInput   = document.getElementById('task-input');
const addTaskBtn  = document.getElementById('add-task-btn');
const taskListEl  = document.getElementById('task-list');
const taskEmptyEl = document.getElementById('task-empty');
const sortSel     = document.getElementById('sort-select');

let todos = load(KEYS.TODOS, []);
const saveTodos = () => save(KEYS.TODOS, todos);

function sorted() {
  const cp = [...todos];
  const m  = sortSel.value;
  if (m === 'az')   return cp.sort((a,b) => a.text.localeCompare(b.text));
  if (m === 'za')   return cp.sort((a,b) => b.text.localeCompare(a.text));
  if (m === 'done') return cp.sort((a,b) => Number(a.done) - Number(b.done));
  return cp;
}

function renderTodos() {
  taskListEl.innerHTML = '';
  const list = sorted();
  taskEmptyEl.classList.toggle('hidden', list.length > 0);

  list.forEach(todo => {
    const li = document.createElement('li');
    li.className = `task-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${todo.done ? 'checked' : ''}
             aria-label="Mark done" />
      <span class="task-text">${esc(todo.text)}</span>
      <div class="task-actions">
        <button class="btn--edit"   title="Edit"   aria-label="Edit task">✏️</button>
        <button class="btn btn--delete" title="Delete" aria-label="Delete task">Delete</button>
      </div>
    `;

    li.querySelector('.task-checkbox').addEventListener('change', e => {
      const t = todos.find(t => t.id === todo.id);
      if (t) { t.done = e.target.checked; saveTodos(); renderTodos(); }
    });

    li.querySelector('.btn--edit').addEventListener('click', () => startEdit(li, todo));

    li.querySelector('.btn--delete').addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos(); renderTodos();
    });

    taskListEl.appendChild(li);
  });
}

function startEdit(li, todo) {
  const span    = li.querySelector('.task-text');
  const actions = li.querySelector('.task-actions');

  const inp = document.createElement('input');
  inp.type      = 'text';
  inp.value     = todo.text;
  inp.className = 'task-edit-input';
  inp.maxLength = 120;
  span.replaceWith(inp);
  inp.focus(); inp.select();

  const ok  = document.createElement('button');
  ok.className  = 'btn btn--blue'; ok.style.padding = '4px 10px'; ok.textContent = '✔';
  const can = document.createElement('button');
  can.className = 'btn btn--grey'; can.style.padding = '4px 10px'; can.textContent = '✖';
  actions.innerHTML = '';
  actions.append(ok, can);

  function commit() {
    const val = inp.value.trim();
    if (!val) { renderTodos(); return; }
    // Challenge 4 — prevent duplicate
    if (todos.some(t => t.text.toLowerCase() === val.toLowerCase() && t.id !== todo.id)) {
      inp.style.borderColor = 'var(--danger)';
      inp.title = 'Task already exists!';
      inp.focus(); return;
    }
    const t = todos.find(t => t.id === todo.id);
    if (t) { t.text = val; saveTodos(); }
    renderTodos();
  }

  ok.addEventListener('click', commit);
  can.addEventListener('click', renderTodos);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter')  commit();
    if (e.key === 'Escape') renderTodos();
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  // Challenge 4 — prevent duplicate
  if (todos.some(t => t.text.toLowerCase() === text.toLowerCase())) {
    taskInput.style.borderColor = 'var(--danger)';
    taskInput.title = 'Task already exists!';
    taskInput.focus();
    setTimeout(() => { taskInput.style.borderColor = ''; taskInput.title = ''; }, 2000);
    return;
  }
  todos.push({ id: uid(), text, done: false });
  saveTodos(); renderTodos();
  taskInput.value = ''; taskInput.style.borderColor = '';
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
sortSel.addEventListener('change', renderTodos);

renderTodos();

/* ════════════════════════════════════════════════
   5. QUICK LINKS
   ════════════════════════════════════════════════ */
const linkNameEl  = document.getElementById('link-name');
const linkUrlEl   = document.getElementById('link-url');
const addLinkBtn  = document.getElementById('add-link-btn');
const linksGrid   = document.getElementById('links-grid');
const linksEmpty  = document.getElementById('links-empty');

let links = load(KEYS.LINKS, []);
const saveLinks = () => save(KEYS.LINKS, links);

function faviconUrl(url) {
  try { return `https://www.google.com/s2/favicons?sz=32&domain_url=${new URL(url).origin}`; }
  catch { return null; }
}

function renderLinks() {
  linksGrid.innerHTML = '';
  linksEmpty.classList.toggle('hidden', links.length > 0);

  links.forEach(link => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const fav = faviconUrl(link.url);
    chip.innerHTML = `
      ${fav ? `<img src="${fav}" class="link-favicon" alt="" onerror="this.style.display='none'" />` : ''}
      <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer"
         aria-label="Open ${esc(link.name)}">${esc(link.name)}</a>
      <button class="link-remove" title="Remove" aria-label="Remove ${esc(link.name)}">✕</button>
    `;

    chip.querySelector('.link-remove').addEventListener('click', e => {
      e.stopPropagation();
      links = links.filter(l => l.id !== link.id);
      saveLinks(); renderLinks();
    });

    linksGrid.appendChild(chip);
  });
}

addLinkBtn.addEventListener('click', () => {
  const name = linkNameEl.value.trim();
  let   url  = linkUrlEl.value.trim();
  if (!name || !url) return;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try { new URL(url); } catch {
    linkUrlEl.style.borderColor = 'var(--danger)';
    setTimeout(() => { linkUrlEl.style.borderColor = ''; }, 2000);
    return;
  }
  links.push({ id: uid(), name, url });
  saveLinks(); renderLinks();
  linkNameEl.value = ''; linkUrlEl.value = '';
  linkNameEl.focus();
});

linkUrlEl.addEventListener('keydown', e => { if (e.key === 'Enter') addLinkBtn.click(); });

renderLinks();
