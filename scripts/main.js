/* ==========================================================================
   MAIN — Init, event listeners. Runs after all other scripts are loaded.
   ========================================================================== */

const gearSVG    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" fill="currentColor"><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`;
const chevronSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="settings-chevron"><polyline points="6 9 12 15 18 9"/></svg>`;

const input          = document.getElementById('taskInput');
const taskList       = document.getElementById('taskList');
const container      = document.getElementById('container');
const sidebar        = document.getElementById('sidebar');
const sidebarToggle  = document.getElementById('sidebarToggle');
const settingsToggle = document.getElementById('settingsToggle');
const settingsSection = document.getElementById('settingsSection');

// --- Boot ---
async function init() {
  document.body.classList.add('no-transition');

  const result = await storageGet([
    'tasks', 'todayDate', 'theme',
    'completedTasks', 'history',
    'bgColor', 'soundEnabled'
  ]);

  const saved     = result.tasks || [];
  const savedDate = result.todayDate || null;
  const today     = getToday();

  if (savedDate && savedDate !== today) {
    await archiveTasks(savedDate);
  } else if (saved.length > 0) {
    container.classList.add('has-tasks');
    saved.forEach(t => createTask(t.text, t.done, t.id));
  }

  // Set static button icons
  sidebarToggle.innerHTML  = gearSVG;
  settingsToggle.innerHTML = `<span>Settings</span>${chevronSVG}`;

  // Init settings modules
  initTheme(result.theme);
  initBgColor(result.bgColor);
  initSound(result.soundEnabled);

  requestAnimationFrame(() => {
    document.body.classList.remove('no-transition');
  });

  input.focus();
  startClock();
}

// --- Add task on Enter ---
input.addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter' || input.value.trim() === '') return;

  const text = input.value.trim();
  input.value = '';

  if (taskList.children.length === 0) {
    container.classList.add('has-tasks');
    await storageSet({ todayDate: getToday() });
  }

  createTask(text, false, null);

  const result = await storageGet(['totalAdded']);
  await storageSet({ totalAdded: (result.totalAdded || 0) + 1 });

  saveTasks();
  input.focus();
});

// --- Sidebar ---
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  if (sidebar.classList.contains('open')) renderHistory();
});

document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// --- Settings accordion ---
settingsToggle.addEventListener('click', () => {
  settingsSection.classList.toggle('open');
});

function startClock() {
  const clock = document.getElementById('clock');
  function tick() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
  tick();
  setInterval(tick, 1000);
}

// --- Day rollover check ---
const rolloverInterval = setInterval(async () => {
  const result = await storageGet(['todayDate']);
  if (result.todayDate && result.todayDate !== getToday()) {
    clearInterval(rolloverInterval);
    await archiveTasks(result.todayDate);
    location.reload();
  }
}, 60000);

init();
