const input = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const container = document.getElementById('container');
const themeToggle = document.getElementById('themeToggle');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('historyList');
const settingsToggle = document.getElementById('settingsToggle');
const settingsSection = document.getElementById('settingsSection');
const bgColorPicker = document.getElementById('bgColorPicker');
const soundToggle = document.getElementById('soundToggle');

const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
const trashSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 640 640" fill="currentColor"><path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/></svg>`;
const gearSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" fill="currentColor"><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`;
const chevronSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="settings-chevron"><polyline points="6 9 12 15 18 9"/></svg>`;

let soundEnabled = true;

function applyBgColor(color) {
  document.body.style.backgroundColor = color;
  document.body.style.backgroundImage = `radial-gradient(#c4c4c4 1px, transparent 1px)`;
  document.body.style.backgroundSize = '40px 40px';
}

function getToday() {
  return new Date().toLocaleDateString('sv');
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(task => {
    tasks.push({
      text: task.querySelector('label').textContent,
      done: task.classList.contains('done')
    });
  });
  chrome.storage.local.set({ tasks });
}

function saveCompletedTasks(completedTasks) {
  chrome.storage.local.set({ completedTasks });
}

function archiveTasks(date) {
  chrome.storage.local.get(['completedTasks', 'tasks', 'history'], (result) => {
    const history = result.history || [];
    const completed = result.completedTasks || [];
    const activeTasks = result.tasks || [];
    const incomplete = activeTasks.filter(t => !t.done);

    const allTasks = [
      ...completed.map(t => ({ text: t, done: true })),
      ...incomplete.map(t => ({ text: t.text, done: false }))
    ];

    const total = allTasks.length;
    const completedCount = completed.length;

    if (total > 0) {
      history.push({
        date,
        total,
        completed: completedCount,
        percentage: Math.round((completedCount / total) * 100),
        tasks: allTasks
      });
    }

    chrome.storage.local.set({
      history,
      tasks: [],
      todayDate: null,
      completedTasks: []
    });
  });
}

function renderHistory() {
  chrome.storage.local.get(['history'], (result) => {
    const history = result.history || [];
    historyList.innerHTML = '';

    if (history.length === 0) {
      historyList.innerHTML = '<p class="no-history">No history yet</p>';
      return;
    }

    [...history].reverse().forEach(entry => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const header = document.createElement('div');
      header.className = 'history-header';

      const date = document.createElement('span');
      date.className = 'history-date';
      const d = new Date(entry.date + 'T00:00:00');
      date.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const pct = document.createElement('span');
      pct.className = 'history-pct' + (entry.percentage === 100 ? ' perfect' : '');
      pct.textContent = entry.percentage + '%';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'history-delete-btn';
      deleteBtn.innerHTML = trashSVG;

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.storage.local.get(['history'], (result) => {
          const updated = (result.history || []).filter(h => h.date !== entry.date);
          chrome.storage.local.set({ history: updated }, () => renderHistory());
        });
      });

      header.appendChild(date);
      header.appendChild(pct);
      header.appendChild(deleteBtn);
      item.appendChild(header);

      const taskMenu = document.createElement('div');
      taskMenu.className = 'history-tasks hidden';

      entry.tasks.forEach(t => {
        const row = document.createElement('div');
        row.className = 'history-task-row' + (t.done ? ' done' : '');
        row.textContent = (t.done ? '✓ ' : '✗ ') + t.text;
        taskMenu.appendChild(row);
      });

      item.appendChild(taskMenu);

      header.addEventListener('click', () => {
        taskMenu.classList.toggle('hidden');
        item.classList.toggle('open');
      });

      historyList.appendChild(item);
    });
  });
}

function createTask(text, done = false) {
  const task = document.createElement('div');
  task.className = 'task' + (done ? ' done' : '');

  const id = 'task-' + Date.now() + Math.random();

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.id = id;
  cb.checked = done;

  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = trashSVG;

  deleteBtn.addEventListener('click', () => {
    const wasCompleted = task.classList.contains('done');

    if (!wasCompleted) {
      chrome.storage.local.get(['totalAdded'], (result) => {
        const current = result.totalAdded || 0;
        chrome.storage.local.set({ totalAdded: Math.max(0, current - 1) });
      });
    }

    task.style.opacity = '0';
    task.style.transform = 'translateX(20px)';
    task.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(() => {
      task.remove();
      if (taskList.children.length === 0) {
        container.classList.remove('has-tasks');
      }
      saveTasks();
    }, 200);
  });

  cb.addEventListener('change', () => {
    const isNowDone = cb.checked;
    task.classList.toggle('done', isNowDone);

    if (isNowDone) {
      if (soundEnabled) {
        const tick = new Audio(chrome.runtime.getURL('assets/tick.wav'));
        tick.volume = 0.3;
        tick.play();
      }
      taskList.appendChild(task);
    } else {
      taskList.insertBefore(task, taskList.firstChild);
    }

    chrome.storage.local.get(['completedTasks'], (result) => {
      const completedTasks = result.completedTasks || [];
      if (isNowDone) {
        completedTasks.push(text);
        saveCompletedTasks(completedTasks);
      } else {
        const idx = completedTasks.lastIndexOf(text);
        if (idx !== -1) completedTasks.splice(idx, 1);
        saveCompletedTasks(completedTasks);
      }
    });

    saveTasks();
  });

  label.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const renameInput = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = label.textContent;
    renameInput.className = 'rename-input';
    task.replaceChild(renameInput, label);
    renameInput.focus();
    renameInput.select();

    let confirmed = false;

    function confirm() {
      if (confirmed) return;
      confirmed = true;
      if (renameInput.value.trim() !== '') {
        label.textContent = renameInput.value.trim();
      }
      task.replaceChild(label, renameInput);
      saveTasks();
    }

    renameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirm();
      if (e.key === 'Escape') task.replaceChild(label, renameInput);
    });

    renameInput.addEventListener('blur', confirm);
  });

  task.appendChild(cb);
  task.appendChild(label);
  task.appendChild(deleteBtn);
  taskList.insertBefore(task, taskList.firstChild);
}

// Load everything on page open
document.body.classList.add('no-transition');

chrome.storage.local.get(['tasks', 'todayDate', 'theme', 'completedTasks', 'history', 'bgColor', 'soundEnabled'], (result) => {
  const saved = result.tasks || [];
  const savedDate = result.todayDate || null;
  const today = getToday();

  if (savedDate && savedDate !== today) {
    archiveTasks(savedDate);
  } else if (saved.length > 0) {
    container.classList.add('has-tasks');
    saved.forEach(t => createTask(t.text, t.done));
  }

  sidebarToggle.innerHTML = gearSVG;
  settingsToggle.innerHTML = `<span>Settings</span>${chevronSVG}`;

  if (result.theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = moonSVG;
  } else {
    themeToggle.innerHTML = sunSVG;
  }

  if (result.bgColor) {
    bgColorPicker.value = result.bgColor;
    applyBgColor(result.bgColor);
  }

  if (result.soundEnabled !== undefined) {
    soundEnabled = result.soundEnabled;
    soundToggle.checked = soundEnabled;
  }

  requestAnimationFrame(() => {
    document.body.classList.remove('no-transition');
  });

  input.focus();
});

// Add task on enter
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const text = input.value.trim();
    input.value = '';

    if (taskList.children.length === 0) {
      container.classList.add('has-tasks');
      chrome.storage.local.set({ todayDate: getToday() });
    }

    createTask(text, false);
    chrome.storage.local.get(['totalAdded'], (result) => {
      chrome.storage.local.set({ totalAdded: (result.totalAdded || 0) + 1 });
    });
    saveTasks();
    input.focus();
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggle.innerHTML = isDark ? moonSVG : sunSVG;
  chrome.storage.local.set({ theme: isDark ? 'dark' : 'light' });
  document.body.style.backgroundColor = '';
  document.body.style.backgroundImage = '';
});

// Sidebar toggle
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  if (sidebar.classList.contains('open')) {
    renderHistory();
  }
});

// Settings toggle
settingsToggle.addEventListener('click', () => {
  settingsSection.classList.toggle('open');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Background colour picker
bgColorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  chrome.storage.local.set({ bgColor: color });
  applyBgColor(color);
});

soundToggle.addEventListener('change', () => {
  soundEnabled = soundToggle.checked;
  chrome.storage.local.set({ soundEnabled });
});

// Check every minute if day has rolled over
setInterval(() => {
  chrome.storage.local.get(['todayDate'], (result) => {
    if (result.todayDate && result.todayDate !== getToday()) {
      document.querySelectorAll('.task').forEach(task => {
        task.classList.add('expired');
        task.querySelector('input[type="checkbox"]').disabled = true;
      });
    }
  });
}, 60000);