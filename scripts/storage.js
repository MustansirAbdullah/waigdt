/* ==========================================================================
   STORAGE — Thin wrappers around chrome.storage.local
   ========================================================================== */

function storageGet(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function storageSet(data) {
  return new Promise(resolve => chrome.storage.local.set(data, resolve));
}

function getToday() {
  return new Date().toLocaleDateString('sv');
}
