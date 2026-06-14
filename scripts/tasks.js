/* ==========================================================================
   TASKS — createTask, saveTasks, archiveTasks
   ========================================================================== */

const trashSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 640 640" fill="currentColor"><path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/></svg>`;

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(task => {
    tasks.push({
      text: task.querySelector('label').textContent,
      done: task.classList.contains('done')
    });
  });
  storageSet({ tasks });
}

async function archiveTasks(date) {
  const result = await storageGet(['completedTasks', 'tasks', 'history']);
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

  await storageSet({
    history,
    tasks: [],
    todayDate: null,
    completedTasks: []
  });
}

function createTask(text, done = false) {
  const taskList = document.getElementById('taskList');
  const container = document.getElementById('container');

  const task = document.createElement('div');
  task.className = 'task' + (done ? ' done' : '');

  const id = crypto.randomUUID();

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

  deleteBtn.addEventListener('click', async () => {
    const wasCompleted = task.classList.contains('done');

    if (!wasCompleted) {
      const result = await storageGet(['totalAdded']);
      await storageSet({ totalAdded: Math.max(0, (result.totalAdded || 0) - 1) });
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

  cb.addEventListener('change', async () => {
    const isNowDone = cb.checked;
    task.classList.toggle('done', isNowDone);

    if (isNowDone) {
      if (window.soundEnabled) {
        const tick = new Audio(chrome.runtime.getURL('assets/tick.wav'));
        tick.volume = 0.3;
        tick.play();
      }
      taskList.appendChild(task);
    } else {
      taskList.insertBefore(task, taskList.firstChild);
    }

    const result = await storageGet(['completedTasks']);
    const completedTasks = result.completedTasks || [];

    if (isNowDone) {
      completedTasks.push(text);
    } else {
      const idx = completedTasks.lastIndexOf(text);
      if (idx !== -1) completedTasks.splice(idx, 1);
    }

    await storageSet({ completedTasks });
    saveTasks();
  });

  task.appendChild(cb);
  task.appendChild(label);
  task.appendChild(deleteBtn);
  taskList.insertBefore(task, taskList.firstChild);

  if (done) {
    taskList.appendChild(task); }      // completed → bottom
  else {
    taskList.insertBefore(task, taskList.firstChild); // active → top
}
}
