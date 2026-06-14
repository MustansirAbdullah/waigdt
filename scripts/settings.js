/* ==========================================================================
   SETTINGS — Theme toggle, sound toggle, background colour picker
   ========================================================================== */

const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
const sunSVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;

// Exposed globally so tasks.js can read it
window.soundEnabled = true;

function applyBgColor(color) {
  document.body.style.backgroundColor = color;
  document.body.style.backgroundImage = `radial-gradient(var(--bg-grid) 1px, transparent 1px)`;
  document.body.style.backgroundSize = '40px 40px';
}

function initTheme(savedTheme) {
  const themeToggle = document.getElementById('themeToggle');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.innerHTML = moonSVG;
  } else {
    themeToggle.innerHTML = sunSVG;
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeToggle.innerHTML = isDark ? moonSVG : sunSVG;
    storageSet({ theme: isDark ? 'dark' : 'light' });
    // Clear any custom bg colour so CSS variables take over
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = '';
  });
}

function initBgColor(savedColor) {
  const bgColorPicker = document.getElementById('bgColorPicker');

  if (savedColor) {
    bgColorPicker.value = savedColor;
    applyBgColor(savedColor);
  }

  bgColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    storageSet({ bgColor: color });
    applyBgColor(color);
  });
}

function initSound(savedEnabled) {
  const soundToggle = document.getElementById('soundToggle');

  if (savedEnabled !== undefined) {
    window.soundEnabled = savedEnabled;
    soundToggle.checked = savedEnabled;
  }

  soundToggle.addEventListener('change', () => {
    window.soundEnabled = soundToggle.checked;
    storageSet({ soundEnabled: window.soundEnabled });
  });
}
