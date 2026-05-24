const input = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const container = document.getElementById('container');
const themeToggle = document.getElementById('themeToggle');
const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(task => {
    tasks.push({
      text: task.querySelector('label').textContent,
      done: task.classList.contains('done')
    });
  });
  chrome.storage.sync.set({ tasks });
}

function archiveTasks(tasks, date) {
  chrome.storage.sync.get(['history'], (result) => {
    const history = result.history || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    if (total > 0) {
      history.push({
        date,
        total,
        completed,
        percentage: Math.round((completed / total) * 100),
        tasks
      });
      chrome.storage.sync.set({ history });
    }
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

  cb.addEventListener('change', () => {
    task.classList.toggle('done', cb.checked);
    saveTasks();
  });

  task.appendChild(cb);
  task.appendChild(label);
  taskList.appendChild(task);
}

// Load everything on page open
document.body.classList.add('no-transition');

chrome.storage.sync.get(['tasks', 'todayDate', 'theme'], (result) => {
  const saved = result.tasks || [];
  const savedDate = result.todayDate || null;
  const today = getToday();

  if (savedDate && savedDate !== today) {
    archiveTasks(saved, savedDate);
    chrome.storage.sync.set({ tasks: [], todayDate: null });
  } else if (saved.length > 0) {
    container.classList.add('has-tasks');
    saved.forEach(t => createTask(t.text, t.done));
  }

  if (result.theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = moonSVG;
  } else {
    themeToggle.innerHTML = sunSVG;
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
      chrome.storage.sync.set({ todayDate: getToday() });
    }

    createTask(text, false);
    saveTasks();
    input.focus();
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggle.innerHTML = isDark ? moonSVG : sunSVG;
  chrome.storage.sync.set({ theme: isDark ? 'dark' : 'light' });
});