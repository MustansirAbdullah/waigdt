const input = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const container = document.getElementById('container');

// Save all current tasks to storage
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

// Create a task element and append it
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

// Load tasks from storage on page open
chrome.storage.sync.get(['tasks'], (result) => {
  const saved = result.tasks || [];
  if (saved.length > 0) {
    container.classList.add('has-tasks');
    saved.forEach(t => createTask(t.text, t.done));
  }
  input.focus();
});

// Add task on enter
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const text = input.value.trim();
    input.value = '';

    if (taskList.children.length === 0) {
      container.classList.add('has-tasks');
    }

    createTask(text, false);
    saveTasks();
    input.focus();
  }
});